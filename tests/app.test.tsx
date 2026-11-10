import { render, screen } from '@testing-library/react'
import { App } from '../src/App'

it('renders the Zoo Noturno shell', () => {
  render(<App />)

  expect(screen.getByRole('heading', { name: /zoo noturno/i })).toBeInTheDocument()
})
