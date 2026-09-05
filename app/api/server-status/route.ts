import { NextResponse } from 'next/server';
import net from 'node:net';

export const runtime = 'nodejs';

const HOST = 'play.steampunksmp.com';
const PORT = 25565;
const TIMEOUT_MS = 3500;

function checkMinecraftServer(): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    const finish = (online: boolean) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(online);
    };

    socket.setTimeout(TIMEOUT_MS);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.once('close', () => finish(false));
    socket.connect(PORT, HOST);
  });
}

export async function GET() {
  const online = await checkMinecraftServer();
  return NextResponse.json(
    { online, host: HOST, port: PORT },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}
