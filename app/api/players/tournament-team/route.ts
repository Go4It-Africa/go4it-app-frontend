import { NextRequest, NextResponse } from 'next/server';
import { serverInstance } from '@/app/lib/axios';
import checkSessionValidity from '@/app/utils/useCheckSessionValidity';
import handleErrors from '@/app/utils/axiosErrorHandler';

export async function GET(req: NextRequest, res: NextResponse) {
  const sessionData = await checkSessionValidity();

  if ('error' in sessionData) {
    return NextResponse.json({ error: sessionData.error }, { status: 401 });
  }

  const tournamentId = req.nextUrl.searchParams.get('tournament_id');
  const clubId = req.nextUrl.searchParams.get('club_id');

  return handleGet(req, res, tournamentId, clubId);
}


const handleGet = async (req: NextRequest, res: NextResponse, tournamentId: string | null, clubId: string | null) => {
  try {
    if (!tournamentId || !clubId) {
      //TODO: Unless we want to get all players
      return NextResponse.json({ error: 'Tournament ID and Team ID are required' }, { status: 400 });
    }

    const response = await serverInstance.get(`/players/tournament-team/${tournamentId}/club/${clubId}`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
};