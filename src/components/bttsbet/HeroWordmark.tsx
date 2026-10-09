'use client'

/**
 * HeroWordmark — "Vector Wordmark" Originkit (brief designer), port fidèle BTTSPredict.
 * Titre rendu en matrice de points WebGL, réactif au curseur (netteté + poignées accent
 * reliées par ligne pointillée + étiquettes 01/02/03), balayage automatique sans pointeur.
 * Fallback statique garanti : WebGL indisponible ou prefers-reduced-motion → composant inerte.
 *
 * Aligné sur le code source Originkit fourni : HANDLES=3, CELL_ASPECT, drift sin/cos,
 * poignées amorties (verts), boîtes dimensionnées par handles.size (109 @ font 200),
 * étiquettes LABEL_MAX=0.6, sweep auto SWEEP_RATE/RESNAP.
 *
 * Ajouts site : support RTL/arabe (détection premier caractère fort → ctx.direction,
 * letterSpacing neutralisé), fit-to-width (l'atlas ne déborde jamais du conteneur),
 * pause IntersectionObserver hors viewport, pointermove fenêtre avec zone de proximité.
 *
 * AnimatedTitle : enveloppe prête à l'emploi — le texte réel reste dans le DOM (SEO),
 * bascule canvas sans décalage de mise en page (visibility:hidden garde la hauteur).
 */

import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import VectorWordmark from './VectorWordmark'

const MAX_DPR = 2
const MAX_TEX = 4096
const REF_WIDTH = 1200

const HANDLES = 3
const CELL_ASPECT = 0.6
const DRIFT_X = 0.08
const DRIFT_Y = 0.04
const DRIFT_RATE = 1.3
const DRIFT_RATE_Y = 1.3 * 1.3
const SWEEP_RATE = 0.5

const SWEEP_BAND = 0.28
const RESNAP = 0.2
const DAMP_REF = 20
const SPEED_REF = 50
const LABEL_MAX = 0.6
const DOT_DIAMETER = 4 / 440
const DOT_PITCH = 12 / 440

/** Poignées — défauts Originkit (size 109 calibré pour une fonte de 200px). */
const HANDLE_DEFAULTS = { size: 109, spread: 27, labels: true }
const REF_FONT_PX = 200

const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x)
const fract = (x: number) => x - Math.floor(x)

/** Premier caractère fort RTL (Arabe, Hébreu…) — équivalent CSS direction:auto. */
const RTL_RE = /[\u0591-\u07FF\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/

type RGBA = [number, number, number, number]

function parseColor(input: string | undefined, fallback: RGBA): RGBA {
  if (!input) return fallback
  let s = String(input).trim()
  if (s.slice(0, 4).toLowerCase() === 'var(') {
    const comma = s.indexOf(',')
    const close = s.lastIndexOf(')')
    if (comma < 0 || close < comma) return fallback
    s = s.slice(comma + 1, close).trim()
  }
  if (s[0] === '#') {
    let h = s.slice(1)
    if (h.length === 3 || h.length === 4) {
      let x = ''
      for (const c of h) x += c + c
      h = x
    }
    if (h.length === 6) h += 'ff'
    if (h.length !== 8 || /[^0-9a-f]/i.test(h)) return fallback
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
      parseInt(h.slice(6, 8), 16) / 255,
    ]
  }
  const m = s.match(/^(rgba?|hsla?)\(([^)]*)\)$/i)
  if (!m) return fallback
  const parts = m[2].split(/[\s,/]+/).filter((p) => p.length > 0)
  if (parts.length < 3) return fallback
  const num = (t: string, scale: number) => {
    const v = parseFloat(t)
    if (!Number.isFinite(v)) return 0
    return t.indexOf('%') >= 0 ? (v / 100) * scale : v
  }
  const alpha = parts.length > 3 ? clamp(num(parts[3], 1), 0, 1) : 1
  if (m[1].toLowerCase().slice(0, 3) === 'rgb') {
    return [
      clamp(num(parts[0], 255) / 255, 0, 1),
      clamp(num(parts[1], 255) / 255, 0, 1),
      clamp(num(parts[2], 255) / 255, 0, 1),
      alpha,
    ]
  }
  const hh = fract(parseFloat(parts[0]) / 360)
  const sat = clamp(num(parts[1], 1), 0, 1)
  const li = clamp(num(parts[2], 1), 0, 1)
  const q = li < 0.5 ? li * (1 + sat) : li + sat - li * sat
  const p = 2 * li - q
  const chan = (t: number) => {
    let u = fract(t)
    if (u < 1 / 6) return p + (q - p) * 6 * u
    if (u < 1 / 2) return q
    if (u < 2 / 3) return p + (q - p) * (2 / 3 - u) * 6
    return p
  }
  return [chan(hh + 1 / 3), chan(hh), chan(hh - 1 / 3), alpha]
}

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `
precision highp float;

uniform sampler2D uMap;
uniform vec2 uRes;
uniform vec2 uAtlas;
uniform vec2 uPtr;
uniform float uReach;
uniform vec3 uText;
uniform vec3 uShade;
uniform vec4 uAccent;
uniform vec2 uV0;
uniform vec2 uV1;
uniform vec2 uV2;
uniform float uHalf;

varying vec2 vUv;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 blurRG(vec2 uv, float e) {
    vec4 sum = vec4(0.0);
    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float th = radians(fi / 6.0 * 360.0);
        vec2 dir = vec2(cos(th), sin(th));
        vec2 off = dir * (hash(vec2(fi, uv.x + uv.y)) + e);
        sum += texture2D(uMap, uv + off * e);
    }
    return (sum / 6.0).rg;
}

vec2 segment(vec2 p, vec2 a, vec2 b) {
    vec2 ab = b - a;
    vec2 ap = p - a;
    float t = clamp(dot(ap, ab) / max(dot(ab, ab), 1e-8), 0.0, 1.0);
    return vec2(length(ap - ab * t), t);
}

float stroke(float d, float lw, float px) {
    return 1.0 - smoothstep(lw, lw + px, d);
}

float dashedLine(vec2 p, vec2 a, vec2 b, float lw, float px) {
    vec2 s = segment(p, a, b);
    float dash = step(0.5, fract(s.y * length(b - a) * 100.0));
    return stroke(s.x, lw, px) * dash;
}

float boxEdge(vec2 p, vec2 c, float h, float lw, float px) {
    vec2 q = abs(p - c) - vec2(h);
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    return stroke(abs(d), lw, px);
}

void main() {
    float aspect = uRes.x / uRes.y;

    vec2 E = (vUv * uRes - (uRes - uAtlas) * 0.5) / uAtlas;
    float inside = step(0.0, E.x) * step(E.x, 1.0) * step(0.0, E.y) * step(E.y, 1.0);
    vec2 safeUv = clamp(E, 0.0, 1.0);

    float b = clamp(1.0 - E.y * 3.5, 0.0, 1.0) * 0.008;
    vec2 soft = blurRG(safeUv, b);
    vec2 sharp = blurRG(safeUv, b * 0.1);

    float d = length((vUv - uPtr) / vec2(1.0, aspect));
    float k = 1.0 - pow(smoothstep(0.0, max(uReach, 1e-4), d), 3.0);

    float mask = mix(soft.r, sharp.g, k) * inside;
    vec3 fill = mix(uShade, uText, smoothstep(0.0, 1.0, E.y));

    vec2 P = vec2(vUv.x * aspect, vUv.y);
    float px = 1.0 / uRes.y;
    float lw = px * 0.2;
    float lines = max(
        max(dashedLine(P, uV0, uV1, lw, px), dashedLine(P, uV1, uV2, lw, px)),
        dashedLine(P, uV2, uV0, lw, px)
    );
    float boxes = max(
        max(boxEdge(P, uV0, uHalf, lw, px), boxEdge(P, uV1, uHalf, lw, px)),
        boxEdge(P, uV2, uHalf, lw, px)
    );
    float A = max(lines, boxes) * uAccent.a * (1.0 - vUv.y);

    vec4 card = vec4(fill * mask, mask);
    vec4 comp = vec4(uAccent.rgb * A, A) + card * (1.0 - A);

    gl_FragColor = comp * pow(clamp(E.y, 0.0, 1.0), 0.7);
}`

function compile(gl: WebGLRenderingContext, vs: string, fs: string) {
  const make = (type: number, src: string) => {
    const sh = gl.createShader(type)!
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    return sh
  }
  const p = gl.createProgram()!
  gl.attachShader(p, make(gl.VERTEX_SHADER, vs))
  gl.attachShader(p, make(gl.FRAGMENT_SHADER, fs))
  gl.bindAttribLocation(p, 0, 'aPos')
  gl.linkProgram(p)
  return p
}

type Atlas = { canvas: HTMLCanvasElement; cssW: number; cssH: number }

type FontSpec = {
  family: string
  weight: string
  style: string
  size: number
  letterSpacing: string
}

function fontString(f: FontSpec, px: number) {
  return `${f.style} ${f.weight} ${px}px ${f.family}`
}

function buildAtlas(
  text: string,
  f: FontSpec,
  drawFontPx: number,
  dpr: number
): Atlas | null {
  const probe = document.createElement('canvas').getContext('2d')
  if (!probe) return null

  const rtl = RTL_RE.test(text)

  const setFont = (ctx: CanvasRenderingContext2D, px: number) => {
    ctx.font = fontString(f, px)
    ctx.direction = rtl ? 'rtl' : 'ltr'
    try {
      if ('letterSpacing' in ctx) {
        // L'espacement letteraire casse les ligatures arabes → 0px en RTL.
        ;(ctx as unknown as { letterSpacing: string }).letterSpacing = rtl
          ? '0px'
          : f.letterSpacing
      }
    } catch {
      /* no-op */
    }
  }

  const measure = (px: number) => {
    setFont(probe, px)
    const m = probe.measureText(text)
    const asc = m.actualBoundingBoxAscent || px * 0.8
    const desc = m.actualBoundingBoxDescent || px * 0.22
    return { w: Math.max(1, m.width), asc, desc }
  }

  let fpx = Math.max(8, drawFontPx * dpr)
  let m = measure(fpx)
  let pad = fpx * 0.12
  const over = Math.max(
    (m.w + pad * 2) / MAX_TEX,
    (m.asc + m.desc + pad * 2) / MAX_TEX
  )
  if (over > 1) {
    fpx = Math.max(8, fpx / over)
    m = measure(fpx)
    pad = fpx * 0.12
  }

  const w = Math.max(1, Math.ceil(m.w + pad * 2))
  const h = Math.max(1, Math.ceil(m.asc + m.desc + pad * 2))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, w, h)
  setFont(ctx, fpx)
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  ctx.globalCompositeOperation = 'lighter'

  // Canal rouge = remplissage plein ; canal vert = pointillés dot-matrix.
  ctx.fillStyle = '#ff0000'
  ctx.fillText(text, pad, pad + m.asc)

  const block = m.asc + m.desc
  ctx.strokeStyle = '#00ff00'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = Math.max(1, block * DOT_DIAMETER)
  ctx.setLineDash([0, Math.max(2, block * DOT_PITCH)])
  ctx.strokeText(text, pad, pad + m.asc)

  const cssPerPx = drawFontPx / fpx
  return { canvas, cssW: w * cssPerPx, cssH: h * cssPerPx }
}

export type WordmarkHandles = {
  /** Taille des boîtes de poignée (px, calibrée pour une fonte de 200px). */
  size?: number
  /** Pas de la grille d'ancrage des poignées (pourcentage Originkit). */
  spread?: number
  /** Affiche les étiquettes 01/02/03 près des poignées. */
  labels?: boolean
}

export type WordmarkCanvasProps = {
  text: string
  fontFamily?: string
  fontWeight?: number
  fontPx: number
  letterSpacing?: string
  textColor?: string
  shade?: string
  accent?: string
  reach?: number
  speed?: number
  damping?: number
  handles?: WordmarkHandles
  onUnavailable?: () => void
  className?: string
}

/** Canvas WebGL brut — positionné par le parent (absolute inset-0). */
export function WordmarkCanvas({
  text,
  fontFamily = "'Poppins', 'Inter', system-ui, sans-serif",
  fontWeight = 800,
  fontPx,
  letterSpacing = '-0.01em',
  textColor = '#F2F6FA',
  shade = 'rgba(159, 178, 204, 0.20)',
  accent = '#2F7DFF',
  reach = 240,
  speed = 50,
  damping = 60,
  handles,
  onUnavailable,
  className,
}: WordmarkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const unavailableRef = useRef(false)
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null])

  const hg = { ...HANDLE_DEFAULTS, ...(handles ?? {}) }
  const labelsOn = hg.labels

  const accentRGBA = parseColor(accent, [0.18, 0.49, 1, 0.5])
  const labelColor = `rgb(${Math.round(accentRGBA[0] * 255)}, ${Math.round(
    accentRGBA[1] * 255
  )}, ${Math.round(accentRGBA[2] * 255)})`
  const labelBorder = `rgba(${Math.round(accentRGBA[0] * 255)}, ${Math.round(
    accentRGBA[1] * 255
  )}, ${Math.round(accentRGBA[2] * 255)}, 0.40)`
  const labelFontSize = Math.round(clamp(fontPx * 0.16, 9, 13))

  const markUnavailable = useCallback(() => {
    if (unavailableRef.current) return
    unavailableRef.current = true
    onUnavailable?.()
  }, [onUnavailable])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let reduced = false
    try {
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      /* no-op */
    }
    if (reduced) {
      markUnavailable()
      return
    }

    const attrs: WebGLContextAttributes = {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    }
    const gl = (canvas.getContext('webgl2', attrs) ||
      canvas.getContext('webgl', attrs)) as WebGLRenderingContext | null
    if (!gl) {
      markUnavailable()
      return
    }
    const isGL2 =
      typeof WebGL2RenderingContext !== 'undefined' &&
      gl instanceof WebGL2RenderingContext

    const prog = compile(gl, VERT, FRAG)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      markUnavailable()
      return
    }
    const U = {
      map: gl.getUniformLocation(prog, 'uMap'),
      res: gl.getUniformLocation(prog, 'uRes'),
      atlas: gl.getUniformLocation(prog, 'uAtlas'),
      ptr: gl.getUniformLocation(prog, 'uPtr'),
      reach: gl.getUniformLocation(prog, 'uReach'),
      text: gl.getUniformLocation(prog, 'uText'),
      shade: gl.getUniformLocation(prog, 'uShade'),
      accent: gl.getUniformLocation(prog, 'uAccent'),
      v0: gl.getUniformLocation(prog, 'uV0'),
      v1: gl.getUniformLocation(prog, 'uV1'),
      v2: gl.getUniformLocation(prog, 'uV2'),
      half: gl.getUniformLocation(prog, 'uHalf'),
    }

    const quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    )
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.disable(gl.BLEND)

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255])
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    let alive = true
    let inView = true

    let boxW = Math.max(1, canvas.offsetWidth)
    let boxH = Math.max(1, canvas.offsetHeight)
    let dpr = 1
    let bufW = 0
    let bufH = 0

    let atlasRatioW = 1
    let atlasRatioH = 1
    let atlasKey = ''

    function resize() {
      boxW = Math.max(1, canvas!.offsetWidth)
      boxH = Math.max(1, canvas!.offsetHeight)
      dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1)
      const w = Math.max(1, Math.round(boxW * dpr))
      const h = Math.max(1, Math.round(boxH * dpr))
      if (w === bufW && h === bufH) return
      bufW = w
      bufH = h
      canvas!.width = w
      canvas!.height = h
    }

    function rebuildAtlas() {
      const px = Math.max(8, fontPx)
      const f: FontSpec = {
        family: fontFamily,
        weight: String(fontWeight),
        style: 'normal',
        size: fontPx,
        letterSpacing,
      }
      const atlas = buildAtlas(text || ' ', f, px, dpr)
      if (!atlas) return
      atlasRatioW = Math.max(1e-4, atlas.cssW / px)
      atlasRatioH = Math.max(1e-4, atlas.cssH / px)

      if (document.fonts) {
        try {
          const probe = fontString(f, 64)
          if (!document.fonts.check(probe)) {
            const again = () => {
              if (alive) atlasKey = ''
            }
            document.fonts.load(probe, text).then(again, again)
          }
        } catch {
          /* no-op */
        }
      }
      gl!.bindTexture(gl!.TEXTURE_2D, tex)
      gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, true)
      gl!.texImage2D(
        gl!.TEXTURE_2D,
        0,
        gl!.RGBA,
        gl!.RGBA,
        gl!.UNSIGNED_BYTE,
        atlas.canvas
      )
      gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, false)
      const cw = atlas.canvas.width
      const ch = atlas.canvas.height
      const pot = (cw & (cw - 1)) === 0 && (ch & (ch - 1)) === 0

      if (isGL2 || pot) {
        gl!.generateMipmap(gl!.TEXTURE_2D)
        gl!.texParameteri(
          gl!.TEXTURE_2D,
          gl!.TEXTURE_MIN_FILTER,
          gl!.LINEAR_MIPMAP_LINEAR
        )
      } else {
        gl!.texParameteri(
          gl!.TEXTURE_2D,
          gl!.TEXTURE_MIN_FILTER,
          gl!.LINEAR
        )
      }
    }

    const target = { x: -0.5, y: 0.5 }
    const eased = { x: -0.5, y: 0.5 }
    const cells: { x: number; y: number }[] = []
    for (let i = 0; i < HANDLES; i += 1) cells.push({ x: -0.5, y: 0.5 })
    // Poignées amorties (verts) — glissement continu vers la cellule cible.
    const verts: { x: number; y: number }[] = cells.map((c) => ({ ...c }))
    const labelAlpha = [0, 0, 0]
    let hasPointer = false
    let sweepClock = 0
    let driftT = 0

    // État courant partagé step/render (recalculé à chaque frame).
    let curPx = Math.max(8, fontPx)
    let curAspect = 1
    let curHalf = 0.01
    let lastDamp = 0.1

    function snap(x: number, y: number, cw: number, ch: number) {
      const cx = Math.floor(x / cw)
      const cy = Math.floor(y / ch)
      const found: { x: number; y: number; d: number }[] = []
      for (let i = -1; i <= 1; i += 1) {
        for (let j = -1; j <= 1; j += 1) {
          const px = (cx + i + 0.5) * cw
          const py = (cy + j + 0.5) * ch
          found.push({ x: px, y: py, d: Math.hypot(px - x, py - y) })
        }
      }
      found.sort((a, b) => a.d - b.d)
      for (let i = 0; i < HANDLES; i += 1) {
        const f = found[i + 1]
        if (f) {
          cells[i].x = f.x
          cells[i].y = f.y
        }
      }
    }

    const aspectNow = () => boxW / Math.max(1, boxH)

    const onMove = (e: PointerEvent) => {
      const r = canvas!.getBoundingClientRect()
      const near =
        e.clientX > r.left - 90 &&
        e.clientX < r.right + 90 &&
        e.clientY > r.top - 90 &&
        e.clientY < r.bottom + 90
      if (!near) {
        hasPointer = false
        return
      }
      hasPointer = true
      if (r.width <= 0 || r.height <= 0) return
      target.x = (e.clientX - r.left) / r.width
      target.y = 1 - (e.clientY - r.top) / r.height
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              inView = entries[0]?.isIntersecting ?? true
            },
            { threshold: 0 }
          )
        : null
    io?.observe(canvas)

    const ro = new ResizeObserver(() => {
      resize()
    })
    ro.observe(canvas)
    resize()

    let raf = 0
    let last = 0

    function step(dt: number) {
      const cw = Math.max(0.01, hg.spread / 100)
      const ch = cw * CELL_ASPECT
      const aspect = aspectNow()
      curAspect = aspect

      if (!hasPointer) {
        const band = (atlasRatioH * curPx) / Math.max(1, boxH)
        target.x += dt * SWEEP_RATE * (speed / SPEED_REF)
        target.y = (1 - band) / 2 + SWEEP_BAND * band
        if (target.x > 1.5) {
          target.x = -0.5
          eased.x = -0.5
        }
        sweepClock += dt
        if (sweepClock >= RESNAP) {
          sweepClock = 0
          snap(target.x * aspect, target.y, cw, ch)
        }
      } else {
        snap(target.x * aspect, target.y, cw, ch)
      }

      const damp = clamp((damping / 100) * DAMP_REF * dt, 0, 1)
      eased.x += (target.x - eased.x) * damp
      eased.y += (target.y - eased.y) * damp

      driftT += dt * (speed / SPEED_REF)
      const sizePx = hg.size * (curPx / REF_FONT_PX)
      curHalf = Math.max(0.004, sizePx * 0.5 / Math.max(1, boxH))

      for (let i = 0; i < HANDLES; i += 1) {
        const c = cells[i]
        const sx = Math.round(c.x / cw - 0.5)
        const sy = Math.round(c.y / ch - 0.5)
        const bx = (sx + 0.5) * cw
        const by = (sy + 0.5) * ch
        const dx = Math.sin(driftT * DRIFT_RATE * 6.283 + i * 2.399) * DRIFT_X * cw
        const dy = Math.cos(driftT * DRIFT_RATE_Y * 6.283 + i * 1.7) * DRIFT_Y * ch
        const tx = clamp(bx + dx, -0.5, aspect + 0.5)
        const ty = clamp(by + dy, 0.02, 0.98)
        verts[i].x += (tx - verts[i].x) * damp
        verts[i].y += (ty - verts[i].y) * damp
      }
      lastDamp = damp
    }

    function render() {
      const aspect = curAspect

      gl!.viewport(0, 0, bufW, bufH)
      gl!.useProgram(prog)
      gl!.activeTexture(gl!.TEXTURE0)
      gl!.bindTexture(gl!.TEXTURE_2D, tex)
      gl!.uniform1i(U.map, 0)
      gl!.uniform2f(U.res, bufW, bufH)
      const afx = curPx * dpr
      gl!.uniform2f(U.atlas, atlasRatioW * afx, atlasRatioH * afx)
      gl!.uniform2f(U.ptr, eased.x, eased.y)
      gl!.uniform1f(U.reach, reach / REF_WIDTH)
      const tc = parseColor(textColor, [0.95, 0.96, 0.98, 1])
      const sc = parseColor(shade, [0.62, 0.7, 0.8, 1])
      const ac = parseColor(accent, [0.18, 0.49, 1, 0.5])
      gl!.uniform3f(U.text, tc[0], tc[1], tc[2])
      gl!.uniform3f(U.shade, sc[0], sc[1], sc[2])
      gl!.uniform4f(U.accent, ac[0], ac[1], ac[2], ac[3])
      gl!.uniform2f(U.v0, verts[0].x, verts[0].y)
      gl!.uniform2f(U.v1, verts[1].x, verts[1].y)
      gl!.uniform2f(U.v2, verts[2].x, verts[2].y)
      gl!.uniform1f(U.half, curHalf)

      gl!.clearColor(0, 0, 0, 0)
      gl!.clear(gl!.COLOR_BUFFER_BIT)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
    }

    function updateLabels() {
      if (!labelsOn) return
      for (let i = 0; i < HANDLES; i += 1) {
        const el = labelRefs.current[i]
        if (!el) continue
        const nx = verts[i].x / Math.max(1e-4, curAspect)
        const ny = 1 - verts[i].y
        const inBounds =
          verts[i].x > 0.015 &&
          verts[i].x < curAspect - 0.015 &&
          verts[i].y > 0.03 &&
          verts[i].y < 0.97
        const goal = inBounds ? LABEL_MAX : 0
        labelAlpha[i] += (goal - labelAlpha[i]) * Math.min(1, lastDamp * 3 + 0.08)
        el.style.opacity = labelAlpha[i].toFixed(3)
        el.style.transform = `translate3d(${(nx * boxW).toFixed(1)}px, ${(
          ny * boxH + 8
        ).toFixed(1)}px, 0)`
      }
    }

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      if (!alive || !inView) {
        last = t
        return
      }
      if (!last) last = t
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t

      const f: FontSpec = {
        family: fontFamily,
        weight: String(fontWeight),
        style: 'normal',
        size: fontPx,
        letterSpacing,
      }
      const key = [
        text,
        f.family,
        f.weight,
        f.style,
        f.letterSpacing,
        dpr,
        Math.ceil(Math.max(8, fontPx) / 64),
      ].join('|')
      if (key !== atlasKey) {
        atlasKey = key
        rebuildAtlas()
      }

      // Fit-to-width : l'atlas ne déborde jamais du conteneur (titres longs/mobiles).
      curPx = Math.max(
        8,
        Math.min(fontPx, (boxW * 0.985) / Math.max(1e-4, atlasRatioW))
      )

      step(dt)
      render()
      updateLabels()
    }
    raf = requestAnimationFrame(tick)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      io?.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      try {
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      } catch {
        /* no-op */
      }
    }
  }, [
    text,
    fontPx,
    fontFamily,
    fontWeight,
    letterSpacing,
    textColor,
    shade,
    accent,
    reach,
    speed,
    damping,
    markUnavailable,
  ])

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={className}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
      {labelsOn &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            ref={(el) => {
              labelRefs.current[i] = el
            }}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              opacity: 0,
              pointerEvents: 'none',
              zIndex: 2,
              display: 'inline-block',
              padding: '2px 6px',
              borderRadius: 6,
              border: `1px solid ${labelBorder}`,
              background: 'rgba(3, 6, 10, 0.55)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              color: labelColor,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontSize: labelFontSize,
              lineHeight: 1.2,
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              willChange: 'transform, opacity',
            }}
          >
            {`0${i + 1}`}
          </span>
        ))}
    </>
  )
}

export type AnimatedTitleProps = {
  text: string
  accent?: string
  as?: 'span' | 'h1' | 'h2'
  className?: string
  style?: React.CSSProperties
  fontFamily?: string
  fontWeight?: number
  /** Couleur des poignées accent (défaut bleu analyse site). */
  accentColor?: string
  /** Configuration des poignées Originkit (size/spread/labels). */
  handles?: WordmarkHandles
  /** Active l'effet (défaut true — AR/RTL supporté nativement). */
  enabled?: boolean
}

/**
 * AnimatedTitle — wordmark interactif (matrice de points, balayage lumineux,
 * proximité du curseur). Le texte réel reste rendu dans le DOM (SEO/WCAG/
 * fallback) jusqu'à la première frame du canvas, puis se fond en 150 ms —
 * il est relayé par le calque texte plein du canvas (aligné au pixel sur la
 * matrice) : le titre reste lisible à chaque instant de l'animation.
 *
 * Implémentation déléguée à VectorWordmark (Canvas 2D, repli gracieux,
 * pause hors viewport, DPR plafonné, prefers-reduced-motion respecté).
 */
export default function AnimatedTitle({
  text,
  accent,
  as = 'span',
  className,
  style,
  fontFamily,
  fontWeight = 800,
  accentColor = '#2F7DFF',
  handles,
  enabled = true,
}: AnimatedTitleProps) {
  const Tag = as as any
  const lineRef = useRef<HTMLElement | null>(null)
  const [live, setLive] = useState(false)
  const [family, setFamily] = useState('')

  const reduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* Résoudre la police réellement appliquée (next/font → nom généré). */
  useEffect(() => {
    const el = lineRef.current
    if (el) setFamily(window.getComputedStyle(el).fontFamily)
  }, [])

  const renderContent = () => {
    if (!accent) return text
    const idx = text.indexOf(accent)
    if (idx < 0) return text
    return (
      <>
        {text.slice(0, idx)}
        <em className="hp-title-em">{accent}</em>
        {text.slice(idx + accent.length)}
      </>
    )
  }

  const showCanvas = enabled && !reduced && Boolean(family)

  return (
    <Tag
      ref={lineRef as any}
      className={className}
      style={{
        ...style,
        display: 'block',
        position: 'relative',
      }}
    >
      {/* Transfert DOM→canvas : le texte DOM ne se fond (150 ms) que quand le
          canvas peint sa 1re frame — il est alors relayé par le calque texte
          plein du canvas, aligné au pixel sur la matrice de points. */}
      <span
        style={{
          opacity: live ? 0 : 1,
          transition: 'opacity 100ms ease',
        }}
      >
        {renderContent()}
      </span>
      {showCanvas && (
        <VectorWordmark
          className="hero-wordmark-layer"
          text={text}
          font={family}
          weight={fontWeight}
          accent={accentColor}
          handles={handles}
          onReady={() => setLive(true)}
          onError={() => setLive(false)}
        />
      )}
    </Tag>
  )
}
