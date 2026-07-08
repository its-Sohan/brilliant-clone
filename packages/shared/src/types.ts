export type BlockType =
  | "TEXT_EXPLANATION"
  | "MULTIPLE_CHOICE"
  | "FILL_IN_BLANK"
  | "DRAG_AND_DROP"
  | "GRAPH_BUILDER"
  | "CODE_CHALLENGE"
  | "SIMULATION"

export interface CourseData {
  id: string
  title: string
  slug: string
  domain: string
  difficulty: number
  lessonCount?: number
}

export interface LessonData {
  id: string
  courseId: string
  order: number
  title: string
  estimatedMinutes: number
  conceptTags: string[]
  blockCount?: number
}

export interface ContentBlockData {
  id: string
  lessonId: string
  order: number
  blockType: BlockType
  content: Record<string, unknown>
  solution?: unknown
  hints?: unknown
  difficulty: number
  conceptTags: string[]
}

export interface BlockResult {
  isCorrect: boolean
  answer?: unknown
}

export interface SkillData {
  conceptTag: string
  pKnown: number
  mastered: boolean
  numAttempts: number
  numCorrect: number
}

export interface ReviewData {
  conceptTag: string
  easeFactor: number
  interval: number
  nextReview: string
}

export interface ProgressData {
  lessonId: string
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"
  score?: number
  completedAt?: string
}
