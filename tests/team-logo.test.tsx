import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import TeamLogo, { resolveTeamLogoSrc } from '@/components/bttsbet/TeamLogo'

afterEach(() => cleanup())

const replacements = [
  ['Toulouse', 'https://a.espncdn.com/i/teamlogos/soccer/500/131876.png', 'https://a.espncdn.com/i/teamlogos/soccer/500/179.png'],
  ['Brondby', 'https://a.espncdn.com/i/teamlogos/soccer/500/20109.png', 'https://a.espncdn.com/i/teamlogos/soccer/500/575.png'],
  ['Rosenborg', 'https://a.espncdn.com/i/teamlogos/soccer/500/131632.png', 'https://a.espncdn.com/i/teamlogos/soccer/500/438.png'],
  ['Nantes', 'https://a.espncdn.com/i/teamlogos/soccer/500/22328.png', 'https://a.espncdn.com/i/teamlogos/soccer/500/165.png'],
  ['Lens', 'https://a.espncdn.com/i/teamlogos/soccer/500/131297.png', 'https://a.espncdn.com/i/teamlogos/soccer/500/175.png'],
] as const

describe('TeamLogo', () => {
  it.each(replacements)('remaps the invalid %s ESPN asset to its active club logo', (_team, invalidUrl, activeUrl) => {
    expect(resolveTeamLogoSrc(invalidUrl)).toBe(activeUrl)
  })

  it('leaves valid image URLs unchanged', () => {
    const validUrl = 'https://a.espncdn.com/i/teamlogos/soccer/500/7225.png'
    expect(resolveTeamLogoSrc(validUrl)).toBe(validUrl)
  })

  it('renders initials immediately when no image URL is provided', () => {
    const { container } = render(<TeamLogo name="Unknown FC" />)

    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByTestId('team-logo-fallback').textContent).toBe('UNK')
  })

  it('keeps the fallback visible until a valid image fires load', () => {
    const { container } = render(
      <TeamLogo name="Alianza FC" src="https://a.espncdn.com/i/teamlogos/soccer/500/7225.png" />,
    )
    const image = screen.getByRole('img', { name: 'Alianza FC logo' }) as HTMLImageElement

    expect(image.style.opacity).toBe('0')
    expect(screen.getByTestId('team-logo-fallback').textContent).toBe('ALI')

    fireEvent.load(image)

    expect(image.style.opacity).toBe('1')
    expect(container.querySelector('[data-testid="team-logo-fallback"]')).toBeNull()
  })

  it('keeps the fallback and removes an image after its error event', () => {
    const { container } = render(
      <TeamLogo name="Gimnasia y Esgrima" src="https://example.invalid/missing.png" />,
    )
    const image = screen.getByRole('img', { name: 'Gimnasia y Esgrima logo' })

    fireEvent.error(image)

    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByTestId('team-logo-fallback').textContent).toBe('GIM')
  })

  it('server-renders a fallback and never exposes a known 404 URL', () => {
    const invalidUrl = 'https://a.espncdn.com/i/teamlogos/soccer/500/131876.png'
    const replacementUrl = 'https://a.espncdn.com/i/teamlogos/soccer/500/179.png'
    const html = renderToString(<TeamLogo name="Toulouse" src={invalidUrl} />)

    expect(html).toContain('TOU')
    expect(html).toContain(`src="${replacementUrl}"`)
    expect(html).not.toContain(invalidUrl)
    expect(html).toContain('opacity:0')
  })
})
