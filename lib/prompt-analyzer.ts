import { generateWithGemini } from "./gemini"

export interface PromptAnalysis {
  Task_Objective: string
  Task_Constraints: string
  Output_Format: string
  Persona_System: string
  Context_Knowledge: string
  Exemplars_BestPractices: string
  Step_By_Step_Thinking: string
  Evaluation_Rubric: string
  Refinement_Iterations: string
  Failure_Cases: string
  Application_Scenarios: string
  Notes: string
  purposeScore?: number
  clarityScore?: number
  constraintScore?: number
  qualityScore?: number
  feedback?: string[]
  improvements?: string[]
}

export interface UpgradedPrompt {
  system: string
  persona: string
  input: string
  tasks: Array<{
    title: string
    instructions: string[]
  }>
  outputFormat: string
  qualityAssurance: string[]
  reflection: string[]
  feedback: string[]
  constraints: string[]
  context: string
}

export async function analyzePrompt(prompt: string): Promise<PromptAnalysis> {
  try {
    const analysisPrompt = `
      Analyze this prompt and break it down into components:
      
      ${prompt}
      
      Provide analysis in JSON format with these fields:
      {
        "Task_Objective": "",
        "Task_Constraints": "",
        "Output_Format": "",
        "Persona_System": "",
        "Context_Knowledge": "",
        "Exemplars_BestPractices": "",
        "Step_By_Step_Thinking": "",
        "Evaluation_Rubric": "",
        "Refinement_Iterations": "",
        "Failure_Cases": "",
        "Application_Scenarios": "",
        "Notes": ""
      }
    `

    const result = await generateWithGemini(analysisPrompt)
    if (!result) {
      throw new Error("Failed to generate analysis")
    }

    return JSON.parse(result)
  } catch (error) {
    console.error("Analysis error:", error)
    throw error
  }
}

export async function upgradePrompt(analysis: PromptAnalysis, originalPrompt: string): Promise<UpgradedPrompt> {
  try {
    const upgradePrompt = `
      Based on this analysis:
      ${JSON.stringify(analysis, null, 2)}
      
      And this original prompt:
      ${originalPrompt}
      
      Create an upgraded version following this structure in JSON format:
      {
        "system": "",
        "persona": "",
        "input": "",
        "tasks": [
          {
            "title": "",
            "instructions": []
          }
        ],
        "outputFormat": "",
        "qualityAssurance": [],
        "reflection": [],
        "feedback": [],
        "constraints": [],
        "context": ""
      }
    `

    const result = await generateWithGemini(upgradePrompt)
    if (!result) {
      throw new Error("Failed to generate upgrade")
    }

    return JSON.parse(result)
  } catch (error) {
    console.error("Upgrade error:", error)
    throw error
  }
}

