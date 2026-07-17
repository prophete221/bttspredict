'use client'

// CursorEffect removed in v9 — was a performance drain with no conversion value.
// Custom cursors confuse mobile users and add unnecessary JS overhead.
// Native cursor is more accessible and performant.
export default function CursorEffect() {
  return null
}
