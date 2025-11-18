/**
 * Course Configuration - Centralized course data
 * Contains course metadata, icons, and example queries
 */

export const courses = [
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: <img src='/nodeicon.svg' className="w-6 h-6" alt="Node.js" />,
    description: 'Server-side JavaScript runtime',
    examples: [
      "What is Express.js middleware and how does it work?",
      "How do I handle async operations in Node.js?",
      "Explain the event loop in Node.js with examples"
    ]
  },
  {
    id: 'python',
    name: 'Python',
    icon: <img src='/pythonicon.svg' className="w-6 h-6" alt="Python" />,
    description: 'Versatile programming language',
    examples: [
      "What are Python decorators and when should I use them?",
      "How do list comprehensions work in Python?",
      "Explain Python's GIL and its impact on threading"
    ]
  },
];
