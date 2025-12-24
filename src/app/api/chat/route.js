import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userMessage } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "API Key is missing on the server" }, { status: 500 });
    }

    // STEP 1: VALIDATE
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: "You are a room-validation AI. If the user prompt is about interior design, furniture, or architecture, reply exactly with 'VALID'. Otherwise, reply 'INVALID'." 
          },
          { role: "user", content: userMessage }
        ],
      }),
    });

    const groqData = await groqResponse.json();
    const status = groqData.choices?.[0]?.message?.content?.trim();

    if (status !== "VALID") {
      return NextResponse.json({ 
        reply: "I'm sorry, I can only help with interior design and room-related questions. Could you ask me something about decor or furniture?" 
      });
    }

    // STEP 2: GENERATE THE ACTUAL REPLY
    const finalResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a helpful interior design assistant." },
          { role: "user", content: userMessage }
        ],
      }),
    });

    const finalData = await finalResponse.json();
    return NextResponse.json({ reply: finalData.choices[0].message.content });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}