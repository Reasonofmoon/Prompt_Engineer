import { generateWithGemini } from "./gemini"

export interface AgentResponse {
  success: boolean
  result: string
  error?: string
}

export class EvaluatorAgent {
  private static evaluationPrompt = `You are an expert prompt engineer evaluator.
Analyze the following prompt based on these criteria:
1. Clarity and specificity
2. Goal alignment
3. Constraints handling
4. Expected output quality
5. Potential improvements

Prompt to evaluate:
`

  static async evaluate(prompt: string): Promise<AgentResponse> {
    try {
      const result = await generateWithGemini(this.evaluationPrompt + prompt)
      return { success: true, result }
    } catch (error) {
      return {
        success: false,
        result: "",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

export class OptimizerAgent {
  private static optimizationPrompt = `You are an expert prompt optimizer.
Using advanced prompt engineering techniques (Chain of Thought, Tree of Thoughts, etc.),
improve the following prompt while maintaining its core purpose.
Consider:
1. Adding relevant examples (few-shot learning)
2. Including reasoning steps
3. Implementing guardrails
4. Optimizing for response quality

Original prompt:
`

  static async optimize(prompt: string, evaluation: string): Promise<AgentResponse> {
    try {
      const fullPrompt = `${this.optimizationPrompt}
${prompt}

Evaluation feedback:
${evaluation}

Generate an improved version.`

      const result = await generateWithGemini(fullPrompt)
      return { success: true, result }
    } catch (error) {
      return {
        success: false,
        result: "",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

export class OrchestratorAgent {
  private static orchestrationPrompt = `You are a prompt engineering orchestrator.
Create a multi-step prompt optimization strategy using:
1. Chain of Thought (CoT) reasoning
2. Tree of Thoughts (ToT) exploration
3. Self-consistency checks
4. Constitutional AI principles

Original prompt and purpose:
`

  static async orchestrate(prompt: string, purpose: string): Promise<AgentResponse> {
    try {
      const fullPrompt = `${this.orchestrationPrompt}
Prompt: ${prompt}
Purpose: ${purpose}

Design an optimization strategy.`

      const result = await generateWithGemini(fullPrompt)
      return { success: true, result }
    } catch (error) {
      return {
        success: false,
        result: "",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

