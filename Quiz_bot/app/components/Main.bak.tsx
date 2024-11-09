// Import necessary libraries
"use client";
import { useState, useEffect } from "react";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import pdfjs from "pdfjs-dist";
import pptxgen from "pptxgenjs";

// Initialize OpenAI model, memory, and conversation chain
const model = new OpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  temperature: 0.9,
});

const memory = new BufferMemory();
const chain = new ConversationChain({
  llm: model,
  memory: memory,
});

// Function to call the OpenAI model
const run = async (input: string) => {
  const response = await chain.call({ input: input });
  return response.response;
};

// Define question categories
const categories = [
  {
    label: "Open Ended",
    value: "is open-ended, which the user can answer in simple words",
  },
  {
    label: "True or False",
    value: "can be answered by either true or false",
  },
  {
    label: "Multiple Choice",
    value:
      "has multiple choice options (A, B, C, D) and the user selects one option",
  },
];

// Main component
const Main = () => {
  // State variables
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [originalQuestion, setOriginalQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [generateQuestion, setGenerateQuestion] = useState(false);
  const [generatingQuestion, setGeneratingQuestion] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [validatingAnswer, setValidatingAnswer] = useState(false);
  const [apiSelection, setApiSelection] = useState(""); // Added state for API selection

  // Function to ask the first question
  const askFirstQuestion = async () => {
    setGeneratingQuestion(true);
    let question = "";

    if (apiSelection === "local") {
      try {
        if (category === "Open Ended") {
          const pdfUrl = "/data/questions/open_ended_example.pdf";
          const pdfData = await fetch(pdfUrl).then((response) =>
            response.arrayBuffer()
          );
          const pdfText = await readPdf(pdfData);
          question = pdfText;
        } else if (category === "True or False") {
          const pptxUrl = "/data/questions/true_false_example.pptx";
          const pptxData = await fetch(pptxUrl).then((response) =>
            response.arrayBuffer()
          );
          const pptxText = await readPptx(pptxData);
          question = pptxText;
        }
      } catch (error) {
        console.error('Error fetching question from local data:', error);
      }
    } else {
      question = await run(`Ask a trivia question that ${category}. The question should be within Networking domain scope`);
    }

    setOriginalQuestion(question);
    setGeneratingQuestion(false);
    setShowAnswer(false);
  };

  // Function to read PDF content
  const readPdf = async (pdfData: ArrayBuffer) => {
    const loadingTask = pdfjs.getDocument(new Uint8Array(pdfData));
    const pdf = await loadingTask.promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((s) => s.str).join(" ");
    }
    return text;
  };

  // Function to read PPTX content
  const readPptx = async (pptxData: ArrayBuffer) => {
    const pptx = new pptxgen();
    pptx.load(pptxData);
    const text = pptx.getRawText();
    return text;
  };

  // Function to validate local answer
  const validateLocalAnswer = (question: string, answer: string) => {
    // Implement your logic to validate the answer based on the question
    // You might want to use the content of the question to determine correctness
    // For simplicity, this is just a placeholder function
    return `AI: ${question}\nYou: ${answer}\nAI: Your answer is validated locally (placeholder response).`;
  };

  // useEffect to trigger question generation
  useEffect(() => {
    if (category !== "" && input === "" && generateQuestion) {
      askFirstQuestion();
      setGenerateQuestion(false);
    }
  }, [category, generateQuestion, apiSelection]);

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (input.trim() !== "") {
      setValidatingAnswer(true);
      let result = "";

      if (apiSelection === "local") {
        result = validateLocalAnswer(originalQuestion, input);
      } else {
        result = await run(
          `AI: ${originalQuestion}\nYou: ${input}\nAI: Evaluate the answer. In your feedback, do not ask any question, simply evaluate the answer as briefly as possible.`
        );
      }

      setResponse(result);
      setShowAnswer(true);
      setValidatingAnswer(false);
    }
  };

  // Function to handle generate question button click
  const handleGenerateQuestion = () => {
    setGenerateQuestion(true);
    setOriginalQuestion("");
    setResponse("");
    setInput("");
    setShowAnswer(false);
    setApiSelection(""); // Reset API selection
  };

  // Function to handle category selection change
  const handleCategoryChange = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setOriginalQuestion("");
    setResponse("");
    setInput("");
    setShowAnswer(false);
    setGenerateQuestion(false);
    setApiSelection(""); // Reset API selection
  };

  // Function to handle API selection change
  const handleApiSelectionChange = (selectedApi: string) => {
    setApiSelection(selectedApi);
  };

  return (
    <div className="container mx-auto p-4 w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2">
      <h1 className="text-2xl font-bold mb-4">Networking Questions Quiz Bot</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <div className="mt-4">
          <label>
            Choose API:
            <select
              value={apiSelection}
              onChange={(e) => handleApiSelectionChange(e.target.value)}
              className="ml-2 p-2 border border-gray-300 rounded"
            >
              <option value="">Select API</option>
              <option value="local">Local API</option>
              <option value="online">Online API</option>
            </select>
          </label>
        </div>
        <button
          onClick={handleGenerateQuestion}
          className="w-full mt-4 p-2 bg-blue-600 text-white font-semibold rounded"
          disabled={generatingQuestion}
        >
          {generatingQuestion ? "Generating question..." : "Generate Question"}
        </button>
        {originalQuestion && !generatingQuestion && (
          <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded question">
            <p>{originalQuestion}</p>
          </div>
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Your Answer"
        />
        <button
          type="submit"
          className="w-full p-2 bg-green-600 text-white font-semibold rounded"
          disabled={validatingAnswer}
        >
          {validatingAnswer ? "Validating answer..." : "Submit"}
        </button>
        {showAnswer && response && !generatingQuestion && (
          <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded answer">
            <p>{response}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Main;
