import { NextResponse } from 'next/server';
import { chavePublica } from '@/lib/push';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ chave: await chavePublica() });
  } catch {
    return NextResponse.json({ error: 'indisponivel' }, { status: 503 });
  }
}
