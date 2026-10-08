'use client'

/**
 * VectorWordmark — wordmark animé interactif (style « Vector Wordmark » Originkit).
 *
 * Rendu WebGL par-dessus un conteneur positionné (le titre du hero) :
 *  - atlas 2D : canal R = texte plein, canal G = contour pointillé (esthétique outil de design)
 *  - fragment shader : flou 6 taps, balayage lumineux, proximité du pointeur,
 *    3 poignées dérivantes reliées par tirets + boîtes d'accent, fondu du bas
 *  - repli gracieux : si WebGL échoue, le titre statique du h1 reste affiché
 *    (le composant n'appelle onReady que lorsque la première frame est rendue).
 *
 * Accessibilité : le canvas est aria-hidden ; le vrai texte du h1 reste dans le DOM.
 */

import { useEffect, useRef, useState } from 'react'

export interface VectorWordmarkHandles {
  size?: number
  spread?: number
  labels?: boolean
}

export interface VectorWordmarkProps {
  text: string
  font?: string
  weight?: number | string
  textColor?: string
  shade?: string
  accent?: string
  reach?: number
  speed?: number
  damping?: number
  handles?: VectorWordmarkHandles
  className?: string
  style?: React.CSSProperties
  /** Appelé après la première frame WebGL réellement rendue. */
  onReady?: () => void
  /** Appelé si WebGL échoue ou est perdu (le titre statique doit réapparaître). */
  onError?: () => void
}

/* ── Constantes du motion design (repères Originkit) ───────────────────────── */

const HANDLES = 3
const CELL_ASPECT = 0.6
const DRIFT_X = 0.08
const DRIFT_Y = 0.04
const DRIFT_RATE = 1.3
const SWEEP_RATE = 0.5
const SWEEP_BAND = 0.28
const RESNAP = 0.2
const DAMP_REF = 20
const SPEED_REF = 50
const DOT_DIAMETER = 4 / 440 // diamètre des points, relatif à la hauteur de l'atlas
const DOT_PITCH = 12 / 440   // pas des points, relatif à la hauteur de l'atlas
const MAX_DPR = 2
const REF_WIDTH = 1200
const MAX_TEX = 4096
const HANDLE_DEFAULTS = { size: 109, spread: 27, labels: true }

/* ── Couleurs ──────────────────────────────────────────────────────────────── */

type RGB = [number, number, number]

function parseColor(input: string | undefined, fallback: RGB): RGB {
  if (!input) return fallback
  let v = input.trim()
  if (v === 'transparent') return [0, 0, 0]
  // Résolution de var(--x) via le style calculé du document
  if (v.startsWith('var(') && typeof document !== 'undefined') {
    try {
      const el = document.createElement('span')
      el.style.color = v
      el.style.display = 'none'
      document.body.appendChild(el)
      const c = getComputedStyle(el).color
      document.body.removeChild(el)
      if (c) v = c
    } catch { /* ignore */ }
  }
  const mHex = /^#([0-9a-f]{3,8})$/i.exec(v)
  if (mHex) {
    const h = mHex[1]
    const n = h.length
    const s = n <= 4 ? h.split('').map(c => c + c).join('') : h
    const r = parseInt(s.slice(0, 2), 16) / 255
    const g = parseInt(s.slice(2, 4), 16) / 255
    const b = parseInt(s.slice(4, 6), 16) / 255
    if ([r, g, b].some(Number.isNaN)) return fallback
    return [r, g, b]
  }
  const mRgb = /^rgba?\(([^)]+)\)$/i.exec(v)
  if (mRgb) {
    const parts = mRgb[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat)
    if (parts.length >= 3 && parts.slice(0, 3).every(n => !Number.isNaN(n))) {
      return [parts[0] / 255, parts[1] / 255, parts[2] / 255]
    }
  }
  const mHsl = /^hsla?\(([^)]+)\)$/i.exec(v)
  if (mHsl) {
    const parts = mHsl[1].split(/[\s,/]+/).filter(Boolean)
    const h = parseFloat(parts[0]) / 360
    const s = parseFloat(parts[1]) / 100
    const l = parseFloat(parts[2]) / 100
    if (![h, s, l].every(n => !Number.isNaN(n))) return fallback
    const k = (n: number) => (n + h * 12) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [f(0), f(8), f(4)]
  }
  return fallback
}

/* ── Shaders (GLSL ES 1.00 — compatible WebGL1/2) ──────────────────────────── */

const VERT_SRC = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG_SRC = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform vec2 uPointer;
uniform float uReach;
uniform float uSweep;
uniform float uAspect;
uniform float uHalf;
uniform vec3 uTextCol;
uniform vec3 uShadeCol;
uniform vec3 uAccentCol;
uniform vec2 uV0;
uniform vec2 uV1;
uniform vec2 uV2;
uniform float uLabels;

const float SWEEP_BAND = ${SWEEP_BAND.toFixed(4)};
const float DOT_D = ${(4 / 440).toFixed(5)};

vec2 blurRG(vec2 uv, vec2 o) {
  vec2 s = vec2(0.0);
  s += vec2(texture2D(uTex, uv).r, texture2D(uTex, uv).g);
  s += vec2(texture2D(uTex, uv + vec2(o.x, 0.0)).r, texture2D(uTex, uv + vec2(o.x, 0.0)).g);
  s += vec2(texture2D(uTex, uv - vec2(o.x, 0.0)).r, texture2D(uTex, uv - vec2(o.x, 0.0)).g);
  s += vec2(texture2D(uTex, uv + vec2(0.0, o.y)).r, texture2D(uTex, uv + vec2(0.0, o.y)).g);
  s += vec2(texture2D(uTex, uv - vec2(0.0, o.y)).r, texture2D(uTex, uv - vec2(0.0, o.y)).g);
  s += vec2(texture2D(uTex, uv + o).r, texture2D(uTex, uv + o).g);
  return s / 6.0;
}

float sdSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}

float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0);
}

float crossMark(vec2 p, vec2 c, float hs, float w) {
  vec2 d = abs(p - c);
  float ch = (1.0 - smoothstep(0.0, w, d.y)) * step(d.x, hs * 0.55);
  float cv = (1.0 - smoothstep(0.0, w, d.x)) * step(d.y, hs * 0.55);
  return max(ch, cv);
}

void main() {
  vec2 uv = vUv;
  vec2 sa = vec2(uv.x * uAspect, uv.y);   // espace corrigé (isotrope, unité = hauteur de boîte)

  vec2 o = uTexel * 1.5;
  vec2 bl = blurRG(uv, o);
  float crisp = texture2D(uTex, uv).r;
  float fill = max(crisp, bl.x);
  float dots = bl.y;

  // fondu progressif vers le bas
  float fade = 0.55 + 0.45 * pow(clamp(sa.y, 0.0, 1.0), 0.7);

  // proximité du pointeur
  float d = distance(sa, uPointer);
  float k = 1.0 - pow(smoothstep(0.0, uReach, d), 3.0);

  // balayage lumineux horizontal
  float sp = fract(uSweep);
  float ds = abs(uv.x - sp);
  ds = min(ds, 1.0 - ds);
  float band = 1.0 - smoothstep(0.0, SWEEP_BAND, ds);

  vec3 textCol = mix(uTextCol, uShadeCol, clamp(band * 0.85 + k * 0.55, 0.0, 1.0));
  vec3 col = textCol * fill;
  col += uAccentCol * dots * (0.5 + 0.5 * k);

  // poignées : tirets entre poignées + boîtes d'accent + marques +
  vec2 v0 = vec2(uV0.x * uAspect, uV0.y);
  vec2 v1 = vec2(uV1.x * uAspect, uV1.y);
  vec2 v2 = vec2(uV2.x * uAspect, uV2.y);
  float seg = min(min(sdSeg(sa, v0, v1), sdSeg(sa, v1, v2)), sdSeg(sa, v2, v0));
  float dash = step(0.5, fract(seg * 46.0));
  float lineA = (1.0 - smoothstep(0.0, 0.0045, seg)) * dash;
  col += uAccentCol * lineA * (0.35 + 0.4 * k);

  float bh = min(min(abs(sdBox(sa - v0, vec2(uHalf))), abs(sdBox(sa - v1, vec2(uHalf)))), abs(sdBox(sa - v2, vec2(uHalf))));
  float boxA = 1.0 - smoothstep(0.0, 0.006, bh);
  col += uAccentCol * boxA * (0.6 + 0.4 * k);

  if (uLabels > 0.5) {
    float cw2 = max(max(crossMark(sa, v0, uHalf, DOT_D), crossMark(sa, v1, uHalf, DOT_D)), crossMark(sa, v2, uHalf, DOT_D));
    col += uAccentCol * cw2 * 0.9;
  }

  float alpha = clamp(fill + dots * (0.5 + 0.5 * k) + lineA * (0.35 + 0.4 * k) + boxA * (0.6 + 0.4 * k), 0.0, 1.0) * fade;
  gl_FragColor = vec4(col * alpha, alpha); // alpha prémultiplié
}
`

/* ── Composant ─────────────────────────────────────────────────────────────── */

interface Cell { x: number; y: number; ex: number; ey: number }

export default function VectorWordmark({
  text,
  font = 'Inter, system-ui, sans-serif',
  weight = 800,
  textColor = '#F2F6FA',
  shade = '#FFFFFF',
  accent = '#34D399',
  reach = 290,
  speed = 50,
  damping = 60,
  handles,
  className,
  style,
  onReady,
  onError,
}: VectorWordmarkProps) {
  const hostRef = useRef<HTMLSpanElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [failed, setFailed] = useState(false)
  const cbs = useRef({ onReady, onError })
  cbs.current = { onReady, onError }

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas || failed) return

    let disposed = false
    let raf = 0
    let gl: WebGLRenderingContext | null = null
    let program: WebGLProgram | null = null
    let buffer: WebGLBuffer | null = null
    let texture: WebGLTexture | null = null
    let atlas: HTMLCanvasElement | null = null
    let pxW = 0
    let pxH = 0
    let boxW = 0
    let boxH = 0
    let sweepT = Math.random()
    let driftT = 0
    let inView = true
    let firstFrame = false
    const pointer = { x: -1, y: -1, active: false }
    const hg = {
      size: handles?.size ?? HANDLE_DEFAULTS.size,
      spread: handles?.spread ?? HANDLE_DEFAULTS.spread,
      labels: handles?.labels ?? HANDLE_DEFAULTS.labels,
    }
    const cw0 = Math.max(0.02, hg.spread / 100)
    const cells: Cell[] = [
      { x: 0.5 - cw0, y: 0.3, ex: 0.5 - cw0, ey: 0.3 },
      { x: 0.5, y: 0.76, ex: 0.5, ey: 0.76 },
      { x: 0.5 + cw0, y: 0.3, ex: 0.5 + cw0, ey: 0.3 },
    ]
    const u = {} as Record<string, WebGLUniformLocation | null>

    const fail = (reason?: string) => {
      if (disposed || failed) return
      try { console.warn('[VectorWordmark] fail:', reason ?? 'unknown') } catch { /* ignore */ }
      if (host && reason) host.setAttribute('data-vwm-fail', reason)
      setFailed(true)
      cbs.current.onError?.()
    }

    const compile = (type: number, src: string): WebGLShader | null => {
      if (!gl) return null
      const sh = gl.createShader(type)
      if (!sh) return null
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh)
        return null
      }
      return sh
    }

    const initGL = (): boolean => {
      const opts: WebGLContextAttributes = {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
      }
      gl = (canvas.getContext('webgl2', opts) ||
        canvas.getContext('webgl', opts) ||
        canvas.getContext('experimental-webgl', opts)) as WebGLRenderingContext | null
      if (!gl) return false
      const vs = compile(gl.VERTEX_SHADER, VERT_SRC)
      const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC)
      if (!vs || !fs) return false
      program = gl.createProgram()
      if (!program) return false
      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false
      gl.useProgram(program)
      buffer = gl.createBuffer()
      if (!buffer) return false
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
      const aPos = gl.getAttribLocation(program, 'aPos')
      gl.enableVertexAttribArray(aPos)
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
      for (const name of ['uTex', 'uTexel', 'uPointer', 'uReach', 'uSweep', 'uAspect', 'uHalf',
        'uTextCol', 'uShadeCol', 'uAccentCol', 'uV0', 'uV1', 'uV2', 'uLabels']) {
        u[name] = gl.getUniformLocation(program, name)
      }
      texture = gl.createTexture()
      if (!texture) return false
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      gl.clearColor(0, 0, 0, 0)
      canvas.addEventListener('webglcontextlost', onContextLost)
      return true
    }

    const onContextLost = (e: Event) => {
      e.preventDefault()
      fail()
    }

    const buildAtlas = (): boolean => {
      if (!gl || !host) return false
      const rect = host.getBoundingClientRect()
      boxW = Math.max(1, rect.width)
      boxH = Math.max(1, rect.height)
      const dprRaw = Math.min(MAX_DPR, window.devicePixelRatio || 1)
      const dpr = Math.min(dprRaw, MAX_TEX / boxW, MAX_TEX / boxH)
      if (dpr <= 0) return false
      pxW = Math.max(2, Math.round(boxW * dpr))
      pxH = Math.max(2, Math.round(boxH * dpr))
      canvas.width = pxW
      canvas.height = pxH

      atlas = atlas ?? document.createElement('canvas')
      atlas.width = pxW
      atlas.height = pxH
      const ctx = atlas.getContext('2d')
      if (!ctx) return false
      ctx.clearRect(0, 0, pxW, pxH)

      // Ajustement de la taille de police pour remplir la boîte
      const weightStr = typeof weight === 'number' ? String(weight) : weight
      const fontAt = (fs: number) => { ctx.font = `${weightStr} ${fs}px ${font}` }
      let fsize = pxH * 0.72
      fontAt(fsize)
      let m = ctx.measureText(text)
      const maxW = pxW * 0.96
      const maxH = pxH * 0.92
      if (m.width > maxW && m.width > 0) {
        fsize *= maxW / m.width
        fontAt(fsize)
        m = ctx.measureText(text)
      }
      const asc = m.actualBoundingBoxAscent || fsize * 0.72
      const desc = m.actualBoundingBoxDescent || fsize * 0.2
      const used = asc + desc
      if (used > maxH && used > 0) {
        fsize *= maxH / used
        fontAt(fsize)
        m = ctx.measureText(text)
      }
      const asc2 = m.actualBoundingBoxAscent || fsize * 0.72
      const desc2 = m.actualBoundingBoxDescent || fsize * 0.2
      const x = Math.max(0, (pxW - m.width) / 2)
      const baseY = pxH / 2 + (asc2 - desc2) / 2

      // Canal R : texte plein
      ctx.fillStyle = '#ff0000'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText(text, x, baseY)

      // Canal G : contour pointillé (composite additif)
      ctx.globalCompositeOperation = 'lighter'
      ctx.strokeStyle = '#00ff00'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = Math.max(1.2, pxH * DOT_DIAMETER * 4)
      ctx.setLineDash([0.01, Math.max(3, pxH * DOT_PITCH * 4)])
      ctx.strokeText(text, x, baseY)
      ctx.setLineDash([])
      ctx.globalCompositeOperation = 'source-over'

      gl.viewport(0, 0, pxW, pxH)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas)
      } catch {
        return false
      }
      if (gl) gl.uniform2f(u.uTexel ?? null, 1 / pxW, 1 / pxH)
      return true
    }

    // step() — grille, dérive, attraction pointeur, uniformes, dessin
    const step = (dt: number): void => {
      if (!gl) return
      const rate = Math.max(0, speed) / SPEED_REF
      const cw = Math.max(0.01, hg.spread / 100)
      const ch = cw * CELL_ASPECT
      const aspect = boxW / boxH

      sweepT = (sweepT + dt * SWEEP_RATE * rate) % 1
      driftT += dt * DRIFT_RATE * rate

      const resnap = 1 - Math.exp(-RESNAP * dt * 6)
      const easeK = 1 - Math.exp(-dt * (damping / DAMP_REF) * 8)
      const reachN = reach / boxH

      for (let i = 0; i < HANDLES; i += 1) {
        const c = cells[i]
        // alignement sur la grille (snap) — complément du code d'origine
        const sx = Math.round(c.x / cw - 0.5)
        const sy = Math.round(c.y / ch - 0.5)
        const gx = (sx + 0.5) * cw
        const gy = (sy + 0.5) * ch
        c.x += (gx - c.x) * resnap
        c.y += (gy - c.y) * resnap
        // dérive sinusoidale lente
        const ph = i * 2.094
        const dxa = Math.sin(driftT * 0.9 + ph) * DRIFT_X * cw
        const dya = Math.cos(driftT * 0.7 + ph * 1.3) * DRIFT_Y
        // attraction vers le pointeur (amortie, limitée)
        let ax = 0
        let ay = 0
        if (pointer.active) {
          const dx = pointer.x - c.x
          const dy = pointer.y - c.y
          const dist = Math.hypot(dx * aspect, dy)
          if (dist < reachN && dist > 1e-4) {
            const f = (1 - dist / reachN) * 0.28
            ax = dx * f
            ay = dy * f
          }
        }
        const tx = Math.min(0.96, Math.max(0.04, c.x + dxa + ax))
        const ty = Math.min(0.9, Math.max(0.1, c.y + dya + ay))
        c.ex += (tx - c.ex) * easeK
        c.ey += (ty - c.ey) * easeK
      }

      const sizePx = Math.min(boxH * 0.42, Math.max(24, (hg.size * boxW) / REF_WIDTH))
      gl.viewport(0, 0, pxW, pxH)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(u.uPointer ?? null, pointer.active ? pointer.x * aspect : -10, pointer.active ? pointer.y : -10)
      gl.uniform1f(u.uReach ?? null, reachN)
      gl.uniform1f(u.uSweep ?? null, sweepT)
      gl.uniform1f(u.uAspect ?? null, aspect)
      gl.uniform1f(u.uHalf ?? null, sizePx / 2 / boxH)
      const tc = parseColor(textColor, [0.949, 0.965, 0.98])
      const sc = parseColor(shade, [1, 1, 1])
      const ac = parseColor(accent, [0.204, 0.827, 0.6])
      gl.uniform3f(u.uTextCol ?? null, tc[0], tc[1], tc[2])
      gl.uniform3f(u.uShadeCol ?? null, sc[0], sc[1], sc[2])
      gl.uniform3f(u.uAccentCol ?? null, ac[0], ac[1], ac[2])
      gl.uniform2f(u.uV0 ?? null, cells[0].ex, cells[0].ey)
      gl.uniform2f(u.uV1 ?? null, cells[1].ex, cells[1].ey)
      gl.uniform2f(u.uV2 ?? null, cells[2].ex, cells[2].ey)
      gl.uniform1f(u.uLabels ?? null, hg.labels ? 1 : 0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      if (!firstFrame) {
        firstFrame = true
        cbs.current.onReady?.()
      }
    }

    let last = 0
    const loop = (now: number): void => {
      if (disposed) return
      raf = requestAnimationFrame(loop)
      if (!inView || document.hidden) { last = now; return }
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
      last = now
      if (dt > 0) step(dt)
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const start = (): void => {
      if (disposed) return
      try {
        if (!initGL()) { fail('initGL'); return }
        if (!buildAtlas()) { fail('atlas'); return }
        // uniforms dépendant de l'atlas
        if (gl) gl.uniform1i(u.uTex ?? null, 0)
        if (reduced) {
          step(0.016) // une seule frame statique
          return
        }
        raf = requestAnimationFrame(loop)
      } catch (e) {
        fail('exception:' + (e instanceof Error ? e.message : String(e)))
      }
    }

    const onPointerMove = (e: PointerEvent): void => {
      const rect = host.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      pointer.x = (e.clientX - rect.left) / rect.width
      pointer.y = 1 - (e.clientY - rect.top) / rect.height
      pointer.active = true
    }
    const onPointerLeave = (): void => { pointer.active = false }

    const onResize = (): void => {
      if (disposed || !gl) return
      try { buildAtlas() } catch { fail('atlas-exception') }
    }

    host.addEventListener('pointermove', onPointerMove, { passive: true })
    host.addEventListener('pointerleave', onPointerLeave, { passive: true })
    const ro = new ResizeObserver(onResize)
    ro.observe(host)
    const io = new IntersectionObserver(entries => { inView = entries[0]?.isIntersecting ?? true })
    io.observe(host)

    // Attendre la police si nécessaire, puis démarrer (avec reconversion quand prête)
    const fam = `${typeof weight === 'number' ? weight : weight} 24px ${font}`
    const fontsReady: Promise<void> =
      typeof document !== 'undefined' && 'fonts' in document
        ? (document.fonts.check(fam, text) ? Promise.resolve() : document.fonts.load(fam, text).then(() => undefined).catch(() => undefined))
        : Promise.resolve()
    const kick = window.setTimeout(start, 900) // garde-fou si fonts.load traîne
    void fontsReady.then(() => {
      if (disposed) return
      window.clearTimeout(kick)
      start()
      if ('fonts' in document) {
        void document.fonts.ready.then(() => { if (!disposed && !reduced) onResize() })
      }
    })

    return () => {
      disposed = true
      window.clearTimeout(kick)
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      if (gl) {
        try {
          if (texture) gl.deleteTexture(texture)
          if (buffer) gl.deleteBuffer(buffer)
          if (program) {
            gl.getExtension('WEBGL_lose_context')?.loseContext()
            gl.deleteProgram(program)
          }
        } catch { /* ignore */ }
      }
      gl = null
    }
    // Recréation complète quand le texte / la police changent
  }, [text, font, weight, textColor, shade, accent, reach, speed, damping,
    handles?.size, handles?.spread, handles?.labels, failed])

  if (failed) {
    // Repli : rien (le titre statique du h1 reste visible)
    return <span ref={hostRef} className={className} style={style} aria-hidden="true" />
  }

  return (
    <span
      ref={hostRef}
      className={className ? `vwm ${className}` : 'vwm'}
      style={style}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="vwm__canvas" />
    </span>
  )
}
