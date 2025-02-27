"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BrainCircuit,
  ClipboardCheck,
  Command,
  Lightbulb,
  Moon,
  Sun,
  Sparkles,
  Target,
  ThumbsUp,
  GitBranch,
  Beaker,
  Microscope,
  Zap,
  History,
  X
} from 'lucide-react';
import { useToast } from "@/components/ui/toast-context";
import { PromptAnalysis } from '@/components/prompt-analysis';
import { PromptUpgrade } from '@/components/prompt-upgrade';
import { PromptTesting } from '@/components/prompt-testing';
import { analyzePrompt, upgradePrompt, testPrompt } from '@/lib/prompt-analyzer';
import type { 
  SystemContext, 
  OutputFormat, 
  AgenticBehavior, 
  ThinkingStyle,
  PromptTemplate,
  PromptAnalysis as PromptAnalysisType,
  UpgradedPrompt as UpgradedPromptType,
  TabType
} from '@/lib/types';

export default function PromptWorkbench() {
  // 상태 관리
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("editor");
  const [systemContext, setSystemContext] = useState<SystemContext>("Assistant");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("Step by Step");
  const [agenticBehavior, setAgenticBehavior] = useState<AgenticBehavior>("Proactive");
  const [thinkingStyle, setThinkingStyle] = useState<ThinkingStyle>("Chain of Thought");
  const [userInput, setUserInput] = useState("");
  const [constraints, setConstraints] = useState("");
  const [examples, setExamples] = useState("");
  const [purpose, setPurpose] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptAnalysis, setPromptAnalysis] = useState<PromptAnalysisType | null>(null);
  const [upgradedPrompt, setUpgradedPrompt] = useState<UpgradedPromptType | null>(null);
  const [geminiResponse, setGeminiResponse] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const { toast } = useToast();

  // 다크 모드 초기화
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 다크 모드 토글
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 프롬프트 생성
  const generatePrompt = useCallback(() => {
    if (!userInput) {
      toast({
        title: "Input required",
        description: "Please enter your input",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      let prompt = `You are acting as a ${systemContext}.\n\n`;
      
      if (purpose) {
        prompt += `Purpose: ${purpose}\n\n`;
      }
      
      prompt += `${userInput}\n\n`;
      
      if (constraints) {
        prompt += `Constraints:\n${constraints}\n\n`;
      }
      
      if (examples) {
        prompt += `Examples:\n${examples}\n\n`;
      }
      
      prompt += `Please be ${agenticBehavior.toLowerCase()} in your approach.\n`;
      prompt += `Use a ${thinkingStyle} reasoning style.\n`;
      prompt += `Format your response as ${outputFormat}.`;
      
      setGeneratedPrompt(prompt);
      setPromptHistory(prev => [...prev, prompt]);
      
      toast({
        title: "Prompt generated",
        description: "Your prompt has been generated successfully",
      });
    } catch (error) {
      console.error('Generation error:', error);
      setError("Failed to generate prompt");
      
      toast({
        title: "Generation failed",
        description: "An error occurred while generating your prompt",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [systemContext, outputFormat, agenticBehavior, thinkingStyle, userInput, constraints, examples, purpose, toast]);

  // 프롬프트 분석
  const handleAnalyzePrompt = useCallback(async () => {
    if (!generatedPrompt) {
      toast({
        title: "No prompt to analyze",
        description: "Please generate a prompt first",
        variant: "destructive",
      });
      return;
    }
    
    setIsEvaluating(true);
    setError(null);
    
    try {
      const analysis = await analyzePrompt(generatedPrompt);
      setPromptAnalysis(analysis);
      
      toast({
        title: "Analysis complete",
        description: "Your prompt has been analyzed successfully",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      setError("Failed to analyze prompt");
      
      toast({
        title: "Analysis failed",
        description: "An error occurred while analyzing your prompt",
        variant: "destructive",
      });
    } finally {
      setIsEvaluating(false);
    }
  }, [generatedPrompt, toast]);

  // 프롬프트 업그레이드
  const handleUpgradePrompt = useCallback(async () => {
    if (!generatedPrompt) {
      toast({
        title: "No prompt to upgrade",
        description: "Please generate a prompt first",
        variant: "destructive",
      });
      return;
    }
    
    setIsEvaluating(true);
    setError(null);
    
    try {
      const upgraded = await upgradePrompt(generatedPrompt);
      setUpgradedPrompt(upgraded);
      
      toast({
        title: "Upgrade complete",
        description: "Your prompt has been upgraded successfully",
      });
    } catch (error) {
      console.error('Upgrade error:', error);
      setError("Failed to upgrade prompt");
      
      toast({
        title: "Upgrade failed",
        description: "An error occurred while upgrading your prompt",
        variant: "destructive",
      });
    } finally {
      setIsEvaluating(false);
    }
  }, [generatedPrompt, toast]);

  // Gemini 테스트
  const handleTestWithGemini = useCallback(async () => {
    if (!generatedPrompt) {
      toast({
        title: "No prompt to test",
        description: "Please generate a prompt first",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeminiLoading(true);
    setError(null);
    
    try {
      const response = await testPrompt(generatedPrompt);
      setGeminiResponse(response);
      
      toast({
        title: "Test complete",
        description: "Gemini has responded to your prompt",
      });
    } catch (error) {
      console.error('Gemini test error:', error);
      setError("Failed to test with Gemini");
      
      toast({
        title: "Test failed",
        description: "An error occurred while testing with Gemini",
        variant: "destructive",
      });
    } finally {
      setIsGeminiLoading(false);
    }
  }, [generatedPrompt, toast]);

  // 클립보드에 복사
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      
      toast({
        title: "Copied to clipboard",
        description: "Text has been copied to your clipboard",
        duration: 2000,
      });
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Copy error:', error);
      
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  }, [toast]);

  // 프롬프트 지우기
  const clearPrompt = useCallback(() => {
    setGeneratedPrompt("");
    setPromptAnalysis(null);
    setUpgradedPrompt(null);
    setGeminiResponse("");
    setError(null);
    
    toast({
      title: "Prompt cleared",
      description: "Your prompt has been cleared",
    });
  }, [toast]);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prompt Workbench</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="editor" className="space-y-4" onValueChange={(value) => setActiveTab(value as TabType)}>
          <TabsList className="grid grid-cols-5 gap-2 mb-6">
            <TabsTrigger value="editor" className="flex items-center gap-1">
              <Command className="w-4 h-4" />
              <span>Editor</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-1">
              <Microscope className="w-4 h-4" />
              <span>Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="upgrade" className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span>Upgrade</span>
            </TabsTrigger>
            <TabsTrigger value="gemini" className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>Test</span>
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-1">
              <Beaker className="w-4 h-4" />
              <span>Scenarios</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-semibold dark:text-white">Prompt Builder</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="systemContext">System Context</Label>
                    <Select
                      value={systemContext}
                      onValueChange={(value) => setSystemContext(value as SystemContext)}
                    >
                      <SelectTrigger id="systemContext">
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
                  
                  <div>
                    <Label htmlFor="outputFormat">Output Format</Label>
                    <Select
                      value={outputFormat}
                      onValueChange={(value) => setOutputFormat(value as OutputFormat)}
                    >
                      <SelectTrigger id="outputFormat">
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
                  
                  <div>
                    <Label htmlFor="agenticBehavior">Agentic Behavior</Label>
                    <Select
                      value={agenticBehavior}
                      onValueChange={(value) => setAgenticBehavior(value as AgenticBehavior)}
                    >
                      <SelectTrigger id="agenticBehavior">
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
                  
                  <div>
                    <Label htmlFor="thinkingStyle">Thinking Style</Label>
                    <Select
                      value={thinkingStyle}
                      onValueChange={(value) => setThinkingStyle(value as ThinkingStyle)}
                    >
                      <SelectTrigger id="thinkingStyle">
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
                    <Label htmlFor="purpose">Purpose (Optional)</Label>
                    <Input
                      id="purpose"
                      placeholder="What is the purpose of this prompt?"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="userInput">Input</Label>
                    <Textarea
                      id="userInput"
                      placeholder="Enter your main prompt content..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="constraints">Constraints (Optional)</Label>
                    <Textarea
                      id="constraints"
                      placeholder="Enter any constraints..."
                      value={constraints}
                      onChange={(e) => setConstraints(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="examples">Examples (Optional)</Label>
                    <Textarea
                      id="examples"
                      placeholder="Enter examples..."
                      value={examples}
                      onChange={(e) => setExamples(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <Button
                    onClick={generatePrompt}
                    disabled={!userInput || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        Generating...
                      </>
                    ) : (
                      <>Generate Prompt</>
                    )}
                  </Button>
                </div>
              </Card>
              
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold dark:text-white">Generated Prompt</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(generatedPrompt)}
                      disabled={!generatedPrompt}
                      className="hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      aria-label="Copy to clipboard"
                    >
                      <ClipboardCheck className={`h-4 w-4 ${copySuccess ? "text-green-500" : ""}`} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearPrompt}
                      disabled={!generatedPrompt}
                      className="hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      aria-label="Clear prompt"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                {!generatedPrompt ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 dark:text-gray-600">
                    <Command className="h-12 w-12 mb-4 opacity-20" />
                    <p>Your generated prompt will appear here</p>
                  </div>
                ) : (
                  <div className="relative">
                    <pre className="whitespace-pre-wrap text-sm dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-auto h-[400px] transition-colors duration-300">
                      {generatedPrompt}
                    </pre>
                    
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setActiveTab("analysis");
                          handleAnalyzePrompt();
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Microscope className="w-4 h-4 mr-2" />
                        Analyze
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => {
                          setActiveTab("upgrade");
                          handleUpgradePrompt();
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Upgrade
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => {
                          setActiveTab("gemini");
                          handleTestWithGemini();
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>
                )}
                
                {promptHistory.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <History className="w-4 h-4 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">History</h3>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {promptHistory.length} prompt{promptHistory.length !== 1 ? 's' : ''} generated
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-6">
            <div className="space-y-6">
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-purple-500" />
                    <h2 className="text-lg font-semibold dark:text-white">Prompt Analysis</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAnalyzePrompt}
                      disabled={!generatedPrompt || isEvaluating}
                      className="hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      {isEvaluating ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>Analyze Prompt</>
                      )}
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                {!promptAnalysis && !isEvaluating && (
                  <div className="text-center py-8 text-gray-500">
                    Click "Analyze Prompt" to get detailed insights about your prompt
                  </div>
                )}
                
                {isEvaluating && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-purple-600 dark:text-purple-400">Analyzing your prompt...</p>
                  </div>
                )}
                
                {promptAnalysis && !isEvaluating && (
                  <PromptAnalysis analysis={promptAnalysis} />
                )}
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="upgrade" className="mt-6">
            <div className="space-y-6">
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
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
                      disabled={!generatedPrompt || isEvaluating}
                      className="hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                    >
                      {isEvaluating ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Upgrading...
                        </>
                      ) : (
                        <>Upgrade Prompt</>
                      )}
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                {!upgradedPrompt && !isEvaluating && (
                  <div className="text-center py-8 text-gray-500">
                    Click "Upgrade Prompt" to get an enhanced version of your prompt
                  </div>
                )}
                
                {isEvaluating && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 border-4 border-amber-300 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-amber-500">Upgrading your prompt...</p>
                  </div>
                )}
                
                {upgradedPrompt && !isEvaluating && (
                  <PromptUpgrade upgrade={upgradedPrompt} onCopy={copyToClipboard} />
                )}
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="gemini" className="mt-6">
            <div className="space-y-6">
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold dark:text-white">Test with Gemini</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTestWithGemini}
                      disabled={!generatedPrompt || isGeminiLoading}
                      className="hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      {isGeminiLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Testing...
                        </>
                      ) : (
                        <>Test Prompt</>
                      )}
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                {!geminiResponse && !isGeminiLoading && (
                  <div className="text-center py-8 text-gray-500">
                    Click "Test Prompt" to see how Gemini responds to your prompt
                  </div>
                )}
                
                {isGeminiLoading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-blue-500">Getting response from Gemini...</p>
                  </div>
                )}
                
                {geminiResponse && !isGeminiLoading && (
                  <div className="relative">
                    <pre className="whitespace-pre-wrap text-sm dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-auto h-[400px] transition-colors duration-300">
                      {geminiResponse}
                    </pre>
                    
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setActiveTab("analysis");
                          handleAnalyzePrompt();
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Microscope className="w-4 h-4 mr-2" />
                        Analyze
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => {
                          setActiveTab("upgrade");
                          handleUpgradePrompt();
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Upgrade
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => {
                          setActiveTab("gemini");
                          handleTestWithGemini();
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="testing">
            <div className="space-y-6">
              <Card className="p-6 bg-white dark:bg-gray-800 backdrop-blur">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-green-500" />
                    <h2 className="text-lg font-semibold dark:text-white">Prompt Testing</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveTab("gemini");
                        handleTestWithGemini();
                      }}
                      disabled={!generatedPrompt || isGeminiLoading}
                      className="hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                    >
                      {isGeminiLoading ? (
                        <>
                          <div className="mr-2 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Testing...
                        </>
                      ) : (
                        <>Test with Gemini</>
                      )}
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <PromptTesting tests={[]} />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}