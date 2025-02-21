import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

const checkSessionValidity = async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return {
            error: 'Unauthorized'
        }
    }

    const userId = session.user?.id;
    if (!userId) {
        return {
            error: 'User ID not found in session'
        }
    }

    return {
        session,
        userId
    }
}

export default checkSessionValidity;