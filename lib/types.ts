// 프롬프트 분석 타입
export interface PromptAnalysis {
  clarityScore?: number;
  specificityScore?: number;
  contextScore?: number;
  clarityFeedback?: string;
  specificityFeedback?: string;
  contextFeedback?: string;
  detailedFeedback?: string;
  strengths?: string[];
  weaknesses?: string[];
  optimizationSuggestions?: string[];
  recommendations?: string[];
}

// 업그레이드된 프롬프트 타입
export interface UpgradedPrompt {
  text: string;
  improvements: string[];
}

// 프롬프트 테스트 타입
export interface PromptTest {
  id: string;
  scenario: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
}

// 시스템 컨텍스트 타입
export type SystemContext = "Assistant" | "Expert" | "Teacher" | "Analyst" | "Creative";

// 출력 형식 타입
export type OutputFormat = "Step by Step" | "Bullet Points" | "Detailed Analysis" | "Code" | "Conversation";

// 에이전트 행동 타입
export type AgenticBehavior = "Proactive" | "Reactive" | "Collaborative" | "Analytical" | "Creative";

// 사고 스타일 타입
export type ThinkingStyle = "Chain of Thought" | "Tree of Thoughts" | "Direct Answer" | "Socratic" | "Structured";

// 프롬프트 템플릿 타입
export interface PromptTemplate {
  systemContext: SystemContext;
  outputFormat: OutputFormat;
  agenticBehavior: AgenticBehavior;
  thinkingStyle: ThinkingStyle;
  input: string;
  constraints: string;
  examples: string;
  purpose?: string;
}

// 탭 타입
export type TabType = "editor" | "analysis" | "upgrade" | "gemini" | "testing"; 