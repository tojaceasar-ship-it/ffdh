export const dynamic = 'force-static';

export async function GET() {
  return new Response(JSON.stringify({
    status: 'ok',
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev',
    environment: process.env.NODE_ENV ?? 'development'
  }), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

