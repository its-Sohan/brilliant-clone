"use client"

import { useState, useCallback } from "react"
import Editor from "@monaco-editor/react"
import { Play, RotateCcw, CheckCircle2, XCircle } from "lucide-react"
import type { BlockProps, BlockRenderer } from "./types"

interface CodeContent {
  prompt: string
  starterCode: string
  language: string
}

interface CodeSolution {
  expectedOutput: string
}

function runUserCode(code: string): { output: string; error: string | null } {
  const logs: string[] = []

  const mockConsole = {
    log: (...args: unknown[]) => {
      logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "))
    },
  }

  try {
    const fn = new Function("console", code)
    fn(mockConsole)
    return { output: logs.join("\n"), error: null }
  } catch (e) {
    return { output: logs.join("\n"), error: e instanceof Error ? e.message : String(e) }
  }
}

export const codeChallenge: BlockRenderer = {
  type: "CODE_CHALLENGE",
  component: CodeChallengeBlock,
}

export function CodeChallengeBlock({ block, onComplete }: BlockProps) {
  const content = block.content as CodeContent
  const solution = block.solution as CodeSolution | null

  const [code, setCode] = useState(content.starterCode)
  const [output, setOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleRun = useCallback(() => {
    const result = runUserCode(code)
    setOutput(result.output)
    setError(result.error)
  }, [code])

  const handleSubmit = useCallback(() => {
    const result = runUserCode(code)
    setOutput(result.output)
    setError(result.error)

    if (result.error) {
      setIsCorrect(false)
      setSubmitted(true)
      return
    }

    const correct = solution ? result.output.trim() === solution.expectedOutput.trim() : true
    setIsCorrect(correct)
    setSubmitted(true)
  }, [code, solution])

  const reset = useCallback(() => {
    setCode(content.starterCode)
    setOutput(null)
    setError(null)
    setSubmitted(false)
    setIsCorrect(false)
  }, [content.starterCode])

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-xl border p-6 text-center space-y-4">
          {isCorrect ? (
            <div className="space-y-2">
              <CheckCircle2 className="mx-auto size-10 text-green-500" />
              <p className="font-semibold text-green-600 dark:text-green-400">All tests passed!</p>
            </div>
          ) : (
            <div className="space-y-2">
              <XCircle className="mx-auto size-10 text-destructive" />
              <p className="font-semibold text-destructive">Output didn't match</p>
              {solution && (
                <div className="text-left max-w-sm mx-auto space-y-2 text-sm">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Your output:</p>
                    <pre className="rounded-lg bg-muted p-2 text-xs font-mono whitespace-pre-wrap">{output || "(empty)"}</pre>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Expected:</p>
                    <pre className="rounded-lg bg-muted p-2 text-xs font-mono whitespace-pre-wrap">{solution.expectedOutput}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => onComplete({ isCorrect })}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <p className="text-base leading-relaxed">{content.prompt}</p>

      <div className="rounded-xl border overflow-hidden">
        <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b">
          <span className="text-xs font-medium text-muted-foreground uppercase">{content.language}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>
        <Editor
          height="200px"
          language={content.language}
          value={code}
          onChange={(val) => setCode(val ?? "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "off",
            padding: { top: 12 },
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleRun}
          className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted transition-colors"
        >
          <Play size={14} />
          Run
        </button>
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          <CheckCircle2 size={14} />
          Submit
        </button>
      </div>

      {(output !== null || error) && (
        <div className="rounded-xl border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Output</p>
          {error ? (
            <pre className="text-sm font-mono text-destructive whitespace-pre-wrap">{error}</pre>
          ) : (
            <pre className="text-sm font-mono whitespace-pre-wrap">{output}</pre>
          )}
        </div>
      )}
    </div>
  )
}
