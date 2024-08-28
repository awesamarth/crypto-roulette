import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = new URL('https://faucet.testnet.suzuka.movementlabs.xyz' + request.nextUrl.pathname);
  searchParams.forEach((value, key) => url.searchParams.append(key, value));
  
  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return NextResponse.json(await response.json());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const url = new URL('https://faucet.testnet.suzuka.movementlabs.xyz' + request.nextUrl.pathname);
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return NextResponse.json(await response.json());
}