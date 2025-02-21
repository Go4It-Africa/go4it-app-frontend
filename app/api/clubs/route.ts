import { NextRequest, NextResponse } from 'next/server';
import { serverInstance } from '@/app/lib/axios';
import { Session } from 'next-auth';
import checkSessionValidity from '@/app/utils/useCheckSessionValidity';

export async function POST(req: NextRequest, res: NextResponse) {
 
const sessionData = await checkSessionValidity();

if ('error' in sessionData) {
    return NextResponse.json({ error: sessionData.error }, { status: 401 });
}

 return handlePost(req, res, sessionData.session);
}

export async function GET(req: NextRequest, res: NextResponse) {
 
const sessionData  = await checkSessionValidity();

if ('error' in sessionData) {
    return NextResponse.json({ error: sessionData.error }, { status: 401 });
}

 return handleGet(req, res, sessionData.userId);
}

const handlePost = async (req: NextRequest, res: NextResponse, session: Session) => {
 try {
    const userId = session.user.id;
    const clubData = {
        ...await req.json(),
        user_id: userId
    }

    console.log('the related club data', clubData);

    const response = await serverInstance.post('/clubs', clubData);

    if (response.status !== 201) {
        throw new Error('Failed to create club!');
    }

  return NextResponse.json(response.data, { status: 201 });
 } catch (error) {
  return handleErrors(error);
 }
};

const handleGet = async (req: NextRequest, res: NextResponse, user: string) => {
 try {
    const response = await serverInstance.get(`/clubs?user_id=${user}`);

    if (response.status !== 200) {
        throw new Error('Failed to fetch clubs');
    }

    return NextResponse.json(response.data, { status: 200 });
 } catch (error) {
  return handleErrors(error);
 }
};

const handleErrors = (error: unknown) => {
 if (error instanceof Error) {
  return NextResponse.json({ message: error.message }, { status: 500 });
 } else {
  return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
 }
};
