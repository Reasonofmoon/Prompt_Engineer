import { Card } from "@/components/ui/card"
import { Microscope } from "lucide-react"
import { PromptAnalysis } from "./prompt-analysis"
import { UpgradedPromptView } from "./upgraded-prompt-view"
import type { PromptAnalysis as PromptAnalysisType, UpgradedPrompt } from "@/lib/prompt-analyzer"

interface PromptAnalysisTabProps {
  analysis: PromptAnalysisType | null
  upgrade: UpgradedPrompt | null
}

export function PromptAnalysisTab({ analysis, upgrade }: PromptAnalysisTabProps) {
  if (!analysis && !upgrade) {
    return (
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
        <div className="flex items-center gap-2 mb-4">
          <Microscope className="w-5 h-5 text-pastel-purple" />
          <h3 className="text-lg font-semibold">Prompt Analysis</h3>
        </div>
        <div className="text-center py-8 text-gray-500">Generate and upgrade a prompt to see the analysis</div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <PromptAnalysis analysis={analysis} />
      <UpgradedPromptView upgrade={upgrade} />
    </div>
  )
}

