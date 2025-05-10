import Link from "next/link"



export default function DashboradLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return(
        <html lang="en">
            <body>
                {/* Layout UI */}
                {/* Place children where you want to render a page or nested layout */}
                <header>
                    <ul>
                    <li>
                    <Link href={'/'}>home</Link>
                    </li>
                        <li>
                    <Link href={'/blog'}>blog</Link>
                    </li>
                    <li>

                    <Link href={`/blog/${'item'}`}>item blogpost</Link>
                    </li>

                    <li>
                        <Link
                            href={{
                                pathname: '/blog/sortedPost',
                                query: {filters: 'sorted'}
                            }}>sorted blog post</Link>
                    </li>
                    </ul>
                </header>
                <main>{children}</main>
            </body>
        </html>
    )
}