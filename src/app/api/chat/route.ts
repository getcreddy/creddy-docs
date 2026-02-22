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

  const systemPrompt = `You are a helpful assistant for Creddy, an open source credential management system for AI agents.

Use the following documentation to answer questions. Be concise and helpful. If you don't know something based on the docs, say so.

<documentation>
${context}
</documentation>

Guidelines:
- Answer based on the documentation above
- Be concise but thorough
- Use code examples when helpful
- If something isn't covered in the docs, say "I don't have information about that in the current documentation"
- Format responses with markdown when appropriate`;

  // Convert UI messages (parts array) to model messages (content string)
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: groq('openai/gpt-oss-120b'),
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
