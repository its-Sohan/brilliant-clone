import { PrismaClient, BlockType } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Check if we already have data
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
      imageUrl: null,
    },
  })

  const lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        courseId: course.id,
        order: 1,
        title: "Numbers & Counting",
        estimatedMinutes: 10,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        order: 2,
        title: "Addition & Subtraction",
        estimatedMinutes: 12,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: course.id,
        order: 3,
        title: "Multiplication Basics",
        estimatedMinutes: 15,
      },
    }),
  ])

  // Lesson 1 blocks: Numbers & Counting
  await Promise.all([
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[0].id,
        order: 1,
        blockType: BlockType.TEXT_EXPLANATION,
        content: {
          prompt: "Numbers help us count and measure things. The numbers 0 through 9 are called **digits**. When we combine digits, we get larger numbers like 10, 42, or 100.\n\nLet's start simple. How many fingers do you have on one hand?",
        },
      },
    }),
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[0].id,
        order: 2,
        blockType: BlockType.MULTIPLE_CHOICE,
        content: {
          prompt: "How many fingers are on one hand?",
          options: ["3", "4", "5", "10"],
        },
        hints: { items: ["Count your fingers on one hand.", "Thumb, index, middle, ring, pinky."] },
      },
    }),
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[0].id,
        order: 3,
        blockType: BlockType.TEXT_EXPLANATION,
        content: {
          prompt: "That's right! 5 fingers on one hand, and 10 on both hands.\n\nNow let's think about **odd and even** numbers. Even numbers can be split into two equal groups. Odd numbers have one left over.",
        },
      },
    }),
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[0].id,
        order: 4,
        blockType: BlockType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which of these is an **even** number?",
          options: ["3", "7", "8", "9"],
        },
        hints: { items: ["Even numbers end in 0, 2, 4, 6, or 8.", "Try splitting each number into two equal groups."] },
      },
    }),
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[0].id,
        order: 5,
        blockType: BlockType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which number comes after 9?",
          options: ["8", "10", "11", "19"],
        },
        hints: { items: ["When we reach 9, the next number uses a new digit.", "9 + 1 = ?"] },
      },
    }),
  ])

  // Lesson 2 blocks: Addition & Subtraction
  await Promise.all([
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[1].id,
        order: 1,
        blockType: BlockType.TEXT_EXPLANATION,
        content: {
          prompt: "**Addition** means putting things together. If you have 2 apples and get 3 more, you have 5 apples total. The + symbol means addition.\n\n$$2 + 3 = 5$$\n\nLet's try one!",
        },
      },
    }),
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[1].id,
        order: 2,
        blockType: BlockType.MULTIPLE_CHOICE,
        content: {
          prompt: "What is **4 + 3**?",
          options: ["5", "6", "7", "8"],
        },
        hints: { items: ["Start at 4 and count up 3 steps.", "4 → 5 → 6 → 7"] },
      },
    }),
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[1].id,
        order: 3,
        blockType: BlockType.TEXT_EXPLANATION,
        content: {
          prompt: "Great! **Subtraction** means taking away. If you have 7 cookies and eat 2, you have 5 left. The − symbol means subtraction.\n\n$$7 - 2 = 5$$\n\nThink of subtraction as 'how many are left?'",
        },
      },
    }),
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[1].id,
        order: 4,
        blockType: BlockType.MULTIPLE_CHOICE,
        content: {
          prompt: "What is **9 - 4**?",
          options: ["3", "4", "5", "6"],
        },
        hints: { items: ["Start at 9 and count down 4 steps.", "9 → 8 → 7 → 6 → 5"] },
      },
    }),
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[1].id,
        order: 5,
        blockType: BlockType.MULTIPLE_CHOICE,
        content: {
          prompt: "What is **6 + 2 - 3**?",
          options: ["3", "4", "5", "6"],
        },
        hints: { items: ["First add: 6 + 2 = ?", "Then subtract 3 from the result."] },
      },
    }),
  ])

  // Lesson 3 blocks: Multiplication Basics
  await Promise.all([
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[2].id,
        order: 1,
        blockType: BlockType.TEXT_EXPLANATION,
        content: {
          prompt: "**Multiplication** is a shortcut for repeated addition. Instead of adding 3 + 3 + 3 + 3, we can write 4 × 3 (four groups of three).\n\n$$4 \\times 3 = 3 + 3 + 3 + 3 = 12$$\n\nThe × symbol means multiplication.",
        },
      },
    }),
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[2].id,
        order: 2,
        blockType: BlockType.MULTIPLE_CHOICE,
        content: {
          prompt: "What is **2 × 4**? (Two groups of four)",
          options: ["4", "6", "8", "10"],
        },
        hints: { items: ["Think: 4 + 4 = ?", "Two groups of four items each."] },
      },
    }),
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[2].id,
        order: 3,
        blockType: BlockType.TEXT_EXPLANATION,
        content: {
          prompt: "Nice! Here's a handy rule: **anything times 1 is itself**. So 7 × 1 = 7.\n\nAnd **anything times 0 is 0**. So 100 × 0 = 0.\n\nNow let's practice with a few more.",
        },
      },
    }),
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[2].id,
        order: 4,
        blockType: BlockType.MULTIPLE_CHOICE,
        content: {
          prompt: "What is **3 × 5**?",
          options: ["8", "10", "12", "15"],
        },
        hints: { items: ["Add 5 three times: 5 + 5 + 5", "Count by fives: 5, 10, 15"] },
      },
    }),
    prisma.contentBlock.create({
      data: {
        lessonId: lessons[2].id,
        order: 5,
        blockType: BlockType.MULTIPLE_CHOICE,
        content: {
          prompt: "What is **4 × 0**?",
          options: ["0", "1", "4", "40"],
        },
        hints: { items: ["Any number times 0 equals...", "How many items are in zero groups of four?"] },
      },
    }),
  ])

  console.log("Seeded 1 course, 3 lessons, 15 content blocks.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
