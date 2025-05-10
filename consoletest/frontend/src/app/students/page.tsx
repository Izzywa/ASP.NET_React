interface Student {
    studentId: number;
    firstName: string;
    lastName: string;
    school: string;
}

export default async function Page() {
    const data = await fetch('http://localhost:5280/api/students')
    const posts = await data.json()

    console.log(posts)
    return(
        <div>
            <h1>students table</h1>
            {posts.map((post: Student) => {
                return <p key={post.studentId}>ID: {post.studentId}, {post.firstName} {post.lastName} from {post.school}</p>
            })}
        </div>
    )
}