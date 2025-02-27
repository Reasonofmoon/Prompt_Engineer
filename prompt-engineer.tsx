"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BrainCircuit, ClipboardCheck, Command, History, Lightbulb, Moon, Sun, Zap, BarChart2, Send, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromptAnalysis } from "@/components/prompt-analysis"
import type { PromptAnalysis as PromptAnalysisType } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"

// Types for prompt engineering
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
  constraints: string
  examples: string
}

// Add new types for the tabs functionality
type TabType = "create" | "upgrade" | "analyze" | "gemini"

export default function PromptEngineer() {
  const [darkMode, setDarkMode] = useState(false)
  const [template, setTemplate] = useState<PromptTemplate>({
    systemContext: "Assistant",
    outputFormat: "Step by Step",
    agenticBehavior: "Proactive",
    thinkingStyle: "Chain of Thought",
    input: "",
    constraints: "",
    examples: "",
  })
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("create")
  const [promptToUpgrade, setPromptToUpgrade] = useState("")
  const [upgradedPrompt, setUpgradedPrompt] = useState("")
  const [promptToAnalyze, setPromptToAnalyze] = useState("")
  const [analysisResult, setAnalysisResult] = useState<PromptAnalysisType | null>(null)
  const [promptForGemini, setPromptForGemini] = useState("")
  const [geminiResponse, setGeminiResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Dark mode effect with persistence
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode")
    const isDark = savedDarkMode 
      ? savedDarkMode === "true" 
      : window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(isDark)
  }, [])
  
  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString())
    // Apply dark mode to document for full-page styling
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("promptHistory")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Failed to parse history:", e)
      }
    }
    
    // 다크모드 설정 로드
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(prefersDark)
  }, [])
  
  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("promptHistory", JSON.stringify(history.slice(0, 10)))
    }
  }, [history])

  // Generate prompt based on template with memoization
  const generatePrompt = useCallback(() => {
    if (!template.input.trim()) {
      setError("Please enter your main input")
      toast({
        title: "Input required",
        description: "Please enter your main input before generating a prompt.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }
    
    setError(null)

    try {
      const prompt = `# ${template.systemContext} Mode

## Main Task
${template.input}

${template.constraints ? `## Constraints\n${template.constraints}\n` : ""}
${template.examples ? `## Examples\n${template.examples}\n` : ""}

## Output Format
Please provide your response in ${template.outputFormat} format.

## Approach
Use a ${template.thinkingStyle} approach and be ${template.agenticBehavior.toLowerCase()} in your response.`

      setGeneratedPrompt(prompt)
      
      // 히스토리에 추가
      const newHistory = [prompt, ...history].slice(0, 10) // 최대 10개 저장
      setHistory(newHistory)
      localStorage.setItem("promptHistory", JSON.stringify(newHistory))
      
      toast({
        title: "Prompt generated",
        description: "Your prompt has been successfully generated.",
        duration: 2000,
      })
    } catch (error) {
      console.error("Error generating prompt:", error)
      setError("Failed to generate prompt")
      toast({
        title: "Generation failed",
        description: "An error occurred while generating your prompt.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }, [template, history])
  
  // Handle clipboard copy with feedback
  const handleCopyToClipboard = useCallback(async (text: string) => {
    if (!text) return
    
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      toast({
        title: "Copied to clipboard",
        description: "The text has been copied to your clipboard.",
        duration: 2000,
      })
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
      setError("Failed to copy to clipboard")
      toast({
        title: "Copy failed",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }, [])
  
  // Handle template field changes
  const handleTemplateChange = useCallback((field: keyof PromptTemplate, value: any) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  // Function to upgrade a prompt
  const upgradePrompt = useCallback(async () => {
    if (!promptToUpgrade.trim()) {
      setError("Please enter a prompt to upgrade")
      toast({
        title: "Input required",
        description: "Please enter a prompt to upgrade.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      // 실제 API 호출로 대체 필요
      // const response = await fetch('/api/upgrade-prompt', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt: promptToUpgrade })
      // });
      // const data = await response.json();
      // setUpgradedPrompt(data.upgradedPrompt);
      
      // 임시 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const improved = `Improved version of your prompt:

${promptToUpgrade}

Additional context: This prompt has been enhanced with more specific instructions and clearer expectations.
Consider adding examples or constraints for even better results.`
      
      setUpgradedPrompt(improved)
      
      toast({
        title: "Prompt upgraded",
        description: "Your prompt has been successfully upgraded.",
        duration: 2000,
      })
    } catch (error) {
      console.error("Error upgrading prompt:", error)
      setError("Failed to upgrade prompt")
      toast({
        title: "Upgrade failed",
        description: "An error occurred while upgrading your prompt.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }, [promptToUpgrade])

  // Function to analyze a prompt
  const analyzePrompt = useCallback(async () => {
    if (!promptToAnalyze.trim()) {
      setError("Please enter a prompt to analyze")
      toast({
        title: "Input required",
        description: "Please enter a prompt to analyze.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      // 실제 API 호출로 대체 필요
      // const response = await fetch('/api/analyze-prompt', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt: promptToAnalyze })
      // });
      // const data = await response.json();
      // setAnalysisResult(data);
      
      // 임시 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 샘플 분석 결과
      setAnalysisResult({
        clarityScore: 75,
        specificityScore: 65,
        constraintScore: 80,
        purposeScore: 70,
        strengths: [
          "Clear main objective",
          "Good context setting",
          "Appropriate tone"
        ],
        weaknesses: [
          "Could use more specific examples",
          "Missing some constraints",
          "Output format could be clearer"
        ],
        improvements: [
          "Add 2-3 specific examples",
          "Specify format requirements more clearly",
          "Consider adding constraints on length or scope"
        ],
        detailedAnalysis: "The prompt is generally well-structured but could benefit from more specific examples and clearer constraints. The purpose is clear, but the expected output format could be more explicitly defined.",
        metrics: {
          wordCount: promptToAnalyze.split(/\s+/).length,
          complexity: "Medium",
          tone: "Professional"
        },
        keywords: ["analyze", "prompt", "improve", "clarity"]
      })
      
      toast({
        title: "Analysis complete",
        description: "Your prompt has been successfully analyzed.",
        duration: 2000,
      })
    } catch (error) {
      console.error("Error analyzing prompt:", error)
      setError("Failed to analyze prompt")
      toast({
        title: "Analysis failed",
        description: "An error occurred while analyzing your prompt.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }, [promptToAnalyze])

  // Function to send prompt to Gemini
  const sendToGemini = useCallback(async () => {
    if (!promptForGemini.trim()) {
      setError("Please enter a prompt to send to Gemini")
      toast({
        title: "Input required",
        description: "Please enter a prompt to send to Gemini.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      // 실제 Gemini API 호출로 대체 필요
      // const response = await fetch('/api/gemini', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt: promptForGemini })
      // });
      // const data = await response.json();
      // setGeminiResponse(data.response);
      
      // 임시 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const response = `This is a simulated response from Gemini API.

Based on your prompt, here's what I understand you're asking for...

[Detailed response would appear here in a real implementation]

I hope this helps! Let me know if you need any clarification or have follow-up questions.`
      
      setGeminiResponse(response)
      
      toast({
        title: "Response received",
        description: "Successfully received response from Gemini.",
        duration: 2000,
      })
    } catch (error) {
      console.error("Error sending to Gemini:", error)
      setError("Failed to get response from Gemini")
      toast({
        title: "Request failed",
        description: "Failed to get response from Gemini API.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }, [promptForGemini])

  // 2. 히스토리 관리 함수 추가
  const clearHistory = useCallback(() => {
    if (confirm("Are you sure you want to clear your prompt history?")) {
      setHistory([]);
      localStorage.removeItem("promptHistory");
      toast({
        title: "History cleared",
        description: "Your prompt history has been cleared.",
        duration: 2000,
      });
    }
  }, []);
  
  // 3. 히스토리 아이템 선택 함수 추가
  const selectHistoryItem = useCallback((prompt: string) => {
    setGeneratedPrompt(prompt);
    toast({
      title: "History item selected",
      description: "The selected prompt has been loaded.",
      duration: 2000,
    });
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "dark" : ""}`}>
      <div className="container mx-auto p-6 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold dark:text-white">Prompt Engineer</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} className="rounded-full">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* 4. 에러 알림 컴포넌트 추가 */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="mb-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="gemini">Gemini</TabsTrigger>
          </TabsList>

          {/* Create Tab Content */}
          <TabsContent value="create">
            {/* Main Content */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Input */}
              <Card className="p-6 dark:bg-gray-800 transition-colors duration-200">
                <div className="space-y-4">
                  <div>
                    <Label>System Context</Label>
                    <Select
                      value={template.systemContext}
                      onValueChange={(value: SystemContext) => handleTemplateChange("systemContext", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
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

                  <div>
                    <Label>Output Format</Label>
                    <Select
                      value={template.outputFormat}
                      onValueChange={(value: OutputFormat) => handleTemplateChange("outputFormat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
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

                  <div>
                    <Label>Agentic Behavior</Label>
                    <Select
                      value={template.agenticBehavior}
                      onValueChange={(value: AgenticBehavior) => handleTemplateChange("agenticBehavior", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
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

                  <div>
                    <Label>Thinking Style</Label>
                    <Select
                      value={template.thinkingStyle}
                      onValueChange={(value: ThinkingStyle) => handleTemplateChange("thinkingStyle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                    <Textarea
                      value={template.input}
                      onChange={(e) => handleTemplateChange("input", e.target.value)}
                      placeholder="Enter your main task or question..."
                      className="h-24"
                    />
                  </div>

                  <div>
                    <Label>Constraints (Optional)</Label>
                    <Textarea
                      value={template.constraints}
                      onChange={(e) => handleTemplateChange("constraints", e.target.value)}
                      placeholder="Enter any constraints or limitations..."
                      className="h-20"
                    />
                  </div>

                  <div>
                    <Label>Examples (Optional)</Label>
                    <Textarea
                      value={template.examples}
                      onChange={(e) => handleTemplateChange("examples", e.target.value)}
                      placeholder="Enter examples to guide the response..."
                      className="h-20"
                    />
                  </div>

                  <Button 
                    onClick={generatePrompt} 
                    className="w-full"
                    disabled={!template.input.trim()}
                  >
                    <Command className="mr-2 h-4 w-4" /> Generate Prompt
                  </Button>
                </div>
              </Card>

              {/* Right Column - Output & History */}
              <div className="space-y-4">
                {/* Generated Prompt */}
                {generatedPrompt && (
                  <Card className="p-6 dark:bg-gray-800 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <h2 className="text-lg font-semibold dark:text-white">Generated Prompt</h2>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleCopyToClipboard(generatedPrompt)}
                        title="Copy to clipboard"
                        aria-label="Copy to clipboard"
                      >
                        <ClipboardCheck className={`h-4 w-4 ${copySuccess ? "text-green-500" : ""}`} />
                      </Button>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto max-h-96">
                      {generatedPrompt}
                    </pre>
                  </Card>
                )}

                {/* History */}
                <Card className="p-6 dark:bg-gray-800 transition-colors duration-200">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowHistory(!showHistory)}>
                    <History className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold dark:text-white">Prompt History</h2>
                    {history.length > 0 && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                        {history.length}
                      </span>
                    )}
                  </div>
                  <AnimatePresence>
                    {showHistory && history.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 space-y-2 max-h-96 overflow-auto"
                      >
                        {history.map((prompt, index) => (
                          <div
                            key={index}
                            className="text-sm p-3 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => selectHistoryItem(prompt)}
                            aria-label={`History item ${index + 1}`}
                          >
                            {prompt.slice(0, 100)}{prompt.length > 100 ? "..." : ""}
                          </div>
                        ))}
                        {history.length > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={clearHistory}
                          >
                            Clear History
                          </Button>
                        )}
                      </motion.div>
                    )}
                    {showHistory && history.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No history yet. Generate some prompts!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Upgrade Tab Content */}
          <TabsContent value="upgrade">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6 dark:bg-gray-800 transition-colors duration-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-lg font-semibold dark:text-white">Upgrade Existing Prompt</h2>
                  </div>
                  <div>
                    <Label>Paste your prompt</Label>
                    <Textarea
                      value={promptToUpgrade}
                      onChange={(e) => setPromptToUpgrade(e.target.value)}
                      placeholder="Paste the prompt you want to upgrade..."
                      className="h-64"
                    />
                  </div>
                  <Button 
                    onClick={upgradePrompt} 
                    className="w-full"
                    disabled={!promptToUpgrade.trim() || isLoading}
                  >
                    <Zap className="mr-2 h-4 w-4" /> 
                    {isLoading ? "Upgrading..." : "Upgrade Prompt"}
                  </Button>
                </div>
              </Card>
              
              <div className="space-y-4">
                {upgradedPrompt && (
                  <Card className="p-6 dark:bg-gray-800 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-green-500" />
                        <h2 className="text-lg font-semibold dark:text-white">Upgraded Prompt</h2>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleCopyToClipboard(upgradedPrompt)}
                        title="Copy to clipboard"
                      >
                        <ClipboardCheck className={`h-4 w-4 ${copySuccess ? "text-green-500" : ""}`} />
                      </Button>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto max-h-96">
                      {upgradedPrompt}
                    </pre>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Analyze Tab Content */}
          <TabsContent value="analyze">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6 dark:bg-gray-800 transition-colors duration-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className="w-5 h-5 text-purple-500" />
                    <h2 className="text-lg font-semibold dark:text-white">Analyze Prompt</h2>
                  </div>
                  <div>
                    <Label>Paste your prompt</Label>
                    <Textarea
                      value={promptToAnalyze}
                      onChange={(e) => setPromptToAnalyze(e.target.value)}
                      placeholder="Paste the prompt you want to analyze..."
                      className="h-64"
                    />
                  </div>
                  <Button 
                    onClick={analyzePrompt} 
                    className="w-full"
                    disabled={!promptToAnalyze.trim() || isLoading}
                  >
                    <BarChart2 className="mr-2 h-4 w-4" /> 
                    {isLoading ? "Analyzing..." : "Analyze Prompt"}
                  </Button>
                </div>
              </Card>
              
              <div className="space-y-4">
                {/* 5. 분석 결과 표시 개선 */}
                {analysisResult && (
                  <PromptAnalysis analysis={analysisResult} />
                )}
                {/* 6. 로딩 상태 표시 추가 */}
                {isLoading && !analysisResult && (
                  <Card className="p-6 dark:bg-gray-800 transition-colors duration-200">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                      <p className="text-purple-500">Analyzing your prompt...</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Gemini Tab Content */}
          <TabsContent value="gemini">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6 dark:bg-gray-800 transition-colors duration-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Send className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold dark:text-white">Send to Gemini</h2>
                  </div>
                  <div>
                    <Label>Your prompt for Gemini</Label>
                    <Textarea
                      value={promptForGemini}
                      onChange={(e) => setPromptForGemini(e.target.value)}
                      placeholder="Enter your prompt to send to Gemini API..."
                      className="h-64"
                    />
                  </div>
                  <Button 
                    onClick={sendToGemini} 
                    className="w-full"
                    disabled={!promptForGemini.trim() || isLoading}
                  >
                    <Send className="mr-2 h-4 w-4" /> 
                    {isLoading ? "Sending..." : "Send to Gemini"}
                  </Button>
                </div>
              </Card>
              
              <div className="space-y-4">
                {geminiResponse && (
                  <Card className="p-6 dark:bg-gray-800 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-semibold dark:text-white">Gemini Response</h2>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleCopyToClipboard(geminiResponse)}
                        title="Copy to clipboard"
                      >
                        <ClipboardCheck className={`h-4 w-4 ${copySuccess ? "text-green-500" : ""}`} />
                      </Button>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto max-h-96">
                      {geminiResponse}
                    </pre>
                  </Card>
                )}
                {/* 7. 로딩 상태 표시 추가 */}
                {isLoading && !geminiResponse && (
                  <Card className="p-6 dark:bg-gray-800 transition-colors duration-200">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <p className="text-blue-500">Waiting for Gemini response...</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

