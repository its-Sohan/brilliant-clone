export interface BlockData {
  id: string
  lessonId: string
  order: number
  blockType: string
  content: {
    prompt: string
    options?: string[]
  }
  solution?: unknown
  hints?: unknown
}

export interface BlockResult {
  isCorrect: boolean
  answer?: unknown
}

export interface BlockProps {
  block: BlockData
  onComplete: (result: BlockResult) => void
}

export interface BlockRenderer {
  type: string
  component: React.ComponentType<BlockProps>
}
