import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { hashPassword } from "@/lib/hashing";
import { validateSignupInput, sanitizeInput } from "@/lib/auth-validation";

// rate limiting
const signupAttempts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 5;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const attempt = signupAttempts.get(identifier);

  if (!attempt || now > attempt.resetTime) {
    signupAttempts.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (attempt.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }

  attempt.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting and logging
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Rate limiting: allow 5 signup attempts per 15 minutes per IP
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: { message: 'Too many signup attempts. Please try again later.' } },
        { status: 429 } // Too Many Requests
      );
    }

    const body = await request.json();

    // Validate input
    const validation = validateSignupInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: { message: 'Validation failed', details: validation.errors } },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, address, city, state, country } = validation.data;

    // Check if user already exists (case-insensitive email)
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      // Return generic message to prevent user enumeration
      return NextResponse.json(
        { error: { message: 'This email is already registered. Please log in or use a different email.' } },
        { status: 409 }
      );
    }

    // Hash password (Argon2)
    const hashedPassword = await hashPassword(password);

    // Sanitise user inputs
    const sanitizedFirstName = sanitizeInput(firstName);
    const sanitizedLastName = sanitizeInput(lastName);
    const sanitizedAddress = sanitizeInput(address);
    const sanitizedCity = sanitizeInput(city);
    const sanitizedState = sanitizeInput(state);
    const sanitizedCountry = sanitizeInput(country);
    const fullName = `${sanitizedFirstName} ${sanitizedLastName}`.trim();

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: fullName,
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        address: sanitizedAddress,
        city: sanitizedCity,
        state: sanitizedState,
        country: sanitizedCountry,
        role: 'customer',
        emailVerified: false,
        accounts: {
          create: {
            accountId: email.toLowerCase(),
            providerId: 'credential',
            password: hashedPassword,
          },
        },
      },
    });

    // Return sanitised user data
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          address: user.address,
          city: user.city,
          state: user.state,
          country: user.country,
          preferredMode: user.preferredMode || 'dark',
        },
      },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error('[Security] Signup error:', error);

    // Check for specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          { error: { message: 'This email is already registered.' } },
          { status: 409 }
        );
      }
      if (error.message.includes('Invalid email')) {
        return NextResponse.json(
          { error: { message: 'Invalid email address.' } },
          { status: 400 }
        );
      }
    }

    // Eerror
    return NextResponse.json(
      { error: { message: 'An error occurred during registration. Please try again.' } },
      { status: 500 }
    );
  }
}
