"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Microscope, AlertTriangle, Check, Award, ChevronDown, ChevronUp, ArrowRight, ThumbsUp, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// 1. 타입 정의 단순화
interface PromptAnalysisType {
  clarityScore?: number
  specificityScore?: number
  contextScore?: number
  clarityFeedback?: string
  specificityFeedback?: string
  contextFeedback?: string
  detailedFeedback?: string
  strengths?: string[]
  weaknesses?: string[]
  optimizationSuggestions?: string[]
  recommendations?: string[]
}

interface PromptAnalysisProps {
  analysis: PromptAnalysisType | null
}

export function PromptAnalysis({ analysis }: PromptAnalysisProps) {
  // 2. 상태 관리 단순화
  const [expandedSections, setExpandedSections] = useState({
    strengths: true,
    weaknesses: true,
    optimization: true
  })
  const [activeTab, setActiveTab] = useState("overview")

  // 3. 전체 점수 계산 단순화
  const overallScore = useMemo(() => {
    if (!analysis) return 0
    
    const scores = [
      analysis.clarityScore || 0,
      analysis.specificityScore || 0, 
      analysis.contextScore || 0
    ]
    
    const sum = scores.reduce((a, b) => a + b, 0)
    return Math.round(sum / scores.length)
  }, [analysis])

  // 4. 색상 클래스 함수 단순화
  function getScoreColor(score: number) {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }
  
  function getProgressColor(score: number) {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  // 5. 목록 아이템 렌더링 단순화
  function renderListItems(items: string[] = [], icon: React.ReactNode) {
    if (items.length === 0) {
      return <div className="text-gray-500 dark:text-gray-400 text-sm italic">None available</div>
    }
    
    return items.map((item, index) => (
      <div key={index} className="flex items-start gap-2 mb-2">
        <div className="mt-1 shrink-0">{icon}</div>
        <span className="text-sm">{item}</span>
      </div>
    ))
  }

  // 6. 분석 데이터가 없는 경우 처리
  if (!analysis) {
    return (
      <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Microscope className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Prompt Analysis</h3>
        </div>
        <div className="text-center py-8 text-gray-500">Generate a prompt to see the analysis</div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg border shadow-sm">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Microscope className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Prompt Analysis</h3>
        </div>
        
        {/* 7. 점수 표시 단순화 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall</span>
              <span className={getScoreColor(overallScore)}>{overallScore}/100</span>
            </div>
            <Progress value={overallScore} className={getProgressColor(overallScore)} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Clarity</span>
              <span className={getScoreColor(analysis.clarityScore || 0)}>
                {analysis.clarityScore || 0}/100
              </span>
            </div>
            <Progress value={analysis.clarityScore || 0} className={getProgressColor(analysis.clarityScore || 0)} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Specificity</span>
              <span className={getScoreColor(analysis.specificityScore || 0)}>
                {analysis.specificityScore || 0}/100
              </span>
            </div>
            <Progress value={analysis.specificityScore || 0} className={getProgressColor(analysis.specificityScore || 0)} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Context</span>
              <span className={getScoreColor(analysis.contextScore || 0)}>
                {analysis.contextScore || 0}/100
              </span>
            </div>
            <Progress value={analysis.contextScore || 0} className={getProgressColor(analysis.contextScore || 0)} />
          </div>
        </div>
        
        {/* 8. 탭 인터페이스 단순화 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* 9. 섹션 토글 단순화 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-left"
                onClick={() => setExpandedSections({...expandedSections, strengths: !expandedSections.strengths})}
              >
                <div className="font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Strengths
                </div>
                {expandedSections.strengths ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.strengths && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      {renderListItems(analysis.strengths, <Check className="w-4 h-4 text-green-500" />)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-left"
                onClick={() => setExpandedSections({...expandedSections, weaknesses: !expandedSections.weaknesses})}
              >
                <div className="font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Areas for Improvement
                </div>
                {expandedSections.weaknesses ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.weaknesses && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      {renderListItems(analysis.weaknesses, <AlertTriangle className="w-4 h-4 text-yellow-500" />)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-left"
                onClick={() => setExpandedSections({...expandedSections, optimization: !expandedSections.optimization})}
              >
                <div className="font-medium flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  Optimization Suggestions
                </div>
                {expandedSections.optimization ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.optimization && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      {renderListItems(analysis.optimizationSuggestions, <ArrowRight className="w-4 h-4 text-blue-500" />)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-4 space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Clarity Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {analysis.clarityFeedback || "No detailed clarity analysis available."}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Specificity Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {analysis.specificityFeedback || "No detailed specificity analysis available."}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Context Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {analysis.contextFeedback || "No detailed context analysis available."}
                </p>
              </div>
              
              {analysis.detailedFeedback && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Additional Feedback</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {analysis.detailedFeedback}
                  </p>
                </div>
              )}
            </div>
            
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-1">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

