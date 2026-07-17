#!/bin/bash
# BttsBet – Build motion video from stills using ffmpeg zoompan + fade
set -e

DIR="/home/z/my-project/download/stills"
OUT="/home/z/my-project/download/bttsbet_motion.mp4"
FPS=24

# Create each scene with zoompan + fade
create_scene() {
    local input=$1
    local output=$2
    local duration=$3
    local frames=$((duration * FPS))
    local fade_out_start=$(echo "$duration - 0.6" | bc)
    
    ffmpeg -y -loop 1 -i "$input" \
        -vf "zoompan=z='1+0.0008*on':d=${frames}:s=1280x720:fps=${FPS},fade=t=in:st=0:d=0.6,fade=t=out:st=${fade_out_start}:d=0.6" \
        -t "$duration" -c:v libx264 -preset ultrafast -crf 23 -pix_fmt yuv420p "$output" \
        -loglevel warning 2>&1
    echo "  Scene $output done"
}

echo "[Video] Creating scenes..."

create_scene "$DIR/intro.png"       "$DIR/scene_00.mp4" 4   &
create_scene "$DIR/hero.png"        "$DIR/scene_01.mp4" 5   &
create_scene "$DIR/trans_pred.png"  "$DIR/scene_02.mp4" 2.5 &
create_scene "$DIR/predictions.png" "$DIR/scene_03.mp4" 4   &
create_scene "$DIR/trans_res.png"   "$DIR/scene_04.mp4" 2.5 &
create_scene "$DIR/results.png"     "$DIR/scene_05.mp4" 4   &

wait
echo "[Video] First batch done"

create_scene "$DIR/trans_fifa.png"  "$DIR/scene_06.mp4" 2.5 &
create_scene "$DIR/fifa.png"        "$DIR/scene_07.mp4" 4   &
create_scene "$DIR/trans_vip.png"   "$DIR/scene_08.mp4" 2.5 &
create_scene "$DIR/vip.png"         "$DIR/scene_09.mp4" 4   &
create_scene "$DIR/faq.png"         "$DIR/scene_10.mp4" 3   &
create_scene "$DIR/outro.png"       "$DIR/scene_11.mp4" 4   &

wait
echo "[Video] All scenes done"

# Create concat list
cat > "$DIR/concat.txt" << EOF
file 'scene_00.mp4'
file 'scene_01.mp4'
file 'scene_02.mp4'
file 'scene_03.mp4'
file 'scene_04.mp4'
file 'scene_05.mp4'
file 'scene_06.mp4'
file 'scene_07.mp4'
file 'scene_08.mp4'
file 'scene_09.mp4'
file 'scene_10.mp4'
file 'scene_11.mp4'
EOF

echo "[Video] Concatenating..."
ffmpeg -y -f concat -safe 0 -i "$DIR/concat.txt" \
    -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -movflags +faststart \
    "$OUT" -loglevel warning 2>&1

echo "[Video] Cleaning up..."
rm -f "$DIR"/scene_*.mp4 "$DIR"/concat.txt "$DIR"/test_scene.mp4

SIZE=$(du -m "$OUT" | cut -f1)
echo "[Video] Done! $OUT (${SIZE}MB, ~42s)"
