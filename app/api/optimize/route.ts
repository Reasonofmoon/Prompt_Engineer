import { NextResponse } from "next/server"
import { generateWithGemini } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { prompt, purpose } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt is required",
        },
        { status: 400 },
      )
    }

    const optimizationPrompt = `
      Optimize this prompt for better performance and clarity:
      
      Original Prompt:
      ${prompt}
      
      Purpose:
      ${purpose || "General purpose"}
      
      Provide the optimized version and analysis in JSON format:
      {
        "optimizedPrompt": "string",
        "evaluation": "string",
        "orchestration": "string"
      }
    `

    const result = await generateWithGemini(optimizationPrompt)
    const data = JSON.parse(result)

    return NextResponse.json({
      success: true,
      ...data,
    })
  } catch (error) {
    console.error("Optimization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to optimize prompt",
      },
      { status: 500 },
    )
  }
}

