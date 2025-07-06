import { NextResponse, NextRequest } from "next/server";
import dotenv from "dotenv";
dotenv.config();
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import type { Document } from "@langchain/core/documents";
import { z } from "zod";

const llm = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-large-latest",
  temperature: 0,
});

const retriever = new TavilySearchAPIRetriever({
  k: 5,
  apiKey: process.env.TAVILY_API_KEY,
});

const RequestBodySchema = z.object({
  service: z.string().min(1, "Service cannot be empty"),
  subService: z.string().min(1, "Sub-service cannot be empty"),
  query: z.string().min(1, "Query cannot be empty"),
});

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const validationResult = RequestBodySchema.safeParse(requestBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { query, service, subService } = validationResult.data;

    const prompt = ChatPromptTemplate.fromTemplate(`
    You are an expert South African expert in civic and immigration service. You will only answer the user based on the following query.Please rephrase the information above in a clear, concise, and easy-to-understand manner for a user seeking information.  Ensure the language is accessible to someone who may not be familiar with technical or legal jargon. Focus on providing practical and actionable information.only one to two paragraph maximum

    NOTE : Return the answer in clear markdown format, no more than 300 words. Use the following structure:

## [Title of the topic]

Brief overview of the service in 2–3 sentences.

### Steps

- List each important step clearly using bullet points.
- Keep the language simple and beginner-friendly.
- Focus only on official processes.

### Note

End the response with a helpful note that the user should contact the South African Department of Home Affairs or visit their official website for the most up-to-date and official information.

    Context: {context}

    Question: {question}`);

    const formatDocs = (docs: Document[]) => {
      return docs.map((doc) => doc.pageContent).join("\n\n");
    };

    const question = `Do research about the ${service} for the ${subService} and here is more detail: ${query}. Only return results that are relevant to South Africa and ignore other countries.

`;

    const ragChain = RunnableSequence.from([
      {
        context: retriever.pipe(formatDocs),
        question: new RunnablePassthrough(),
      },
      prompt,
      llm,
      new StringOutputParser(),
    ]);

    const result = await ragChain.invoke(question);
    return NextResponse.json({
      message: "Web search completed successfully!",
      data: result,
    });
  } catch (error: unknown) {
    console.error("Error processing request:", error);
    let details: string;
    if (error instanceof Error) {
      details = error.message;
    } else {
      details = "An unknown error occurred";
    }
    return NextResponse.json(
      { error: "Failed to process request", details: details },
      { status: 500 }
    );
  }
}
