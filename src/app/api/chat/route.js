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
        // We use response_format to ensure the AI actually sends valid JSON
        response_format: { type: "json_object" },
        messages: [
          { 
            role: "system", 
            content: `You are an Interior Design Validator. 
            Analyze if the user's prompt is about room design, furniture, or architecture.
            
            Return ONLY a JSON object:
            {
              "isRoom": true or false,
              "reply": "A brief 1-sentence design tip if true, or a polite refusal if false"
            }` 
          },
          { role: "user", content: userMessage }
        ],
        temperature: 0.1, // Low temperature for consistent JSON output
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No response from AI");

    // Parse the string response from AI into an actual JSON object
    const parsedData = JSON.parse(content);

    return NextResponse.json({ 
      isRoom: parsedData.isRoom, 
      reply: parsedData.reply 
    });

  } catch (error) {
    console.error("Server Error:", error);
    // If the AI fails, we default to 'true' so we don't block the user's generation
    return NextResponse.json({ isRoom: true, reply: "Proceeding with design..." });
  }
}