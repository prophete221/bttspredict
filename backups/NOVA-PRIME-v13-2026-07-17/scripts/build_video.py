#!/usr/bin/env python3
"""BttsBet – Motion video builder using ffmpeg subprocess calls."""
import subprocess, os, shutil

DIR = "/home/z/my-project/download/stills"
OUT = "/home/z/my-project/download/bttsbet_motion.mp4"
FPS = 24

scenes = [
    ("intro.png",       4),
    ("hero.png",        5),
    ("trans_pred.png",  2.5),
    ("predictions.png", 4),
    ("trans_res.png",   2.5),
    ("results.png",     4),
    ("trans_fifa.png",  2.5),
    ("fifa.png",        4),
    ("trans_vip.png",   2.5),
    ("vip.png",         4),
    ("faq.png",         3),
    ("outro.png",       4),
]

scene_files = []

for i, (img, dur) in enumerate(scenes):
    nframes = int(dur * FPS)
    fade_out = max(0, dur - 0.6)
    out = os.path.join(DIR, f"s{i:02d}.mp4")
    scene_files.append(out)
    
    vf = f"zoompan=z='1+0.0008*on':d={nframes}:s=1280x720:fps={FPS},fade=t=in:st=0:d=0.6,fade=t=out:st={fade_out:.1f}:d=0.6"
    
    r = subprocess.run([
        "ffmpeg", "-y", "-loop", "1", "-i", os.path.join(DIR, img),
        "-vf", vf, "-t", str(dur),
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23", "-pix_fmt", "yuv420p",
        out
    ], capture_output=True, text=True)
    
    if r.returncode != 0:
        print(f"Error scene {i}: {r.stderr[-200:]}")
        break
    print(f"  Scene {i+1}/{len(scenes)} done ({dur}s)")

# Concat
concat_path = os.path.join(DIR, "concat.txt")
with open(concat_path, "w") as f:
    for p in scene_files:
        f.write(f"file '{p}'\n")

print("[Video] Concatenating...")
r = subprocess.run([
    "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_path,
    "-c:v", "libx264", "-preset", "medium", "-crf", "20",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT
], capture_output=True, text=True)

if r.returncode != 0:
    print(f"Concat error: {r.stderr[-300:]}")
else:
    sz = os.path.getsize(OUT) / (1024*1024)
    total = sum(d for _, d in scenes)
    print(f"[Video] Done! {OUT} ({sz:.1f}MB, ~{total:.0f}s)")

# Cleanup
for f in scene_files:
    os.remove(f) if os.path.exists(f) else None
os.remove(concat_path) if os.path.exists(concat_path) else None
