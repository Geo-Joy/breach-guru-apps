import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Plus } from "lucide-react";

const PalindromeChecker = () => {
  const [words, setWords] = useState(["racecar", "hello", "deified"]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [leftPointer, setLeftPointer] = useState(0);
  const [rightPointer, setRightPointer] = useState(words[0].length - 1);
  const [status, setStatus] = useState("");
  const [newWord, setNewWord] = useState("");
  const [checkedIndices, setCheckedIndices] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const reset = () => {
    setLeftPointer(0);
    setRightPointer(words[currentWordIndex].length - 1);
    setStatus("");
    setCheckedIndices([]);
    setIsComplete(false);
  };

  const stepForward = () => {
    if (isComplete) return;

    if (leftPointer >= rightPointer) {
      setStatus("It's a palindrome");
      setIsComplete(true);
      setCheckedIndices((prev) => [...prev, leftPointer, rightPointer]);
      return;
    }

    if (
      words[currentWordIndex][leftPointer] !==
      words[currentWordIndex][rightPointer]
    ) {
      setStatus("Not a palindrome");
      setIsComplete(true);
      return;
    }

    setCheckedIndices((prev) => [...prev, leftPointer, rightPointer]);
    setLeftPointer((prev) => prev + 1);
    setRightPointer((prev) => prev - 1);
  };

  const stepBackward = () => {
    if (
      leftPointer === 0 &&
      rightPointer === words[currentWordIndex].length - 1
    )
      return;

    setLeftPointer((prev) => prev - 1);
    setRightPointer((prev) => prev + 1);
    setCheckedIndices((prev) => prev.slice(0, -2));
    setStatus("");
    setIsComplete(false);
  };

  const addNewWord = () => {
    if (newWord.trim() !== "") {
      setWords([...words, newWord.trim()]);
      setNewWord("");
    }
  };

  useEffect(() => {
    reset();
  }, [currentWordIndex, words]);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Palindrome Checker
      </h2>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="Add new word"
          className="flex-grow px-3 py-2 border rounded-md"
        />
        <button
          onClick={addNewWord}
          className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() =>
            setCurrentWordIndex((prev) =>
              prev > 0 ? prev - 1 : words.length - 1
            )
          }
          className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Previous Word
        </button>
        <span className="font-semibold">{words[currentWordIndex]}</span>
        <button
          onClick={() =>
            setCurrentWordIndex((prev) =>
              prev < words.length - 1 ? prev + 1 : 0
            )
          }
          className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Next Word
        </button>
      </div>

      <div className="flex justify-center space-x-1">
        {words[currentWordIndex].split("").map((char, index) => (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center border rounded ${
              index === leftPointer || index === rightPointer
                ? "bg-blue-200 border-blue-500"
                : checkedIndices.includes(index)
                ? "bg-green-200 border-green-500"
                : "border-gray-300"
            }`}
          >
            {char}
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-2">
        <button
          onClick={stepBackward}
          disabled={
            leftPointer === 0 &&
            rightPointer === words[currentWordIndex].length - 1
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={stepForward}
          disabled={isComplete}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="text-center font-semibold text-lg">{status}</div>
    </div>
  );
};

export default PalindromeChecker;
