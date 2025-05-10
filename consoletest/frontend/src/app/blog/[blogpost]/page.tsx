//function generateStaticParams() {}

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ blogpost: string}>
    searchParams: Promise<{ [key: string]: string | string[] | undefined}>
}) {
    const { blogpost } = await params
     const filters = (await searchParams).filters

    const { page = '1', sort = 'asc', query = ''} = await searchParams

    let filterElement;

    if (!!filters) {
        filterElement = <p>{filters}</p>;
    } else {
        filterElement = <p>no filters</p>;
    }
    return (
        <>
    <h1>welcome to {blogpost} blogpost</h1> 
    <div>
        <p>page: {page}</p>
        <p>sort: {sort}</p>
        <p>query: {query}</p>
    </div>
        {filterElement}
        </>
    )
}