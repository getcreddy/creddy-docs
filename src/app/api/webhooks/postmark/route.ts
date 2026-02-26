import { NextRequest, NextResponse } from 'next/server';
import { BrowserUse } from 'browser-use-sdk';
import { z } from 'zod';
import crypto from 'crypto';

// Postmark inbound email payload
interface PostmarkInbound {
  From: string;
  FromName: string;
  To: string;
  Subject: string;
  TextBody: string;
  HtmlBody: string;
  MessageID: string;
  Date: string;
  OriginalRecipient?: string;
}

interface PendingSetup {
  id: string;
  email: string;
  backendId: string;
  status: 'pending' | 'invite_received' | 'processing' | 'completed' | 'failed';
  inviteUrl?: string;
  sessionKey?: string;
  orgId?: string;
  password?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// TODO: Replace with real database (Redis, Postgres, etc.)
const pendingSetups = new Map<string, PendingSetup>();
const setupsById = new Map<string, PendingSetup>();

// Schema for browser-use response
const SessionResult = z.object({
  sessionKey: z.string(),
  orgId: z.string().optional(),
  success: z.boolean(),
  error: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const payload: PostmarkInbound = await request.json();
    
    console.log(`[Postmark] Received email from ${payload.From} to ${payload.To}: ${payload.Subject}`);

    // Get the recipient email
    const toEmail = (payload.OriginalRecipient || payload.To).toLowerCase();

    // Look up pending setup
    const setup = pendingSetups.get(toEmail);
    if (!setup) {
      console.log(`[Postmark] No pending setup for ${toEmail}`);
      return NextResponse.json({ ok: true, message: 'no pending setup' });
    }

    // Check if this is an Anthropic invite
    if (!isAnthropicInvite(payload)) {
      console.log(`[Postmark] Email is not an Anthropic invite`);
      return NextResponse.json({ ok: true, message: 'not an anthropic invite' });
    }

    // Extract invite URL
    const inviteUrl = extractInviteUrl(payload.HtmlBody || payload.TextBody);
    if (!inviteUrl) {
      console.log(`[Postmark] Could not extract invite URL`);
      setup.status = 'failed';
      setup.errorMessage = 'Could not extract invite URL from email';
      setup.updatedAt = new Date();
      return NextResponse.json({ ok: true, message: 'no invite url found' });
    }

    console.log(`[Postmark] Extracted invite URL: ${inviteUrl}`);

    // Update setup
    setup.status = 'invite_received';
    setup.inviteUrl = inviteUrl;
    setup.updatedAt = new Date();

    // Generate a secure password for the new account
    const password = crypto.randomBytes(24).toString('hex');
    setup.password = password;

    // Process the invite using browser-use (async, don't wait)
    processInviteAsync(setup);

    return NextResponse.json({ 
      ok: true, 
      message: 'invite received, processing',
      setupId: setup.id 
    });

  } catch (error) {
    console.error('[Postmark] Error processing webhook:', error);
    return NextResponse.json(
      { ok: false, error: 'internal error' },
      { status: 500 }
    );
  }
}

async function processInviteAsync(setup: PendingSetup) {
  try {
    setup.status = 'processing';
    setup.updatedAt = new Date();

    const client = new BrowserUse();
    
    const task = `
You are accepting an Anthropic organization invite.

1. Go to this URL: ${setup.inviteUrl}

2. You will see either:
   a) A signup form (if this is a new account) - fill in:
      - Name: "Creddy Bot"
      - Password: ${setup.password}
      - Confirm password: ${setup.password}
      - Check any required checkboxes (terms of service, etc.)
      - Click the submit/create/sign up button
   
   b) An accept invite button (if account exists) - just click it

3. Wait for the page to redirect to the console/dashboard (platform.claude.com)

4. Once on the dashboard, extract:
   - The "sessionKey" cookie value
   - The organization ID from the URL (if visible)

5. Return the sessionKey cookie value and org ID.

IMPORTANT: The sessionKey cookie is critical - make sure to capture it accurately.
`;

    console.log(`[BrowserUse] Starting task for ${setup.email}`);
    
    const result = await client.run(task, {
      schema: SessionResult,
    });

    console.log(`[BrowserUse] Task completed:`, result.output);

    if (result.output.success && result.output.sessionKey) {
      setup.status = 'completed';
      setup.sessionKey = result.output.sessionKey;
      setup.orgId = result.output.orgId;
      console.log(`[BrowserUse] Successfully captured session for ${setup.email}`);
    } else {
      setup.status = 'failed';
      setup.errorMessage = result.output.error || 'Failed to capture session';
      console.log(`[BrowserUse] Failed to capture session: ${setup.errorMessage}`);
    }

  } catch (error) {
    console.error(`[BrowserUse] Error processing invite:`, error);
    setup.status = 'failed';
    setup.errorMessage = error instanceof Error ? error.message : 'Unknown error';
  }

  setup.updatedAt = new Date();
}

function isAnthropicInvite(payload: PostmarkInbound): boolean {
  const from = payload.From.toLowerCase();
  const subject = payload.Subject.toLowerCase();

  // Check sender
  if (!from.includes('anthropic') && !from.includes('claude')) {
    return false;
  }

  // Check subject
  if (subject.includes('invite') || subject.includes('join') || subject.includes('added')) {
    return true;
  }

  return false;
}

function extractInviteUrl(body: string): string | null {
  const patterns = [
    /https:\/\/console\.anthropic\.com\/[^\s"'<>]*(?:accept|invite)[^\s"'<>]*/i,
    /https:\/\/platform\.claude\.com\/[^\s"'<>]*(?:accept|invite)[^\s"'<>]*/i,
  ];

  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) {
      // Clean up trailing punctuation
      return match[0].replace(/[.,;:"')]+$/, '');
    }
  }

  return null;
}

// API to create a pending setup (called by creddy CLI)
export async function PUT(request: NextRequest) {
  try {
    const { backendId } = await request.json();
    
    // Generate unique email
    const id = generateId();
    const email = `creddy-${id}@connect.creddy.dev`;

    const setup: PendingSetup = {
      id,
      email,
      backendId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    pendingSetups.set(email, setup);
    setupsById.set(id, setup);

    console.log(`[Setup] Created pending setup: ${email}`);

    return NextResponse.json({
      ok: true,
      email,
      setupId: id,
    });

  } catch (error) {
    console.error('[Setup] Error creating setup:', error);
    return NextResponse.json(
      { ok: false, error: 'internal error' },
      { status: 500 }
    );
  }
}

// API to check setup status (polled by creddy CLI)
export async function GET(request: NextRequest) {
  const setupId = request.nextUrl.searchParams.get('id');
  
  if (!setupId) {
    return NextResponse.json(
      { ok: false, error: 'missing id' },
      { status: 400 }
    );
  }

  const setup = setupsById.get(setupId);
  if (!setup) {
    return NextResponse.json(
      { ok: false, error: 'setup not found' },
      { status: 404 }
    );
  }

  // Don't return sensitive data like password
  return NextResponse.json({
    ok: true,
    status: setup.status,
    sessionKey: setup.status === 'completed' ? setup.sessionKey : undefined,
    orgId: setup.status === 'completed' ? setup.orgId : undefined,
    errorMessage: setup.status === 'failed' ? setup.errorMessage : undefined,
  });
}

function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
