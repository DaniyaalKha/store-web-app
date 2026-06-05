import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

async function handleRequest(request: NextRequest) {
  try {
    const response = await auth.handler(request);
    return response;
  } catch (error) {
    // Log error details for server-side debugging
    console.error('Auth handler error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Return generic error to client
    return NextResponse.json(
      { error: { message: 'Authentication service error. Please try again.' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}
