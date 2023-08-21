import PromptService from '@/utils/PromptService'
import mockPostsResponse from '@/utils/TestData'
import renderWithSession from '@/utils/TestUtil'
import { screen, waitFor } from '@testing-library/react'
import Home from '../page'

jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
      ...actual,
      useRouter: jest.fn().mockImplementation(() => ({
          push: jest.fn()
      })),
      usePathname: jest.fn().mockReturnValue("/profile")
  };
});

describe('Home page tests', () => {
  beforeEach(() => {
    jest.spyOn(PromptService, "getPrompts").mockResolvedValue(mockPostsResponse)
    renderWithSession(<Home />)
  })
  it('Should render a title', () => {
    const title: HTMLElement = screen.getByTestId("tid-title")

    expect(title).toBeInTheDocument()
  })

  it('Should render a description', () => {
    const description: HTMLElement = screen.getByTestId("tid-description")

    expect(description).toBeInTheDocument()
  })

  it("Should render the feed with prompts", async () => {
    await waitFor(() => {
      const userName: HTMLElement = screen.getByText("s")
      const prompt: HTMLElement = screen.getByText("This is a prompt")
      const tag: HTMLElement = screen.getByText("#software")

      expect(userName).toBeInTheDocument()
      expect(prompt).toBeInTheDocument()
      expect(tag).toBeInTheDocument()
    })
  })
})