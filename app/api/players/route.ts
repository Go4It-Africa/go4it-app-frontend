import { NextRequest, NextResponse } from 'next/server';
import { serverInstance } from '@/app/lib/axios';
import { Session } from 'next-auth';
import checkSessionValidity from '@/app/utils/useCheckSessionValidity';
import handleErrors from '@/app/utils/axiosErrorHandler';

export async function POST(req: NextRequest, res: NextResponse) {
  const sessionData = await checkSessionValidity();

  if ('error' in sessionData) {
    return NextResponse.json({ error: sessionData.error }, { status: 401 });
  }

  return handlePost(req, res, sessionData.session);
}

export async function GET(req: NextRequest, res: NextResponse) {
  const sessionData = await checkSessionValidity();

  if ('error' in sessionData) {
    return NextResponse.json({ error: sessionData.error }, { status: 401 });
  }

  return handleGet(req, res, sessionData.userId);
}

const handlePost = async (
  req: NextRequest,
  res: NextResponse,
  session: Session
) => {
  try {
    const userId = session.user.id;
    const playerData = {
      ...(await req.json()),
      user_id: userId,
    };

    const response = await serverInstance.post('/players', playerData);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return handleErrors(error);
  }
};

const handleGet = async (req: NextRequest, res: NextResponse, club: string) => {
  try {
    const response = await serverInstance.get(`/players?club_id=${club}`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
};
