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

const handlePost = async (
  req: NextRequest
) => {
  try {
    const data = await req.json();

    const response = await serverInstance.post(`/tournaments/${data?.tournamentId}/team/${data?.teamId}`, {
      players: data?.players,
    });

    if(response.status !== 201) {
      return NextResponse.json({ error: 'Failed to assign players to team' }, { status: 400 });
    }

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return handleErrors(error);
  }
};