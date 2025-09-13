import React, { useState, useEffect, useRef, useContext } from "react";
import { Navigate } from "react-router-dom";
import GameService from "../services/gameService";
import { AuthContext } from "../context/AuthContext";

const GamePage = () => {
    const { user } = useContext(AuthContext);

    const [gameSettings, setGameSettings] = useState({
        difficulty: "medium",
        category: "english",
        words: 30,
    });
    const [gameStarted, setGameStarted] = useState(false);

    const [words, setWords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentInput, setCurrentInput] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [correctlyTypedWords, setCorrectlyTypedWords] = useState([]);

    const inputRef = useRef(null);

    const handleSettingsChange = (e) => {
        const { name, value } = e.target;
        setGameSettings((prevSettings) => ({
            ...prevSettings,
            [name]: name === "words" ? parseInt(value) : value,
        }));
    };

    const startGame = async () => {
        try {
            setError(null);
            setIsLoading(true);
            setGameStarted(true);
            const response = await GameService.getRandomText(gameSettings);
            setWords(response.data);
            setCorrectlyTypedWords(Array(response.data.length).fill(null));
        } catch (err) {
            setError("Failed to load the game text. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        setGameStarted(false);
        setWords([]);
        setCurrentInput("");
        setCurrentWordIndex(0);
        setCorrectlyTypedWords([]);
        setError(null);
    };

    useEffect(() => {
        if (gameStarted && !isLoading && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gameStarted, isLoading]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.endsWith(" ")) {
            if (currentInput.length === 0) return;
            const wordToCompare = words[currentWordIndex];
            const typedWord = currentInput.trim();
            const isCorrect = typedWord === wordToCompare;
            const newCorrectness = [...correctlyTypedWords];
            newCorrectness[currentWordIndex] = isCorrect;
            setCorrectlyTypedWords(newCorrectness);
            setCurrentWordIndex(currentWordIndex + 1);
            setCurrentInput("");
        } else {
            setCurrentInput(value);
        }
    };

    const isGameOver = currentWordIndex >= words.length;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!gameStarted) {
        return (
            <div className="pt-20 px-4 flex flex-col items-center">
                <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md border border-gray-200">
                    <h1 className="text-4xl font-bold text-center mb-8 font-orbitron">
                        Game Settings
                    </h1>
                    <div className="flex flex-col gap-6">
                        <div>
                            <label className="block text-lg font-medium mb-4 text-center font-orbitron">
                                Category
                            </label>
                            <div className="flex justify-center flex-wrap gap-2">
                                {[
                                    "english",
                                    "coding",
                                    "numbers",
                                    "punctuation",
                                ].map((category) => (
                                    <div key={category}>
                                        <input
                                            type="radio"
                                            name="category"
                                            id={category}
                                            value={category}
                                            checked={
                                                gameSettings.category ===
                                                category
                                            }
                                            onChange={handleSettingsChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor={category}
                                            className={`cursor-pointer px-2 py-1 text-sm rounded-lg border-2 font-orbitron transition-colors duration-200 ${
                                                gameSettings.category ===
                                                category
                                                    ? "bg-gray-800 text-white border-gray-800"
                                                    : "border-gray-300"
                                            }`}
                                        >
                                            {category.charAt(0).toUpperCase() +
                                                category.slice(1)}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-medium mb-4 text-center font-orbitron">
                                Difficulty
                            </label>
                            <div className="flex justify-center gap-2">
                                {["easy", "medium", "hard"].map(
                                    (difficulty) => (
                                        <div key={difficulty}>
                                            <input
                                                type="radio"
                                                name="difficulty"
                                                id={difficulty}
                                                value={difficulty}
                                                checked={
                                                    gameSettings.difficulty ===
                                                    difficulty
                                                }
                                                onChange={handleSettingsChange}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor={difficulty}
                                                className={`cursor-pointer px-2 py-1 text-sm rounded-lg border-2 font-orbitron transition-colors duration-200 ${
                                                    gameSettings.difficulty ===
                                                    difficulty
                                                        ? "bg-gray-800 text-white border-gray-800"
                                                        : "border-gray-300"
                                                }`}
                                            >
                                                {difficulty
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    difficulty.slice(1)}
                                            </label>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                className="block text-lg font-medium mb-2 font-orbitron text-center"
                                htmlFor="words"
                            >
                                Word Count (10-50)
                            </label>
                            <input
                                type="number"
                                name="words"
                                id="words"
                                value={gameSettings.words}
                                onChange={handleSettingsChange}
                                min="10"
                                max="50"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 font-orbitron text-center"
                            />
                        </div>

                        <button
                            onClick={startGame}
                            className="w-full bg-gray-800 text-white py-3 rounded-lg text-xl font-semibold hover:bg-gray-700 transition-colors duration-200 font-orbitron"
                        >
                            Start Game
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="pt-20 text-center text-2xl font-orbitron animate-pulse">
                Loading Game...
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-20 text-center text-red-500 text-2xl font-orbitron">
                {error}
            </div>
        );
    }

    return (
        <div
            className="pt-20 px-4 flex flex-col items-center"
            onClick={() => !isGameOver && inputRef.current.focus()}
        >
            <div className="w-full max-w-4xl">
                <div className="w-full flex justify-end mb-4">
                    <button
                        onClick={handleGoBack}
                        className="px-4 py-2 text-sm rounded-lg border-2 border-gray-300 font-orbitron hover:bg-gray-100 transition-colors duration-200"
                    >
                        ← Back to Settings
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-3xl leading-relaxed tracking-wider font-orbitron mb-8 flex flex-wrap content-start">
                    {words.map((word, index) => {
                        const isCurrentWord = index === currentWordIndex;
                        const isTypedWord = index < currentWordIndex;
                        let wordClass = "text-gray-400";
                        if (isCurrentWord) {
                            wordClass =
                                "text-gray-800 underline underline-offset-4";
                        } else if (isTypedWord) {
                            wordClass = correctlyTypedWords[index]
                                ? "text-green-500"
                                : "text-red-500";
                        }
                        return (
                            <span key={index} className={`${wordClass} mr-4`}>
                                {word}
                            </span>
                        );
                    })}
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={handleInputChange}
                    className="w-full text-2xl p-4 rounded-lg border-2 border-gray-800 focus:outline-none font-orbitron"
                    placeholder={
                        isGameOver ? "Game finished!" : "Start typing here..."
                    }
                    disabled={isGameOver}
                />

                {isGameOver && (
                    <div className="mt-8 text-center">
                        <h2 className="text-3xl font-bold font-orbitron">
                            Game Finished!
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GamePage;
