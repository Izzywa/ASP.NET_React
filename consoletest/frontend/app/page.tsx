import Image from 'next/image'

export default function Page() {
    return (
        <div>
    <h1>Hello, Next.js!</h1>
    <h2>hello</h2>
    <Image src="/window.svg" alt="window" width={100} height={100} />
    </div>
    )
}