"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ClipboardCheck, Command, Lightbulb, Moon, Sun, History } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
}

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
      } catch (error) {
        console.error("Failed to parse history:", error)
      }
    }
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
      alert("Please enter a main input for your prompt")
      return
    }

    const prompt = `System: You are a ${template.systemContext} with ${template.agenticBehavior} behavior.
Output Format: Present your response in ${template.outputFormat} format.
Thinking Process: Use ${template.thinkingStyle} reasoning.

Task: ${template.input}

${template.constraints ? `Constraints: ${template.constraints}` : ""}
${template.examples ? `Examples: ${template.examples}` : ""}

Please provide your response based on these parameters.`

    setGeneratedPrompt(prompt)
    setHistory((prev) => [prompt, ...prev.slice(0, 9)]) // Limit history to 10 items
  }, [template])
  
  // Handle clipboard copy with feedback
  const handleCopyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
      alert("Failed to copy to clipboard")
    }
  }, [generatedPrompt])
  
  // Handle template field changes
  const handleTemplateChange = useCallback(<T extends keyof PromptTemplate>(
    field: T,
    value: PromptTemplate[T]
  ) => {
    setTemplate(prev => ({ ...prev, [field]: value }))
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "dark" : ""}`}>
      <div className="container mx-auto p-6 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold dark:text-white">Prompt Engineer</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column - Input */}
          <Card className="p-6 dark:bg-gray-800 transition-colors duration-200">
            <div className="space-y-4">
              {/* System Context Select */}
              <div>
                <Label>System Context</Label>
                <Select
                  value={template.systemContext}
                  onValueChange={(value: SystemContext) => handleTemplateChange("systemContext", value)}
                >
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                <Textarea
                  value={template.input}
                  onChange={(e) => handleTemplateChange("input", e.target.value)}
                  placeholder="Enter your main prompt or question..."
                  className="h-24"
                  required
                />
              </div>

              <div>
                <Label>Constraints (Optional)</Label>
                <Input
                  value={template.constraints}
                  onChange={(e) => handleTemplateChange("constraints", e.target.value)}
                  placeholder="Add any constraints or limitations..."
                />
              </div>

              <div>
                <Label>Examples (Optional)</Label>
                <Input
                  value={template.examples}
                  onChange={(e) => handleTemplateChange("examples", e.target.value)}
                  placeholder="Add example inputs/outputs..."
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
                    onClick={handleCopyToClipboard}
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
                        onClick={() => setGeneratedPrompt(prompt)}
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
                        onClick={() => {
                          if (confirm("Are you sure you want to clear your prompt history?")) {
                            setHistory([]);
                            localStorage.removeItem("promptHistory");
                          }
                        }}
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
      </div>
    </div>
  )
} 