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
      {
        type: BlockType.DRAG_AND_DROP,
        content: {
          prompt: "Sort these numbers into **Even** and **Odd** zones. Drag each number to the correct bucket.",
          zones: [
            { id: "even", label: "Even Numbers" },
            { id: "odd", label: "Odd Numbers" },
          ],
          draggables: [
            { id: "n2", label: "2", correctZone: "even" },
            { id: "n3", label: "3", correctZone: "odd" },
            { id: "n4", label: "4", correctZone: "even" },
            { id: "n5", label: "5", correctZone: "odd" },
            { id: "n6", label: "6", correctZone: "even" },
            { id: "n7", label: "7", correctZone: "odd" },
          ],
        },
        solution: {
          zones: {
            even: ["n2", "n4", "n6"],
            odd: ["n3", "n5", "n7"],
          },
        },
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

  // More courses
  const otherCourses = [
    {
      title: "Thinking in Code",
      slug: "thinking-in-code",
      domain: "Computer Science",
      difficulty: 1,
      lessons: [
        { title: "What is Code?", minutes: 8, blocks: [
          { type: BlockType.TEXT_EXPLANATION, content: { prompt: "Code is a set of instructions that tell a computer what to do. Just like a recipe tells a chef how to bake a cake, code tells a computer how to solve problems.\n\nLet's start with the most important idea: **sequence** — doing things in order." } },
          { type: BlockType.MULTIPLE_CHOICE, content: { prompt: "What do we call a set of instructions for a computer?", options: ["A recipe", "Code", "A message", "A drawing"] }, solution: { correctIndex: 1 } },
          { type: BlockType.TEXT_EXPLANATION, content: { prompt: "Great! Now let's think about **decomposition** — breaking a big problem into smaller steps." } },
        ]},
        { title: "Sequences", minutes: 10, blocks: [
          { type: BlockType.TEXT_EXPLANATION, content: { prompt: "A sequence is a list of steps that happen one after another. Computers follow sequences exactly as written.\n\nIf you wrote:\n1. Open jar\n2. Eat cookie\n\nThe computer would do exactly that — in order!" } },
          { type: BlockType.MULTIPLE_CHOICE, content: { prompt: "What happens if you swap the two steps above?", options: ["Same result", "You'd eat a closed jar", "You'd eat a cookie then open the jar", "Nothing changes"] }, solution: { correctIndex: 2 } },
        ]},
        { title: "Patterns", minutes: 10, blocks: [
          { type: BlockType.TEXT_EXPLANATION, content: { prompt: "Computers are great at spotting and repeating **patterns**. A loop is a way to repeat an action multiple times without writing it over and over." } },
          { type: BlockType.MULTIPLE_CHOICE, content: { prompt: "What programming concept lets you repeat an action?", options: ["A variable", "A loop", "A function", "A comment"] }, solution: { correctIndex: 1 } },
          { type: BlockType.FILL_IN_BLANK, content: { prompt: "If you say 'Hello' 3 times using a loop, how many times do you write 'print hello'?", }, solution: { answer: 1, tolerance: 0 } },
        ]},
      ],
    },
    {
      title: "Scientific Thinking",
      slug: "scientific-thinking",
      domain: "Science",
      difficulty: 1,
      lessons: [
        { title: "Observing the World", minutes: 8, blocks: [
          { type: BlockType.TEXT_EXPLANATION, content: { prompt: "Science starts with **observation**. Look around and notice what happens. Why does ice melt? Why do plants grow toward the sun?\n\nEvery scientific discovery begins with a question." } },
          { type: BlockType.MULTIPLE_CHOICE, content: { prompt: "What does science begin with?", options: ["An answer", "A question", "A formula", "A computer"] }, solution: { correctIndex: 1 } },
        ]},
        { title: "Hypotheses", minutes: 10, blocks: [
          { type: BlockType.TEXT_EXPLANATION, content: { prompt: "A **hypothesis** is an educated guess about how something works. You then test it with an experiment.\n\nExample: 'If plants get more sunlight, they will grow taller.'" } },
          { type: BlockType.MULTIPLE_CHOICE, content: { prompt: "What do you call an educated guess in science?", options: ["A fact", "A hypothesis", "A conclusion", "A law"] }, solution: { correctIndex: 1 } },
        ]},
      ],
    },
    {
      title: "Probability & Chance",
      slug: "probability-and-chance",
      domain: "Math",
      difficulty: 2,
      lessons: [
        { title: "What is Probability?", minutes: 8, blocks: [
          { type: BlockType.TEXT_EXPLANATION, content: { prompt: "**Probability** tells us how likely something is to happen. It's a number from 0 (impossible) to 1 (certain).\n\nA fair coin has a probability of 0.5 (or 50%) of landing on heads." } },
          { type: BlockType.MULTIPLE_CHOICE, content: { prompt: "What is the probability of a fair coin landing on heads?", options: ["0", "0.25", "0.5", "1"] }, solution: { correctIndex: 2 } },
        ]},
        { title: "Calculating Chances", minutes: 10, blocks: [
          { type: BlockType.TEXT_EXPLANATION, content: { prompt: "To calculate probability: count the **favorable outcomes** and divide by the **total possible outcomes**.\n\n$$\\text{Probability} = \\frac{\\text{favorable}}{\\text{total}}$$\n\nIf you roll a 6-sided die, the chance of rolling a 4 is 1/6." } },
          { type: BlockType.MULTIPLE_CHOICE, content: { prompt: "What's the probability of rolling an even number on a 6-sided die?", options: ["1/6", "1/3", "1/2", "2/3"] }, solution: { correctIndex: 2 } },
          { type: BlockType.FILL_IN_BLANK, content: { prompt: "What's the probability of rolling a 1 on a 6-sided die? (Enter as a fraction like 1/2 or a decimal)", }, solution: { answer: "1/6", tolerance: 0 } },
        ]},
      ],
    },
  ]

  for (const c of otherCourses) {
    const course = await prisma.course.create({
      data: { title: c.title, slug: c.slug, domain: c.domain, difficulty: c.difficulty },
    })
    for (let i = 0; i < c.lessons.length; i++) {
      const l = c.lessons[i]
      const lesson = await prisma.lesson.create({
        data: { courseId: course.id, order: i + 1, title: l.title, estimatedMinutes: l.minutes },
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
          },
        })
      }
    }
  }

  const total = 1 + otherCourses.length
  const totalLessons = lessons.length + otherCourses.reduce((s, c) => s + c.lessons.length, 0)
  console.log(`Seeded ${total} courses, ${totalLessons} lessons.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
