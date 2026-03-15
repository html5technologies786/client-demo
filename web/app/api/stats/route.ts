import { NextResponse } from "next/server";

let requests = 1000;
let tokens = 90000;
let activeConnections = 30;

export async function GET() {
  requests += Math.floor(Math.random() * 50) + 1;
  tokens += Math.floor(Math.random() * 1000) + 100;
  activeConnections = Math.max(
    1,
    activeConnections + Math.floor(Math.random() * 11) - 5
  );

  return NextResponse.json({
    requests,
    tokens,
    activeConnections,
  });
}
