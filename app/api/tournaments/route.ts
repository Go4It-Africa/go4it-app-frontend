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
  //get params from url
  const params = req.nextUrl.searchParams;
  const tournamentId = params.get('id');

  console.log('tournamentId', tournamentId);

  if (tournamentId) {
    return handleGetTournamentById(req, tournamentId);
  } else {
    return handleGet(req, sessionData.userId);
  }
}

const handlePost = async (
  req: NextRequest,
  session: Session
) => {
  try {
    const userId = session.user.id;
    const tournamentData = {
      ...(await req.json()),
      user_id: userId,
    };

    console.log(tournamentData);

    const response = await serverInstance.post('/tournaments', tournamentData);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return handleErrors(error);
  }
};

const handleGet = async (req: NextRequest, user: string) => {
  try {
    const response = await serverInstance.get(`/tournaments?user_id=${user}`);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
};

const handleGetTournamentById = async (req: NextRequest, tournamentId: string) => {
  try {
    const response = await serverInstance.get(`/tournaments/${tournamentId}`);
    console.log('response from get tournament by id', response.data);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
};