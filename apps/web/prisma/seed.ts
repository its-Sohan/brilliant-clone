import { PrismaClient, BlockType } from "@prisma/client"

const prisma = new PrismaClient()

const lessons = [
  {
    title: "Numbers & Counting",
    minutes: 10,
    blocks: [
      {
        type: BlockType.TEXT_EXPLANATION,
        content: { prompt: "Numbers help us count and measure things. The numbers 0 through 9 are called **digits**. When we combine digits, we get larger numbers like 10, 42, or 100.\n\nLet's start simple. How many fingers do you have on one hand?" },
      },
      {
        type: BlockType.MULTIPLE_CHOICE,
        content: { prompt: "How many fingers are on one hand?", options: ["3", "4", "5", "10"] },
        solution: { correctIndex: 2 },
        hints: { items: ["Count your fingers on one hand.", "Thumb, index, middle, ring, pinky."] },
      },
      {
        type: BlockType.TEXT_EXPLANATION,
        content: { prompt: "That's right! 5 fingers on one hand, and 10 on both hands.\n\nNow let's think about **odd and even** numbers. Even numbers can be split into two equal groups. Odd numbers have one left over." },
      },
      {
        type: BlockType.MULTIPLE_CHOICE,
        content: { prompt: "Which of these is an **even** number?", options: ["3", "7", "8", "9"] },
        solution: { correctIndex: 2 },
        hints: { items: ["Even numbers end in 0, 2, 4, 6, or 8.", "Try splitting each number into two equal groups."] },
      },
      {
        type: BlockType.MULTIPLE_CHOICE,
        content: { prompt: "Which number comes after 9?", options: ["8", "10", "11", "19"] },
        solution: { correctIndex: 1 },
        hints: { items: ["When we reach 9, the next number uses a new digit.", "9 + 1 = ?"] },
      },
      {
        type: BlockType.FILL_IN_BLANK,
        content: { prompt: "How many fingers are on **two** hands?" },
        solution: { answer: 10, tolerance: 0 },
      },
    ],
  },
  {
    title: "Addition & Subtraction",
    minutes: 12,
    blocks: [
      {
        type: BlockType.TEXT_EXPLANATION,
        content: { prompt: "**Addition** means putting things together. If you have 2 apples and get 3 more, you have 5 apples total. The + symbol means addition.\n\n$$2 + 3 = 5$$\n\nLet's try one!" },
      },
      {
        type: BlockType.MULTIPLE_CHOICE,
        content: { prompt: "What is **4 + 3**?", options: ["5", "6", "7", "8"] },
        solution: { correctIndex: 2 },
        hints: { items: ["Start at 4 and count up 3 steps.", "4 → 5 → 6 → 7"] },
      },
      {
        type: BlockType.TEXT_EXPLANATION,
        content: { prompt: "Great! **Subtraction** means taking away. If you have 7 cookies and eat 2, you have 5 left. The − symbol means subtraction.\n\n$$7 - 2 = 5$$\n\nThink of subtraction as 'how many are left?'" },
      },
      {
        type: BlockType.MULTIPLE_CHOICE,
        content: { prompt: "What is **9 - 4**?", options: ["3", "4", "5", "6"] },
        solution: { correctIndex: 2 },
        hints: { items: ["Start at 9 and count down 4 steps.", "9 → 8 → 7 → 6 → 5"] },
      },
      {
        type: BlockType.MULTIPLE_CHOICE,
        content: { prompt: "What is **6 + 2 - 3**?", options: ["3", "4", "5", "6"] },
        solution: { correctIndex: 2 },
        hints: { items: ["First add: 6 + 2 = ?", "Then subtract 3 from the result."] },
      },
      {
        type: BlockType.FILL_IN_BLANK,
        content: { prompt: "What is **100 - 50**? Type the number." },
        solution: { answer: 50, tolerance: 0 },
      },
    ],
  },
  {
    title: "Multiplication Basics",
    minutes: 15,
    blocks: [
      {
        type: BlockType.TEXT_EXPLANATION,
        content: { prompt: "**Multiplication** is a shortcut for repeated addition. Instead of adding 3 + 3 + 3 + 3, we can write 4 × 3 (four groups of three).\n\n$$4 \\times 3 = 3 + 3 + 3 + 3 = 12$$\n\nThe × symbol means multiplication." },
      },
      {
        type: BlockType.MULTIPLE_CHOICE,
        content: { prompt: "What is **2 × 4**? (Two groups of four)", options: ["4", "6", "8", "10"] },
        solution: { correctIndex: 2 },
        hints: { items: ["Think: 4 + 4 = ?", "Two groups of four items each."] },
      },
      {
        type: BlockType.TEXT_EXPLANATION,
        content: { prompt: "Nice! Here's a handy rule: **anything times 1 is itself**. So 7 × 1 = 7.\n\nAnd **anything times 0 is 0**. So 100 × 0 = 0.\n\nNow let's practice with a few more." },
      },
      {
        type: BlockType.MULTIPLE_CHOICE,
        content: { prompt: "What is **3 × 5**?", options: ["8", "10", "12", "15"] },
        solution: { correctIndex: 3 },
        hints: { items: ["Add 5 three times: 5 + 5 + 5", "Count by fives: 5, 10, 15"] },
      },
      {
        type: BlockType.MULTIPLE_CHOICE,
        content: { prompt: "What is **4 × 0**?", options: ["0", "1", "4", "40"] },
        solution: { correctIndex: 0 },
        hints: { items: ["Any number times 0 equals...", "How many items are in zero groups of four?"] },
      },
      {
        type: BlockType.FILL_IN_BLANK,
        content: { prompt: "What is **6 × 7**? Type the number." },
        solution: { answer: 42, tolerance: 0 },
      },
    ],
  },
]

async function main() {
  const existing = await prisma.course.findFirst()
  if (existing) {
    console.log("Database already seeded, skipping.")
    return
  }

  const course = await prisma.course.create({
    data: {
      title: "Foundations of Math",
      slug: "foundations-of-math",
      domain: "Math",
      difficulty: 1,
    },
  })

  for (let i = 0; i < lessons.length; i++) {
    const l = lessons[i]
    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        order: i + 1,
        title: l.title,
        estimatedMinutes: l.minutes,
      },
    })

    for (let j = 0; j < l.blocks.length; j++) {
      const b = l.blocks[j]
      await prisma.contentBlock.create({
        data: {
          lessonId: lesson.id,
          order: j + 1,
          blockType: b.type,
          content: b.content,
          ...(b.solution ? { solution: b.solution } : {}),
          ...(b.hints ? { hints: b.hints } : {}),
        },
      })
    }
  }

  console.log(`Seeded 1 course, ${lessons.length} lessons, ${lessons.reduce((s, l) => s + l.blocks.length, 0)} content blocks.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
