import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userMessage } = await request.json();

    // 1. ASK GROQ TO VALIDATE
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
            content: "You are a room-validation AI. If the user prompt is about interior design, furniture, architecture, or a specific room, reply exactly with 'VALID'. If it is random text, nonsense, or unrelated, reply exactly with 'INVALID'." 
          },
          { role: "user", content: userMessage }
        ],
      }),
    });

    const groqData = await groqResponse.json();
    const status = groqData.choices[0].message.content.trim();

    // 2. BLOCK IF INVALID
    if (status !== "VALID") {
      return NextResponse.json({ 
        isRoom: false,
        error: "Please give the prompt related to the room." 
      });
    }

    // 3. ALLOW IF VALID
    return NextResponse.json({ isRoom: true });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}