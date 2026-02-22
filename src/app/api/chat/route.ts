import { createGroq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages } from 'ai';
import { promises as fs } from 'fs';
import path from 'path';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

let docsContext: string | null = null;

async function getDocsContext(): Promise<string> {
  if (docsContext) return docsContext;
  
  try {
    const contextPath = path.join(process.cwd(), 'public', 'docs-context.txt');
    docsContext = await fs.readFile(contextPath, 'utf-8');
    return docsContext;
  } catch (error) {
    console.error('Failed to load docs context:', error);
    return 'Creddy is a credential management system for AI agents.';
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const context = await getDocsContext();

  const systemPrompt = `You are the Creddy documentation assistant. Creddy is an open source credential management system that provides ephemeral, scoped credentials for AI agents.

Your ONLY purpose is to help with:
- Creddy setup, configuration, and usage
- Credential management for AI agents
- Agent identity and authentication
- Scoped permissions and ephemeral tokens
- Integrations (GitHub, Anthropic, Doppler, etc.)
- Security best practices for agentic development

<documentation>
${context}
</documentation>

STRICT RULES:
1. ONLY answer questions related to Creddy, credential management, agent identity, or agentic development security
2. If asked about unrelated topics (coding help, general questions, other tools), politely decline: "I'm the Creddy docs assistant - I can only help with Creddy and credential management for AI agents. Is there something about Creddy I can help you with?"
3. Do NOT provide general coding assistance, debugging help, or answers about other products
4. Base answers on the documentation above
5. If something isn't in the docs, say "I don't have information about that in the Creddy documentation"
6. Be concise but thorough
7. Use code examples when relevant to Creddy
8. Format responses with markdown when appropriate`;

  // Convert UI messages (parts array) to model messages (content string)
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: groq('openai/gpt-oss-120b'),
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
