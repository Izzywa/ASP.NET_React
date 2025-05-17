//1import Link from "next/link"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter"
import { Roboto } from 'next/font/google';
import { ThemeProvider } from "@mui/material/styles"
import theme from "@/theme";

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});

export default function DashboradLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return(
        <html lang="en" className={roboto.variable}>
            <body>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                {/* Layout UI */}
                {/* Place children where you want to render a page or nested layout */}
                {/*<header>
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
                </header>*/}
                <main>{children}</main>
                </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    )
}