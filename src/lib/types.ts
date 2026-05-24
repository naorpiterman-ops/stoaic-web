export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface Conversation {
  id: string
  messages: Message[]
  summary?: string
  themes?: string[]
  startedAt: number
  endedAt?: number
}

export interface UserProfile {
  name: string
  focusAreas: string[]
  recurringThemes: string[]
  currentChallenges: string[]
  createdAt: number
}

export interface Exercise {
  id: string
  type: 'view_from_above' | 'morning_prep' | 'evening_review' | 'free_writing'
  completedAt: number
  userInput?: string
  claudeAnalysis?: string
}

export interface StoicQuote {
  id: string
  author: string
  source: string
  book?: number
  chapter?: number
  hebrewText: string
  englishText: string
  tags: string[]
  mood: string[]
  themes: string[]
  depth: string
}
