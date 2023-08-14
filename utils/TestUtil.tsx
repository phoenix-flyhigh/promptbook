import { render } from "@testing-library/react"
import { SessionProvider } from 'next-auth/react'

const renderWithSession: (ui: any, session?: any) => any = (
    ui,
    session
) => {
    return render(
        <SessionProvider session={session === undefined ? {
            user: {
                id: "7"
            }
        }: session}>
            {ui}
        </SessionProvider>
    )
}

export default renderWithSession;