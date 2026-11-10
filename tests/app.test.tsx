import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../src/App'

it('renders the Zoo Noturno shell', () => {
  render(<App />)

  expect(screen.getByRole('heading', { name: /zoo noturno/i })).toBeInTheDocument()
})

it('earns paws when the panda is clicked', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('button', { name: /panda/i }))

  expect(screen.getByText(/1 patas/i)).toBeInTheDocument()
})

it('opens the habitat map from navigation', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: 'Mapa' }))
  expect(screen.getByRole('heading', { name: 'Mapa' })).toBeInTheDocument()
})
