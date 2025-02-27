"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ClipboardCopy, Check } from "lucide-react"
import type { UpgradedPrompt } from "@/lib/types"

interface PromptUpgradeProps {
  upgrade: UpgradedPrompt | null
  onCopy: (text: string) => void
}

export function PromptUpgrade({ upgrade, onCopy }: PromptUpgradeProps) {
  const [copied, setCopied] = useState(false)

  if (!upgrade) {
    return (
      <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="text-center py-8 text-gray-500">
          No upgrade data available
        </div>
      </div>
    )
  }

  const handleCopy = () => {
    onCopy(upgrade.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-md font-medium">Upgraded Prompt</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <ClipboardCopy className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md text-sm whitespace-pre-wrap">
          {upgrade.text}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Improvements
          </h3>
          <ul className="space-y-1">
            {upgrade.improvements.map((improvement, i) => (
              <li key={i} className="text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-2 rounded-md">
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

