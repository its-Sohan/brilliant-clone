const BASE = "/api"

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  courses: {
    list: () => fetchJSON("/courses"),
    get: (slug: string) => fetchJSON(`/courses/${slug}`),
  },
  lessons: {
    get: (id: string) => fetchJSON(`/lessons/${id}`),
  },
  progress: {
    complete: (lessonId: string) =>
      fetchJSON("/progress/complete", { method: "POST", body: JSON.stringify({ lessonId }) }),
    response: (blockId: string, isCorrect: boolean, input?: unknown) =>
      fetchJSON("/progress/response", { method: "POST", body: JSON.stringify({ blockId, isCorrect, input }) }),
    skill: () => fetchJSON("/progress/skill"),
    review: () => fetchJSON("/progress/review"),
    recommend: () => fetchJSON("/progress/recommend"),
    streak: () => fetchJSON("/progress/streak"),
  },
}
