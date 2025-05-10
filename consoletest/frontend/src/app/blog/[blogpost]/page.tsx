//function generateStaticParams() {}

export default async function Page({
    params,
}: {
    params: Promise<{ blogpost: string}>
}) {
    const { blogpost } = await params
    return <h1>welcome to {blogpost} blogpost</h1>
}