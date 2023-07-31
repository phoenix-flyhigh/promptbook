import { render, RenderResult } from "@testing-library/react"
import { SessionProvider, SessionProviderProps } from 'next-auth/react'
import { Provider } from "react"

const renderWithSession: (ui: any, session?: any) => any = (
    ui,
    session
) => {
    return render(
        <SessionProvider session={session ?? null}>
            {ui}
        </SessionProvider>
    )
}

export default renderWithSession;