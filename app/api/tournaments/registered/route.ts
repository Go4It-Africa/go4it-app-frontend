import { NextRequest, NextResponse } from 'next/server';
import { serverInstance } from '@/app/lib/axios';
import checkSessionValidity from '@/app/utils/useCheckSessionValidity';
import handleErrors from '@/app/utils/axiosErrorHandler';

export async function POST(req: NextRequest) {
  const sessionData = await checkSessionValidity();

  if ('error' in sessionData) {
    return NextResponse.json({ error: sessionData.error }, { status: 401 });
  }

  return handlePost(req);
}

export async function GET(req: NextRequest) {
  const sessionData = await checkSessionValidity();

  if ('error' in sessionData) {
    return NextResponse.json({ error: sessionData.error }, { status: 401 });
  }
  //get params from url
  const params = req.nextUrl.searchParams;
  const clubId = params.get('clubId');

  if (!clubId) {
    return NextResponse.json({ error: 'Club ID is required' }, { status: 400 });
  }

  return handleGetRegisteredTournamentsByClubId(req, Number(clubId));
}

const handlePost = async (
  req: NextRequest
) => {
  try {
    const tournamentData = await req.json();

    if(!tournamentData?.tournament_id || !tournamentData?.club_id || !tournamentData?.teams) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const response = await serverInstance.post(`/tournaments/${tournamentData?.tournament_id}/team`, {
      club_id: tournamentData?.club_id,
      teams: tournamentData?.teams,
    });

    if(response.status !== 201) {
      return NextResponse.json({ error: 'Failed to register to tournament' }, { status: 400 });
    }

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return handleErrors(error);
  }
};

const handleGetRegisteredTournamentsByClubId = async (req: NextRequest, clubId: number) => {
  try {
    const response = await serverInstance.get(`/clubs/${clubId}/tournaments/registered`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
};