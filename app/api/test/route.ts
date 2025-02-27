import { NextResponse } from "next/server"
import { generateWithGemini } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt is required",
        },
        { status: 400 },
      )
    }

    const testPrompt = `
      Test this prompt and provide feedback:
      
      ${prompt}
      
      Provide results in JSON format:
      {
        "response": "",
        "metrics": {
          "relevance": number,
          "coherence": number,
          "specificity": number
        }
      }
    `

    const result = await generateWithGemini(testPrompt)
    const parsedResult = JSON.parse(result)

    return NextResponse.json({
      success: true,
      result: parsedResult,
    })
  } catch (error) {
    console.error("Test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to test prompt",
      },
      { status: 500 },
    )
  }
}

