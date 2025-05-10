import { Suspense } from "react"

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
        <h1>students table</h1>
        <Suspense>
        {children}
        </Suspense>
        </>
    )
}