import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home page tests', () => {
  it('Should render a title', () => {
    render(<Home />)

    const title: HTMLElement = screen.getByTestId("tid-title")

    expect(title).toBeInTheDocument()
  })

  it('Should render a description', () => {
    render(<Home />)

    const description: HTMLElement = screen.getByTestId("tid-description")

    expect(description).toBeInTheDocument()
  })
})