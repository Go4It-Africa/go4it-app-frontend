import { NextRequest, NextResponse } from 'next/server';
import { serverInstance } from '@/app/lib/axios';
import handleErrors from '@/app/utils/axiosErrorHandler';

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();

    const response = await serverInstance.post('/auth/signup', userData);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return handleErrors(error);
  }
}
