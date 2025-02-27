import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles } from "lucide-react"
import type { UpgradedPrompt } from "@/lib/prompt-analyzer"

interface UpgradedPromptViewProps {
  upgrade: UpgradedPrompt | null
}

export function UpgradedPromptView({ upgrade }: UpgradedPromptViewProps) {
  if (!upgrade) return null

  return (
    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-pastel-yellow" />
        <h3 className="text-lg font-semibold">Upgraded Prompt</h3>
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="space-y-6">
          <section>
            <h4 className="font-medium mb-2">[System]</h4>
            <p className="text-sm">{upgrade.system}</p>
          </section>

          <section>
            <h4 className="font-medium mb-2">[Persona]</h4>
            <p className="text-sm">{upgrade.persona}</p>
          </section>

          <section>
            <h4 className="font-medium mb-2">[Input]</h4>
            <p className="text-sm">{upgrade.input}</p>
          </section>

          {upgrade.tasks.map((task, index) => (
            <section key={index}>
              <h4 className="font-medium mb-2">
                [Task {index + 1}: {task.title}]
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {task.instructions.map((instruction, i) => (
                  <li key={i} className="text-sm">
                    {instruction}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section>
            <h4 className="font-medium mb-2">[Output Format]</h4>
            <p className="text-sm">{upgrade.outputFormat}</p>
          </section>

          <section>
            <h4 className="font-medium mb-2">[Quality Assurance]</h4>
            <ul className="list-disc list-inside space-y-1">
              {upgrade.qualityAssurance.map((item, index) => (
                <li key={index} className="text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="font-medium mb-2">[Reflection]</h4>
            <ul className="list-disc list-inside space-y-1">
              {upgrade.reflection.map((item, index) => (
                <li key={index} className="text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="font-medium mb-2">[Feedback]</h4>
            <ul className="list-disc list-inside space-y-1">
              {upgrade.feedback.map((item, index) => (
                <li key={index} className="text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="font-medium mb-2">[Constraints]</h4>
            <ul className="list-disc list-inside space-y-1">
              {upgrade.constraints.map((item, index) => (
                <li key={index} className="text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="font-medium mb-2">[Context]</h4>
            <p className="text-sm">{upgrade.context}</p>
          </section>
        </div>
      </ScrollArea>
    </Card>
  )
}

