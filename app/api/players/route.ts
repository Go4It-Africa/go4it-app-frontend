import { NextRequest, NextResponse } from 'next/server';
import { serverInstance } from '@/app/lib/axios';
import { Session } from 'next-auth';
import checkSessionValidity from '@/app/utils/useCheckSessionValidity';
import handleErrors from '@/app/utils/axiosErrorHandler';

export async function POST(req: NextRequest) {
  const sessionData = await checkSessionValidity();

  if ('error' in sessionData) {
    return NextResponse.json({ error: sessionData.error }, { status: 401 });
  }

  return handlePost(req, sessionData.session);
}

export async function GET(req: NextRequest) {
  const sessionData = await checkSessionValidity();

  if ('error' in sessionData) {
    return NextResponse.json({ error: sessionData.error }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const playerId = params.get('id');
  if (playerId) {
    return handleGetPlayerById(req, playerId);
  }

  const clubId = req.nextUrl.searchParams.get('club_id');

  return handleGet(req, clubId);
}

const handlePost = async (
  req: NextRequest,
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

const handleGet = async (req: NextRequest, club: string | null) => {
  try {
    if (!club) {
      //TODO: Unless we want to get all players
      return NextResponse.json({ error: 'Club ID is required' }, { status: 400 });
    }

    const response = await serverInstance.get(`/players/club/${club}`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
};

const handleGetPlayerById = async (req: NextRequest, playerId: string) => {
  try {
    const response = await serverInstance.get(`/players/${playerId}`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
};