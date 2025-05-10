export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
        <h1>navbar</h1>
    <section>{children}</section>
    </>
)
}