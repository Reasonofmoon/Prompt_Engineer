"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Beaker, Play, Check, X } from "lucide-react"

// 타입 정의
interface PromptTest {
  id: string
  scenario: string
  input: string
  expectedOutput: string
  actualOutput?: string
  passed?: boolean
}

interface PromptTestingProps {
  tests: PromptTest[]
}

export function PromptTesting({ tests = [] }: PromptTestingProps) {
  const [newTest, setNewTest] = useState({
    scenario: "",
    input: "",
    expectedOutput: ""
  })
  const [localTests, setLocalTests] = useState<PromptTest[]>(tests)
  const [isRunning, setIsRunning] = useState(false)

  const handleAddTest = () => {
    if (!newTest.scenario || !newTest.input) return
    
    const test: PromptTest = {
      id: Date.now().toString(),
      scenario: newTest.scenario,
      input: newTest.input,
      expectedOutput: newTest.expectedOutput
    }
    
    setLocalTests([...localTests, test])
    setNewTest({
      scenario: "",
      input: "",
      expectedOutput: ""
    })
  }

  const handleRunTests = () => {
    setIsRunning(true)
    
    // 모의 테스트 실행 (실제로는 API 호출)
    setTimeout(() => {
      const updatedTests = localTests.map(test => ({
        ...test,
        actualOutput: "This is a simulated response for testing purposes.",
        passed: Math.random() > 0.3 // 70% 확률로 통과
      }))
      
      setLocalTests(updatedTests)
      setIsRunning(false)
    }, 2000)
  }

  return (
    <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Prompt Testing</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRunTests}
            disabled={isRunning || localTests.length === 0}
          >
            {isRunning ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Tests
              </>
            )}
          </Button>
        </div>
        
        {/* 테스트 목록 */}
        {localTests.length > 0 ? (
          <div className="space-y-4">
            {localTests.map((test) => (
              <div key={test.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{test.scenario}</h4>
                  {test.passed !== undefined && (
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      test.passed 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {test.passed ? (
                        <div className="flex items-center">
                          <Check className="w-3 h-3 mr-1" />
                          Passed
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <X className="w-3 h-3 mr-1" />
                          Failed
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium mb-1">Input:</div>
                    <div className="text-sm p-2 bg-gray-50 dark:bg-gray-900/50 rounded">{test.input}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1">Expected Output:</div>
                    <div className="text-sm p-2 bg-gray-50 dark:bg-gray-900/50 rounded">{test.expectedOutput}</div>
                  </div>
                </div>
                {test.actualOutput && (
                  <div className="mt-3">
                    <div className="text-xs font-medium mb-1">Actual Output:</div>
                    <div className="text-sm p-2 bg-gray-50 dark:bg-gray-900/50 rounded">{test.actualOutput}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No tests created yet. Add a test case below.
          </div>
        )}
        
        {/* 새 테스트 추가 폼 */}
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <Beaker className="w-4 h-4 mr-2" />
            Add New Test Case
          </h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="test-scenario">Scenario</Label>
              <Input
                id="test-scenario"
                value={newTest.scenario}
                onChange={(e) => setNewTest({...newTest, scenario: e.target.value})}
                placeholder="Test scenario description"
              />
            </div>
            <div>
              <Label htmlFor="test-input">Input</Label>
              <Textarea
                id="test-input"
                value={newTest.input}
                onChange={(e) => setNewTest({...newTest, input: e.target.value})}
                placeholder="Test input data"
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="test-expected">Expected Output</Label>
              <Textarea
                id="test-expected"
                value={newTest.expectedOutput}
                onChange={(e) => setNewTest({...newTest, expectedOutput: e.target.value})}
                placeholder="Expected response (optional)"
                className="min-h-[80px]"
              />
            </div>
            <Button 
              onClick={handleAddTest}
              disabled={!newTest.scenario || !newTest.input}
              className="w-full"
            >
              Add Test Case
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
