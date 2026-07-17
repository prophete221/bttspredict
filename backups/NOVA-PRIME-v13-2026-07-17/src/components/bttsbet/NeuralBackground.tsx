'use client'

// NeuralBackground removed in v9 — the canvas-based neural network visualization
// was a heavy performance cost (continuous redraws, mouse tracking) with zero
// conversion value. The new design uses subtle CSS gradient backgrounds instead.
export default function NeuralBackground() {
  return null
}
