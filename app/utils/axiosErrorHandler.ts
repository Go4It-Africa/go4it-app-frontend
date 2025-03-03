import { NextResponse } from 'next/server';
import { AxiosError } from 'axios';

const handleErrors = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return NextResponse.json(
        {
          message:
            error.response?.data.error?.message || 'An unknown error occurred',
        },
        { status: error.response?.status || 400 }
      );
    } else if (error.request) {
      // The request was made but no response was received
      return NextResponse.json(
        { message: 'No response from server' },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: error.message || 'Error setting up the request' },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: 'Invalid request data' },
      { status: 400 }
    );
  }
};

export default handleErrors;
