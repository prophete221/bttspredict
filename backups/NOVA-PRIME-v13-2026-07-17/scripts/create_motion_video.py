#!/usr/bin/env python3
"""
BttsBet – Motion Video using ffmpeg filter_complex
No frame-by-frame generation. Uses ffmpeg zoompan + fade filters.
"""
import subprocess, os, sys
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = "/home/z/my-project/download"
VIDEO_PATH = os.path.join(OUTPUT_DIR, "bttsbet_motion.mp4")
STILLS_DIR = os.path.join(OUTPUT_DIR, "stills")
os.makedirs(STILLS_DIR, exist_ok=True)

W, H = 1280, 720
BG = (10, 10, 20)
EM = (0, 212, 170)
PP = (139, 92, 246)

def grad(c1, c2):
    import numpy as np
    a = np.zeros((H, W, 3), dtype=np.uint8)
    for i in range(H):
        t = i / H
        a[i, :] = [int(c1[j]*(1-t)+c2[j]*t) for j in range(3)]
    return a

def title_card(title, sub="", c1=BG, c2=(20,15,40)):
    import numpy as np
    from PIL import Image as PILImage
    img = PILImage.fromarray(grad(c1, c2))
    d = ImageDraw.Draw(img)
    try:
        ft = ImageFont.truetype("/usr/share/fonts/truetype/english/Tinos-Bold.ttf", 48)
        fs = ImageFont.truetype("/usr/share/fonts/truetype/english/Tinos-Regular.ttf", 22)
    except:
        ft = fs = ImageFont.load_default()
    bb = d.textbbox((0,0), title, font=ft)
    d.text(((W-(bb[2]-bb[0]))//2, H//2-48), title, fill="white", font=ft)
    if sub:
        bb2 = d.textbbox((0,0), sub, font=fs)
        d.text(((W-(bb2[2]-bb2[0]))//2, H//2+12), sub, fill=EM, font=fs)
    d.rectangle([(W//2-90, H//2-60),(W//2+90, H//2-58)], fill=EM)
    return img

def section_card(title, icon="", c1=(15,10,30), c2=BG):
    import numpy as np
    from PIL import Image as PILImage
    img = PILImage.fromarray(grad(c1, c2))
    d = ImageDraw.Draw(img)
    try:
        ft = ImageFont.truetype("/usr/share/fonts/truetype/english/Tinos-Bold.ttf", 38)
        fi = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    except:
        ft = fi = ImageFont.load_default()
    if icon:
        bb = d.textbbox((0,0), icon, font=fi)
        d.text(((W-(bb[2]-bb[0]))//2, H//2-55), icon, fill=PP, font=fi)
    bb = d.textbbox((0,0), title, font=ft)
    d.text(((W-(bb[2]-bb[0]))//2, H//2-8), title, fill="white", font=ft)
    d.rectangle([(W//2-55, H//2+38),(W//2+55, H//2+40)], fill=PP)
    return img

def load_resize(p):
    return Image.open(p).convert("RGB").resize((W, H), Image.LANCZOS)

# Generate still images for each scene
scenes = []  # (filepath, duration_seconds)

def save_scene(img, name, dur):
    p = os.path.join(STILLS_DIR, f"{name}.png")
    img.save(p)
    scenes.append((p, dur))

print("[Video] Creating scene images...")
save_scene(title_card("BttsBet", "Pronostics BTTS & Over 2,5 - Precision IA ~87%"), "intro", 4)
save_scene(load_resize("/home/z/my-project/download/screenshot_hero.png"), "hero", 5)
save_scene(section_card("Pronostics Gratuits", "⚽"), "trans_pred", 2.5)
save_scene(load_resize("/home/z/my-project/download/screenshot_pronostics.png"), "predictions", 4)
save_scene(section_card("Historique des Resultats", "🏆", (10,20,15), BG), "trans_res", 2.5)
save_scene(load_resize("/home/z/my-project/download/screenshot_resultats.png"), "results", 4)
save_scene(section_card("Faille FIFA Linebet", "🎮", (25,10,40), (15,5,25)), "trans_fifa", 2.5)
save_scene(load_resize("/home/z/my-project/download/screenshot_fifa.png"), "fifa", 4)
save_scene(section_card("VIP & Bonus", "💎", (10,25,20), BG), "trans_vip", 2.5)
save_scene(load_resize("/home/z/my-project/download/screenshot_vip.png"), "vip", 4)
save_scene(load_resize("/home/z/my-project/download/screenshot_faq.png"), "faq", 3)
save_scene(title_card("Rejoignez BttsBet", "Code promo: VISION221 | bttsbet.online", (10,15,10), BG), "outro", 4)

print(f"[Video] {len(scenes)} scenes created")

# Use ffmpeg with zoompan filter for each scene, then concat
# zoompan=z='1+0.001*on':d=duration*fps:s=WxH:fps=FPS
FPS = 24

# Build individual scene videos with zoompan + fade
scene_videos = []
for i, (path, dur) in enumerate(scenes):
    out = os.path.join(STILLS_DIR, f"scene_{i:02d}.mp4")
    scene_videos.append(out)
    nframes = int(dur * FPS)
    # zoompan: slight zoom in, d = number of frames
    # fade: fade in/out
    zoom_expr = "1+0.0008*on"  # slow zoom in
    filter_str = (
        f"zoompan=z='{zoom_expr}':d={nframes}:s={W}x{H}:fps={FPS},"
        f"fade=t=in:st=0:d=0.6,fade=t=out:st={dur-0.6:.1f}:d=0.6"
    )
    cmd = [
        "ffmpeg", "-y", "-loop", "1", "-i", path,
        "-vf", filter_str,
        "-t", str(dur),
        "-c:v", "libx264", "-preset", "fast", "-crf", "22",
        "-pix_fmt", "yuv420p",
        out
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"[Video] Error scene {i}: {r.stderr[-200:]}")
        sys.exit(1)
    print(f"  Scene {i+1}/{len(scenes)} done")

# Concat all scenes
concat_file = os.path.join(STILLS_DIR, "concat.txt")
with open(concat_file, "w") as f:
    for p in scene_videos:
        f.write(f"file '{p}'\n")

print("[Video] Concatenating...")
cmd = [
    "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_file,
    "-c:v", "libx264", "-preset", "medium", "-crf", "20",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    VIDEO_PATH
]
r = subprocess.run(cmd, capture_output=True, text=True)
if r.returncode != 0:
    print(f"[Video] Concat error: {r.stderr[-300:]}")
else:
    sz = os.path.getsize(VIDEO_PATH) / (1024*1024)
    total_dur = sum(d for _, d in scenes)
    print(f"[Video] Done! {VIDEO_PATH} ({sz:.1f}MB, ~{total_dur:.0f}s)")

# Cleanup
import shutil
shutil.rmtree(STILLS_DIR, ignore_errors=True)
