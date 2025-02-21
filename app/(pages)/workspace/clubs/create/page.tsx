'use client'

import { useRouter } from "next/navigation";

const CreateClubPage = () => {
    const router = useRouter();

    return (
        <div>
            <h1>Create Club</h1>

            <button onClick={() => {
                router.push('/workspace/clubs')
            }}>
                Back to Clubs
            </button>
        </div>
    )
}

export default CreateClubPage;