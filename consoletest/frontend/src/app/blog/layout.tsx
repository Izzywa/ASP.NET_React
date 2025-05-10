export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
        <h2>Blog</h2>
    <section>{children}</section>
    </>
)
}