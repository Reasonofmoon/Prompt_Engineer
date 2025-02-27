"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BrainCircuit, ClipboardCheck, Command, Lightbulb, Moon, Sun, Sparkles, Target, ThumbsUp, GitBranch, Beaker, Microscope, Check } from 'lucide-react'
import { PromptTesting } from "@/components/prompt-testing"
import { PromptAnalysis } from "@/components/prompt-analysis"
import { PromptUpgrade } from "@/components/prompt-upgrade"

// Types
type SystemContext = "Assistant" | "Expert" | "Teacher" | "Analyst" | "Creative"
type OutputFormat = "Step by Step" | "Bullet Points" | "Detailed Analysis" | "Code" | "Conversation"
type AgenticBehavior = "Proactive" | "Reactive" | "Collaborative" | "Analytical" | "Creative"
type ThinkingStyle = "Chain of Thought" | "Tree of Thoughts" | "Direct Answer" | "Socratic" | "Structured"

interface PromptTemplate {
  systemContext: SystemContext
  outputFormat: OutputFormat
  agenticBehavior: AgenticBehavior
  thinkingStyle: ThinkingStyle
  input: string
  constraints?: string
  examples?: string
  purpose?: string
}

interface PromptEvaluation {
  purposeScore: number
  clarityScore: number
  constraintScore: number
  qualityScore: number
  feedback: string[]
  suggestedImprovements: string[]
}

interface PromptVersion {
  prompt: string
  evaluation: PromptEvaluation
  timestamp: number
}

interface PromptAnalysisData {
  clarityScore: number
  specificityScore: number
  constraintScore: number
  purposeScore: number
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
}

interface PromptTestCase {
  input: string
  expectedOutput: string
  actualOutput?: string
  passed?: boolean
}

interface PromptTestingData {
  cases: PromptTestCase[]
  results?: {
    passed: number
    failed: number
    total: number
  }
}

interface PromptAnalysis {
  [key: string]: any
}

interface UpgradedPrompt {
  text: string
  improvements: string[]
}

interface OptimizationResult {
  optimizedPrompt: string
  evaluation: string
  orchestration: string
}

export default function PromptWorkbench() {
  // State management
  const [darkMode, setDarkMode] = useState(false)
  const [template, setTemplate] = useState<PromptTemplate>({
    systemContext: "Assistant",
    outputFormat: "Step by Step",
    agenticBehavior: "Proactive",
    thinkingStyle: "Chain of Thought",
    input: "",
    constraints: "",
    examples: "",
    purpose: "",
  })
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [evaluation, setEvaluation] = useState<PromptEvaluation | null>(null)
  const [versions, setVersions] = useState<PromptVersion[]>([])
  const [activeTab, setActiveTab] = useState("editor")
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [promptAnalysis, setPromptAnalysis] = useState<PromptAnalysis | null>(null)
  const [upgradedPrompt, setUpgradedPrompt] = useState<UpgradedPrompt | null>(null)
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  // Effect to load dark mode from local storage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === "true")
    }
  }, [])

  // Effect to save dark mode to local storage
  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode))
    
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Load versions from local storage
  useEffect(() => {
    try {
      const savedVersions = localStorage.getItem("promptVersions")
      if (savedVersions) {
        setVersions(JSON.parse(savedVersions))
      }
    } catch (error) {
      console.error("Failed to load versions:", error)
    }
  }, [])

  // Save versions to local storage
  useEffect(() => {
    if (versions.length > 0) {
      localStorage.setItem("promptVersions", JSON.stringify(versions.slice(0, 10)))
    }
  }, [versions])

  // Effect to handle tab changes
  useEffect(() => {
    // Reset error when changing tabs
    setError(null)
    
    // Prepare specific tabs when they become active
    if (activeTab === "testing" && !generatedPrompt) {
      setError("Please generate a prompt first before testing")
    }
    
    if (activeTab === "upgrade" && !generatedPrompt) {
      setError("Please generate a prompt first before upgrading")
    }
  }, [activeTab, generatedPrompt])

  // Handle template field changes
  const handleTemplateChange = useCallback(<T extends keyof PromptTemplate>(
    field: T, 
    value: PromptTemplate[T]
  ) => {
    setTemplate(prev => ({ ...prev, [field]: value }))
    // Clear error when user makes changes
    setError(null)
  }, [])

  // Copy to clipboard with feedback
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      setError("Failed to copy to clipboard")
    }
  }, [])

  // Generate prompt function with error handling
  const generatePrompt = useCallback(async () => {
    if (!template.input) {
      setError("Please enter a main input for your prompt")
      return
    }

    try {
      setIsEvaluating(true)
      
      const prompt = `System: You are a ${template.systemContext} with ${template.agenticBehavior} behavior.
Output Format: Present your response in ${template.outputFormat} format.
Thinking Process: Use ${template.thinkingStyle} reasoning.

Task: ${template.input}

${template.constraints ? `Constraints: ${template.constraints}` : ""}
${template.examples ? `Examples: ${template.examples}` : ""}
${template.purpose ? `Purpose: ${template.purpose}` : ""}

Please provide your response based on these parameters.`

      setGeneratedPrompt(prompt)
      
      // Use real Gemini API instead of mock
      try {
        // Import the generateWithGemini function
        const { generateWithGemini } = await import('@/lib/gemini');
        
        // Prepare evaluation prompt for Gemini
        const evaluationPrompt = `
          You are an expert prompt evaluator. Evaluate the following prompt based on these criteria:
          - Purpose clarity (score from 0-100)
          - Overall clarity (score from 0-100)
          - Constraint effectiveness (score from 0-100)
          - Overall quality (score from 0-100)
          
          Prompt to evaluate:
          ${prompt}
          
          Return your evaluation in this JSON format:
          {
            "purposeScore": number,
            "clarityScore": number,
            "constraintScore": number,
            "qualityScore": number,
            "feedback": ["feedback point 1", "feedback point 2", "feedback point 3"],
            "suggestedImprovements": ["improvement 1", "improvement 2"]
          }
        `;
        
        // Call Gemini API for evaluation
        const evaluationResult = await generateWithGemini(evaluationPrompt);
        const newEvaluation = JSON.parse(evaluationResult);
        
        setEvaluation(newEvaluation);
        
        // Create a new version entry
        const newVersion: PromptVersion = {
          prompt,
          evaluation: newEvaluation,
          timestamp: Date.now()
        };
        
        setVersions(prev => [newVersion, ...prev]);
        
        // Prepare analysis prompt for Gemini
        const analysisPrompt = `
          Analyze this prompt and provide feedback:
          ${prompt}
          
          Return your analysis in this JSON format:
          {
            "clarityScore": number,
            "specificityScore": number,
            "constraintScore": number,
            "purposeScore": number,
            "strengths": ["strength 1", "strength 2", "strength 3"],
            "weaknesses": ["weakness 1", "weakness 2"],
            "improvements": ["improvement 1", "improvement 2", "improvement 3"]
          }
        `;
        
        // Call Gemini API for analysis
        const analysisResult = await generateWithGemini(analysisPrompt);
        const analysisData = JSON.parse(analysisResult);
        
        setPromptAnalysis(analysisData);
        
      } catch (apiError) {
        console.error("Gemini API error:", apiError);
        setError("Failed to get evaluation from Gemini API. Using fallback evaluation.");
        
        // Fallback to mock evaluation if API fails
        const newEvaluation: PromptEvaluation = {
          purposeScore: Math.random() * 20 + 80, // 80-100
          clarityScore: Math.random() * 30 + 70, // 70-100
          constraintScore: Math.random() * 40 + 60, // 60-100
          qualityScore: Math.random() * 30 + 70, // 70-100
          feedback: [
            "Good specification of system context",
            "Clear task definition",
            "Appropriate thinking style for the task"
          ],
          suggestedImprovements: [
            "Consider adding more specific examples",
            "Clarify the expected output format in more detail"
          ]
        };
        
        setEvaluation(newEvaluation);
        
        // Create a new version entry
        const newVersion: PromptVersion = {
          prompt,
          evaluation: newEvaluation,
          timestamp: Date.now()
        };
        
        setVersions(prev => [newVersion, ...prev]);
        
        // Fallback analysis
        setPromptAnalysis({
          clarityScore: newEvaluation.clarityScore,
          specificityScore: Math.random() * 30 + 70,
          constraintScore: newEvaluation.constraintScore,
          purposeScore: newEvaluation.purposeScore,
          strengths: [
            "Clear system role definition",
            "Specific task description",
            "Appropriate thinking style selection"
          ],
          weaknesses: [
            "Limited examples provided",
            "Could use more specific constraints"
          ],
          improvements: [
            "Add 2-3 concrete examples to guide the model",
            "Specify output length expectations",
            "Include success criteria for the response"
          ]
        });
      }
      
      // Reset upgrade state to encourage using the new prompt
      setUpgradedPrompt(null)
      setOptimizationResult(null)
      
      // Set active tab to evaluation to show results
      setActiveTab("evaluation")
    } catch (error) {
      console.error("Failed to generate prompt:", error)
      setError("An error occurred while generating the prompt")
    } finally {
      setIsEvaluating(false)
    }
  }, [template])

  // Calculate average score
  const averageScore = useMemo(() => {
    if (!evaluation) return 0
    
    const scores = [
      evaluation.purposeScore,
      evaluation.clarityScore,
      evaluation.constraintScore,
      evaluation.qualityScore
    ]
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }, [evaluation])

  // Get score color based on value
  const getScoreColor = useCallback((score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }, [])

  // Get progress color based on value
  const getProgressColor = useCallback((score: number) => {
    if (score >= 80) return "bg-green-600 dark:bg-green-500"
    if (score >= 60) return "bg-yellow-600 dark:bg-yellow-500"
    return "bg-red-600 dark:bg-red-500"
  }, [])

  // Optimize prompt (mock function)
  const optimizePrompt = useCallback(async () => {
    if (!generatedPrompt) return
    
    setIsUpgrading(true)
    setError(null)
    
    try {
      // Import the generateWithGemini function
      const { generateWithGemini } = await import('@/lib/gemini');
      
      // Prepare optimization prompt for Gemini
      const optimizationPrompt = `
        Optimize this prompt for better performance and clarity:
        
        Original Prompt:
        ${generatedPrompt}
        
        ${template.purpose ? `Purpose: ${template.purpose}` : "Purpose: General purpose"}
        
        Provide the optimized version and analysis in JSON format:
        {
          "optimizedPrompt": "string",
          "evaluation": "string",
          "orchestration": "string"
        }
      `;
      
      // Call Gemini API for optimization
      const result = await generateWithGemini(optimizationPrompt);
      const optimizationData = JSON.parse(result);
      
      setOptimizationResult(optimizationData);
    } catch (error) {
      console.error("Optimization error:", error)
      setError("Failed to optimize the prompt")
      
      // Fallback to mock optimization result
      const result: OptimizationResult = {
        optimizedPrompt: `System: As a highly specialized ${template.systemContext}, you'll demonstrate ${template.agenticBehavior} behavior throughout our interaction.

Output Format: Structure your response using a detailed ${template.outputFormat} approach with clear sections and logical progression.

Thinking Process: Employ ${template.thinkingStyle} reasoning, showing your work explicitly and considering multiple perspectives before arriving at conclusions.

Task: ${template.input}

Constraints:
- Maintain factual accuracy and cite sources when possible
- Limit response to relevant information only
- Consider diverse perspectives
${template.constraints ? `- ${template.constraints}` : ""}

${template.examples ? `Examples for reference:
${template.examples}

These examples demonstrate the expected depth and style.` : ""}

${template.purpose ? `Purpose: ${template.purpose}` : "Purpose: To provide comprehensive, accurate, and actionable information"}

Please provide your detailed response following these guidelines, ensuring clarity, depth, and practical utility.`,
        evaluation: "The optimized prompt includes improved structural elements, clearer constraints, and better defines the expected output format. The system context and agentic behavior descriptions have been enhanced to guide the model more effectively.",
        orchestration: "1. Enhanced system role definition\n2. Structured the constraints as a bulleted list\n3. Added more specific guidance on the thinking process\n4. Improved the format of examples section\n5. Added clarity to the purpose statement"
      };
      
      setOptimizationResult(result);
    } finally {
      setIsUpgrading(false)
    }
  }, [generatedPrompt, template])

  // Handle upgrade prompt
  const handleUpgradePrompt = useCallback(async () => {
    if (!generatedPrompt) {
      setError("Please generate a prompt first")
      return
    }
    
    setIsUpgrading(true)
    setError(null)
    
    try {
      // Import the generateWithGemini function
      const { generateWithGemini } = await import('@/lib/gemini');
      
      // Prepare upgrade prompt for Gemini
      const upgradePrompt = `
        You are an expert prompt engineer. Improve the following prompt to make it more effective, 
        structured, clear, and aligned with best practices for AI interactions.
        
        Original prompt:
        ${generatedPrompt}
        
        Create an upgraded version that includes:
        1. Enhanced system role definition
        2. Better structured constraints
        3. More specific guidance on the thinking process
        4. Improved format for examples (if any)
        5. Clearer purpose statement
        
        Return the upgraded prompt as a full text, followed by a list of improvements made.
        Format your response as a JSON object:
        {
          "text": "your upgraded prompt text here",
          "improvements": ["improvement 1", "improvement 2", "improvement 3", "improvement 4", "improvement 5"]
        }
      `;
      
      // Call Gemini API for upgrade
      const result = await generateWithGemini(upgradePrompt);
      const upgradeData = JSON.parse(result);
      
      setUpgradedPrompt(upgradeData);
    } catch (error) {
      console.error("Failed to upgrade prompt:", error);
      setError("Failed to upgrade the prompt with Gemini API. Using fallback upgrade.");
      
      // Fallback to mock upgraded prompt if API fails
      const fallbackUpgradedPrompt: UpgradedPrompt = {
        text: `System: As a highly specialized ${template.systemContext}, you'll demonstrate ${template.agenticBehavior} behavior throughout our interaction.

Output Format: Structure your response using a detailed ${template.outputFormat} approach with clear sections and logical progression.

Thinking Process: Employ ${template.thinkingStyle} reasoning, showing your work explicitly and considering multiple perspectives before arriving at conclusions.

Task: ${template.input}

Constraints:
- Maintain factual accuracy and cite sources when possible
- Limit response to relevant information only
- Consider diverse perspectives
${template.constraints ? `- ${template.constraints}` : ""}

${template.examples ? `Examples for reference:
${template.examples}

These examples demonstrate the expected depth and style.` : ""}

${template.purpose ? `Purpose: ${template.purpose}` : "Purpose: To provide comprehensive, accurate, and actionable information"}

Please provide your detailed response following these guidelines, ensuring clarity, depth, and practical utility.`,
        improvements: [
          "Enhanced system role definition",
          "Added structured bullet lists for constraints",
          "Included more specific guidance on the thinking process",
          "Improved the format of examples section",
          "Added clarity to the purpose statement"
        ]
      };
      
      setUpgradedPrompt(fallbackUpgradedPrompt);
    } finally {
      setIsUpgrading(false);
    }
  }, [generatedPrompt, template]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-pastel-purple" />
            <h1 className="text-2xl font-bold dark:text-white">Prompt Workbench</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg dark:bg-red-900/50 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Main Content */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-6"
          defaultValue="editor"
        >
          <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto mb-2">
            <TabsTrigger value="editor">
              <div className="flex items-center gap-1">
                <Command className="w-4 h-4" /> Editor
              </div>
            </TabsTrigger>
            <TabsTrigger value="evaluation">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" /> Evaluation
              </div>
            </TabsTrigger>
            <TabsTrigger value="versions">
              <div className="flex items-center gap-1">
                <GitBranch className="w-4 h-4" /> Versions
              </div>
            </TabsTrigger>
            <TabsTrigger value="testing">
              <div className="flex items-center gap-1">
                <Beaker className="w-4 h-4" /> Testing
              </div>
            </TabsTrigger>
            <TabsTrigger value="analysis">
              <div className="flex items-center gap-1">
                <Microscope className="w-4 h-4" /> Analysis
              </div>
            </TabsTrigger>
            <TabsTrigger value="upgrade">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Upgrade
              </div>
            </TabsTrigger>
          </TabsList>
          
          <div className="space-y-6">
            <TabsContent value="editor" className="space-y-6 mt-0">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column - Input */}
                <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur transition-colors duration-300">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold dark:text-white">Prompt Configuration</h3>
                    
                    {/* Purpose */}
                    <div>
                      <Label>Purpose</Label>
                      <Input
                        value={template.purpose || ""}
                        onChange={(e) => handleTemplateChange("purpose", e.target.value)}
                        placeholder="What is the purpose of this prompt?"
                        className="bg-white/50 dark:bg-gray-900/50"
                      />
                    </div>
                    
                    {/* System Context Select */}
                    <div>
                      <Label>System Context</Label>
                      <Select
                        value={template.systemContext}
                        onValueChange={(value: SystemContext) => handleTemplateChange("systemContext", value)}
                      >
                        <SelectTrigger className="bg-white/50 dark:bg-gray-900/50">
                          <SelectValue placeholder="Select a system context" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Assistant">Assistant</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                          <SelectItem value="Teacher">Teacher</SelectItem>
                          <SelectItem value="Analyst">Analyst</SelectItem>
                          <SelectItem value="Creative">Creative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Output Format Select */}
                    <div>
                      <Label>Output Format</Label>
                      <Select
                        value={template.outputFormat}
                        onValueChange={(value: OutputFormat) => handleTemplateChange("outputFormat", value)}
                      >
                        <SelectTrigger className="bg-white/50 dark:bg-gray-900/50">
                          <SelectValue placeholder="Select an output format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Step by Step">Step by Step</SelectItem>
                          <SelectItem value="Bullet Points">Bullet Points</SelectItem>
                          <SelectItem value="Detailed Analysis">Detailed Analysis</SelectItem>
                          <SelectItem value="Code">Code</SelectItem>
                          <SelectItem value="Conversation">Conversation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Agentic Behavior Select */}
                    <div>
                      <Label>Agentic Behavior</Label>
                      <Select
                        value={template.agenticBehavior}
                        onValueChange={(value: AgenticBehavior) => handleTemplateChange("agenticBehavior", value)}
                      >
                        <SelectTrigger className="bg-white/50 dark:bg-gray-900/50">
                          <SelectValue placeholder="Select an agentic behavior" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Proactive">Proactive</SelectItem>
                          <SelectItem value="Reactive">Reactive</SelectItem>
                          <SelectItem value="Collaborative">Collaborative</SelectItem>
                          <SelectItem value="Analytical">Analytical</SelectItem>
                          <SelectItem value="Creative">Creative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Thinking Style Select */}
                    <div>
                      <Label>Thinking Style</Label>
                      <Select
                        value={template.thinkingStyle}
                        onValueChange={(value: ThinkingStyle) => handleTemplateChange("thinkingStyle", value)}
                      >
                        <SelectTrigger className="bg-white/50 dark:bg-gray-900/50">
                          <SelectValue placeholder="Select a thinking style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chain of Thought">Chain of Thought</SelectItem>
                          <SelectItem value="Tree of Thoughts">Tree of Thoughts</SelectItem>
                          <SelectItem value="Direct Answer">Direct Answer</SelectItem>
                          <SelectItem value="Socratic">Socratic</SelectItem>
                          <SelectItem value="Structured">Structured</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Main Input</Label>
                      <div className="mt-1">
                        <textarea
                          value={template.input}
                          onChange={(e) => handleTemplateChange("input", e.target.value)}
                          placeholder="Enter your main prompt or question..."
                          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent transition duration-200 min-h-[120px]"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Constraints (Optional)</Label>
                      <Input
                        value={template.constraints || ""}
                        onChange={(e) => handleTemplateChange("constraints", e.target.value)}
                        placeholder="Add any constraints or limitations..."
                        className="bg-white/50 dark:bg-gray-900/50"
                      />
                    </div>

                    <div>
                      <Label>Examples (Optional)</Label>
                      <div className="mt-1">
                        <textarea
                          value={template.examples || ""}
                          onChange={(e) => handleTemplateChange("examples", e.target.value)}
                          placeholder="Add example inputs/outputs..."
                          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent transition duration-200 min-h-[80px]"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={generatePrompt}
                      disabled={isEvaluating || !template.input.trim()}
                      className="w-full bg-pastel-purple hover:bg-pastel-purple/90 text-white transition-colors"
                    >
                      {isEvaluating ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span> Generating...
                        </>
                      ) : (
                        <>
                          <Command className="mr-2 h-4 w-4" /> Generate & Evaluate
                        </>
                      )}
                    </Button>
                  </div>
                </Card>

                {/* Right Column - Output */}
                <div className="space-y-4">
                  {/* Generated Prompt */}
                  {generatedPrompt ? (
                    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur transition-colors duration-300">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-pastel-yellow" />
                          <h2 className="text-lg font-semibold dark:text-white">Generated Prompt</h2>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => copyToClipboard(generatedPrompt)}
                          title="Copy to clipboard"
                          className={copySuccess ? "text-green-500" : ""}
                        >
                          <ClipboardCheck className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre className="whitespace-pre-wrap text-sm dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-auto max-h-96">
                        {generatedPrompt}
                      </pre>
                    </Card>
                  ) : null}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="evaluation" className="space-y-6 mt-0">
              {/* Evaluation Section */}
              {evaluation && (
                <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur transition-colors duration-300">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold dark:text-white">Prompt Evaluation</h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setActiveTab("analysis")}
                        >
                          View Analysis
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setActiveTab("upgrade")}
                        >
                          Upgrade Prompt
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Purpose Score</Label>
                      <div className="flex items-center gap-2">
                        <Progress value={evaluation.purposeScore} max={100} className={`h-4 ${getProgressColor(evaluation.purposeScore)}`}>
                          <div className={`h-4 ${getScoreColor(evaluation.purposeScore)}`} style={{ width: `${evaluation.purposeScore}%` }}></div>
                        </Progress>
                        <span className={getScoreColor(evaluation.purposeScore)}>{evaluation.purposeScore}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Clarity Score</Label>
                      <div className="flex items-center gap-2">
                        <Progress value={evaluation.clarityScore} max={100} className={`h-4 ${getProgressColor(evaluation.clarityScore)}`}>
                          <div className={`h-4 ${getScoreColor(evaluation.clarityScore)}`} style={{ width: `${evaluation.clarityScore}%` }}></div>
                        </Progress>
                        <span className={getScoreColor(evaluation.clarityScore)}>{evaluation.clarityScore}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Constraint Score</Label>
                      <div className="flex items-center gap-2">
                        <Progress value={evaluation.constraintScore} max={100} className={`h-4 ${getProgressColor(evaluation.constraintScore)}`}>
                          <div className={`h-4 ${getScoreColor(evaluation.constraintScore)}`} style={{ width: `${evaluation.constraintScore}%` }}></div>
                        </Progress>
                        <span className={getScoreColor(evaluation.constraintScore)}>{evaluation.constraintScore}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Quality Score</Label>
                      <div className="flex items-center gap-2">
                        <Progress value={evaluation.qualityScore} max={100} className={`h-4 ${getProgressColor(evaluation.qualityScore)}`}>
                          <div className={`h-4 ${getScoreColor(evaluation.qualityScore)}`} style={{ width: `${evaluation.qualityScore}%` }}></div>
                        </Progress>
                        <span className={getScoreColor(evaluation.qualityScore)}>{evaluation.qualityScore}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Average Score</Label>
                      <div className="flex items-center gap-2">
                        <Progress value={averageScore} max={100} className={`h-4 ${getProgressColor(averageScore)}`}>
                          <div className={`h-4 ${getScoreColor(averageScore)}`} style={{ width: `${averageScore}%` }}></div>
                        </Progress>
                        <span className={getScoreColor(averageScore)}>{averageScore}%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="versions" className="space-y-6 mt-0">
              {/* Versions Section */}
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur transition-colors duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold dark:text-white">Prompt Versions</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {versions.length} saved {versions.length === 1 ? 'version' : 'versions'}
                    </div>
                  </div>
                  
                  {versions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No versions saved yet. Generate a prompt to create a version.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {versions.map((version, index) => (
                        <div 
                          key={index} 
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-medium dark:text-white">
                              Version {versions.length - index}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(version.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1 mb-2">
                            {version.prompt.substring(0, 100)}...
                          </div>
                          <div className="flex items-center gap-1 text-xs mb-2">
                            <div className={`h-2 w-2 rounded-full ${getScoreColor(version.evaluation.qualityScore)}`}></div>
                            <span className="text-gray-600 dark:text-gray-300">
                              Quality Score: {version.evaluation.qualityScore}%
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs px-2 py-1 h-auto"
                              onClick={() => {
                                setGeneratedPrompt(version.prompt)
                                setEvaluation(version.evaluation)
                                setActiveTab("editor")
                              }}
                            >
                              Load
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs px-2 py-1 h-auto"
                              onClick={() => copyToClipboard(version.prompt)}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="testing" className="space-y-6 mt-0">
              {/* Testing Section */}
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur transition-colors duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold dark:text-white">Prompt Testing</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveTab("editor")}
                    >
                      Edit Prompt
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveTab("versions")}
                    >
                      View Versions
                    </Button>
                  </div>
                </div>
                
                <PromptTesting tests={[]} />
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6 mt-0">
              {/* Analysis Section */}
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur transition-colors duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold dark:text-white">Prompt Analysis</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveTab("upgrade")}
                    >
                      Upgrade Prompt
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveTab("testing")}
                    >
                      Test Prompt
                    </Button>
                  </div>
                </div>
                
                <PromptAnalysis analysis={promptAnalysis || {
                  clarityScore: 0,
                  specificityScore: 0,
                  constraintScore: 0,
                  purposeScore: 0,
                  strengths: [],
                  weaknesses: [],
                  improvements: []
                }} />
              </Card>
            </TabsContent>
            
            <TabsContent value="upgrade" className="space-y-6 mt-0">
              {/* Upgrade Section */}
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur transition-colors duration-300">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h2 className="text-lg font-semibold dark:text-white">Prompt Upgrade</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUpgradePrompt}
                      disabled={!generatedPrompt || isUpgrading}
                    >
                      {isUpgrading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Upgrading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Upgrade Prompt
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveTab("testing")}
                      disabled={!upgradedPrompt}
                    >
                      Test Upgraded Prompt
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                {!upgradedPrompt && !isUpgrading && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {generatedPrompt ? (
                      <p>Click "Upgrade Prompt" to get an enhanced version with improved structure and clarity</p>
                    ) : (
                      <p>Generate a prompt first in the Editor tab</p>
                    )}
                  </div>
                )}
                
                {isUpgrading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-amber-600 dark:text-amber-400">Upgrading your prompt with Gemini API...</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Improving structure, clarity, and effectiveness</p>
                  </div>
                )}
                
                {upgradedPrompt && !isUpgrading && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md text-sm whitespace-pre-wrap">
                      {upgradedPrompt.text}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Improvements Made
                      </h4>
                      <ul className="space-y-2">
                        {upgradedPrompt.improvements.map((improvement, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <div className="mt-1 text-amber-500">•</div>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <Button
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(upgradedPrompt.text)}
                        className={copySuccess ? "text-green-500" : ""}
                      >
                        {copySuccess ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <ClipboardCheck className="mr-2 h-4 w-4" />
                            Copy to Clipboard
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setGeneratedPrompt(upgradedPrompt.text);
                          setActiveTab("editor");
                        }}
                      >
                        Use as New Prompt
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
} 