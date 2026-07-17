import { useMemo } from 'react'

/**
 * Safe HTML renderer — converts HTML string to React elements
 * without using dangerouslySetInnerHTML.
 * Only allows safe tags (h2, h3, p, strong, em, blockquote, ul, ol, li, a, br).
 */
function parseHTML(html) {
  if (typeof DOMParser === 'undefined') return []

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstChild

  return Array.from(root.childNodes).map((node, i) => renderNode(node, i))
}

const ALLOWED_TAGS = new Set(['H2', 'H3', 'P', 'STRONG', 'EM', 'BLOCKQUOTE', 'UL', 'OL', 'LI', 'A', 'BR', 'B', 'I', 'SPAN'])

function renderNode(node, key) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null
  if (!ALLOWED_TAGS.has(node.tagName)) return null

  const children = Array.from(node.childNodes).map((child, i) => renderNode(child, i))

  const Tag = node.tagName.toLowerCase()

  // Safe attribute extraction with XSS protection
  const props = { key }
  if (Tag === 'a') {
    const href = node.getAttribute('href') || '#'
    // Block dangerous protocols to prevent XSS
    props.href = /^\s*(javascript|vbscript|data)\s*:/i.test(href) ? 'about:blank#' : href
    props.target = '_blank'
    props.rel = 'noopener noreferrer'
  }

  return <Tag {...props}>{children}</Tag>
}

export default function BlogContent({ html }) {
  const elements = useMemo(() => parseHTML(html), [html])

  return <>{elements}</>
}
