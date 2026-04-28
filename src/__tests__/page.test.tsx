import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Home Page', () => {
  it('renders the Next.js logo', () => {
    render(<Home />)

    const logo = screen.getByAltText('Next.js logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<Home />)

    const heading = screen.getByText(/To get started, edit the page.tsx file/i)
    expect(heading).toBeInTheDocument()
  })

  it('renders the Vercel logomark', () => {
    render(<Home />)

    const vercelLogo = screen.getByAltText('Vercel logomark')
    expect(vercelLogo).toBeInTheDocument()
  })

  it('renders the Deploy Now button', () => {
    render(<Home />)

    const deployButton = screen.getByText('Deploy Now')
    expect(deployButton).toBeInTheDocument()
  })

  it('renders the Documentation link', () => {
    render(<Home />)

    const docsLink = screen.getByText('Documentation')
    expect(docsLink).toBeInTheDocument()
  })

  it('renders the Templates link', () => {
    render(<Home />)

    const templatesLink = screen.getByText('Templates')
    expect(templatesLink).toBeInTheDocument()
  })
})
