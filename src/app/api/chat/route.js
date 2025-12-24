import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userMessage } = await request.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
            content: `You are a friendly, professional Interior Design Assistant named Roomy. 
            
            RULES:
            1. If the user asks about rooms, furniture, colors, or architecture, give helpful, creative, and warm advice.
            2. If the user asks something totally unrelated (like math or politics), politely explain that you are specialized in interior design and offer to help with a decor project instead.
            3. Use a natural, conversational tone. Don't be a robot.` 
          },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7, // Makes it feel more natural and less "robotic"
      }),
    });

    const data = await response.json();
    
    // Check if Groq sent back a valid message
    const aiReply = data.choices?.[0]?.message?.content;

    if (!aiReply) {
      throw new Error("No response from AI");
    }

    return NextResponse.json({ reply: aiReply });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}