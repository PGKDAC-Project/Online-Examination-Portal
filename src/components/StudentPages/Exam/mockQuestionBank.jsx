// src/mock/mockQuestionBank.js

export const mockQuestionBank = [
  {
    id: 1,
    question: "What is the time complexity of binary search?",
    type: "single", // single choice
    options: [
      "O(n)",
      "O(log n)",
      "O(n log n)",
      "O(1)"
    ],
    correctAnswer: "O(log n)",
    marks: 2
  },
  {
    id: 2,
    question: "Which of the following data structures are linear?",
    type: "multiple", // multiple choice
    options: [
      "Array",
      "Linked List",
      "Tree",
      "Graph"
    ],
    correctAnswer: ["Array", "Linked List"],
    marks: 3
  },
  {
    id: 3,
    question: "Stack follows which principle?",
    type: "single",
    options: [
      "FIFO",
      "LIFO",
      "Priority-based",
      "Random access"
    ],
    correctAnswer: "LIFO",
    marks: 2
  },
  {
    id: 4,
    question: "In a max heap, the root node contains the maximum element.",
    type: "truefalse",
    options: ["True", "False"],
    correctAnswer: "True",
    marks: 1
  },
  {
    id: 5,
    question: "Which traversal of a Binary Search Tree gives sorted order?",
    type: "single",
    options: [
      "Preorder",
      "Postorder",
      "Inorder",
      "Level order"
    ],
    correctAnswer: "Inorder",
    marks: 2
  },
  {
    id: 6,
    question: "Which of the following sorting algorithms are stable?",
    type: "multiple",
    options: [
      "Merge Sort",
      "Quick Sort",
      "Bubble Sort",
      "Selection Sort"
    ],
    correctAnswer: ["Merge Sort", "Bubble Sort"],
    marks: 3
  },
  {
    id: 7,
    question: "What is the worst-case time complexity of Quick Sort?",
    type: "single",
    options: [
      "O(n log n)",
      "O(log n)",
      "O(n²)",
      "O(n)"
    ],
    correctAnswer: "O(n²)",
    marks: 2
  },
  {
    id: 8,
    question: "Which data structure is used for BFS traversal?",
    type: "single",
    options: [
      "Stack",
      "Queue",
      "Heap",
      "Tree"
    ],
    correctAnswer: "Queue",
    marks: 2
  },
  {
    id: 9,
    question: "A graph with no cycles is called a DAG.",
    type: "truefalse",
    options: ["True", "False"],
    correctAnswer: "True",
    marks: 1
  },
  {
    id: 10,
    question: "Which of the following are applications of stack?",
    type: "multiple",
    options: [
      "Expression evaluation",
      "Function calls",
      "Level order traversal",
      "Undo/Redo operations"
    ],
    correctAnswer: [
      "Expression evaluation",
      "Function calls",
      "Undo/Redo operations"
    ],
    marks: 3
  }
];
