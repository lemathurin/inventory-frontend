import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Deny production access
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not Found', { status: 404 });
  }

  const body = await request.json();
  const { email, password } = body;

  // Credential mock
  if (email === 'alice@example.com' && password === 'password') {
    return NextResponse.json({
      token: 'mocked-jwt-token',
      id: 1,
      homeId: 42,
    });
  }

  return new NextResponse(
    JSON.stringify({ error: 'Invalid credentials' }),
    { status: 401 }
  );
}
