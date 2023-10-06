import { fireEvent, render, screen } from "@testing-library/react"
import { ThemeProvider } from "next-themes"
import ThemeChangeButton from ".."

describe("Them change button tests", () => {
    const lightThemeIconUrl = "/icons/sun-fill.svg"
    const darkThemeIconUrl = "/icons/moon-dark.svg"

    it(`Should render sun icon if theme is dark and 
        onClick switch to light theme`, () => {
        render(
            <ThemeProvider attribute="class" defaultTheme="dark">
                <ThemeChangeButton />
            </ThemeProvider>
        )

        const themeButton = screen.getByAltText("Theme change icon");

        expect(themeButton.getAttribute("src")).toBe(lightThemeIconUrl)

        fireEvent.click(themeButton)

        expect(themeButton.getAttribute("src")).toBe(darkThemeIconUrl)
    })

    it(`Should render sun icon if theme is light and 
        onClick switch to dark theme`, () => {
        render(
            <ThemeProvider attribute="class" defaultTheme="light">
                <ThemeChangeButton />
            </ThemeProvider>
        )

        const themeButton = screen.getByAltText("Theme change icon");

        expect(themeButton.getAttribute("src")).toBe(darkThemeIconUrl)

        fireEvent.click(themeButton)

        expect(themeButton.getAttribute("src")).toBe(lightThemeIconUrl)
    })
})