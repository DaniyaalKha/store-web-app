import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    
    return NextResponse.json({
      session: session,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ error: "Failed to get session" }, { status: 500 });
  }
}
