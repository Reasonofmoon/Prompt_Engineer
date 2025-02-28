const GEMINI_API_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
  
// 환경 변수에서 API 키를 가져옵니다.
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""

export async function generateWithGemini(prompt: string): Promise<string> {
  // API 키가 없는 경우 에러 처리
  if (!GEMINI_API_KEY) {
    console.error("Gemini API key is not set")
    throw new Error("Gemini API key is missing. Please set the NEXT_PUBLIC_GEMINI_API_KEY environment variable.")
  }

  try {
    console.log("Calling Gemini API with prompt length:", prompt.length);
    
    const response = await fetch(`${GEMINI_API_BASE_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: Status ${response.status} - ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      throw new Error(`Gemini API error: ${response.status} - ${response.statusText}. Details: ${errorText.substring(0, 200)}...`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
      console.error("Unexpected Gemini API response structure:", JSON.stringify(data));
      throw new Error("Unexpected Gemini API response structure");
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

