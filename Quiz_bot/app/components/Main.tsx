"use client";
import { useState, useEffect } from "react";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

const model = new OpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  temperature: 0.9,
});

const memory = new BufferMemory();
const chain = new ConversationChain({
  llm: model,
  memory: memory,
});

const run = async (input: string) => {
  const response = await chain.call({ input: input });
  return response.response;
};

const categories = [
  {
    label: "Open Ended",
    value: "is open ended which the user can answer in simple word(s)",
  },
  {
    label: "True or False",
    value:
      "is can be answered by either true or false where the user can either enter true or false",
  },
  {
    label: "Multipe Choice",
    value:
      "has multipe choice where you provide the user with 4 options A, B, C and D and the user enters one of the options",
  },
];

const Main = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [originalQuestion, setOriginalQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [generateQuestion, setGenerateQuestion] = useState(false);
  const [generatingQuestion, setGeneratingQuestion] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [validatingAnswer, setValidatingAnswer] = useState(false);

  const askFirstQuestion = async () => {
    setGeneratingQuestion(true);
    const firstQuestion = await run(`Ask a trivia question that ${category}. The question should be within Networking domain scope`);
    setOriginalQuestion(firstQuestion);
    setGeneratingQuestion(false);
    setShowAnswer(false);
  };

  useEffect(() => {
    if (category !== "" && input === "" && generateQuestion) {
      askFirstQuestion();
      setGenerateQuestion(false);
    }
  }, [category, generateQuestion]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (input.trim() !== "") {
      setValidatingAnswer(true);
      const result = await run(
        `AI: ${originalQuestion}\nYou: ${input}\nAI: Evaluate the answer. In your feedback, do not ask any question, simply evaluate the answer as briefly as possible.`
      );
      setResponse(result);
      setShowAnswer(true);
      setValidatingAnswer(false);
    }
  };

  const handleGenerateQuestion = () => {
    setGenerateQuestion(true);
    // Reset other relevant state variables
    setOriginalQuestion("");
    setResponse("");
    setInput("");
    setShowAnswer(false);
  };

  const handleCategoryChange = (selectedCategory: string) => {
    // Clear everything when changing the question type
    setCategory(selectedCategory);
    setOriginalQuestion("");
    setResponse("");
    setInput("");
    setShowAnswer(false);
    setGenerateQuestion(false);
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
