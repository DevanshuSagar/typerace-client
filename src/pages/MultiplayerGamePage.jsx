import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";

const MultiplayerGamePage = () => {
    const { user } = useContext(AuthContext);
    const { gameId } = useParams();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const inputRef = useRef(null);

    const [gameState, setGameState] = useState(null);
    const [error, setError] = useState("");

    const [currentInput, setCurrentInput] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
        if (socket && user) {
            const username = user.username;
            socket.emit("join-game", { gameId, username });

            const handleGameUpdate = (updatedGameState) =>
                setGameState(updatedGameState);
            const handleGameError = (errorMessage) => setError(errorMessage);

            socket.on("game-update", handleGameUpdate);
            socket.on("game-error", handleGameError);

            return () => {
                socket.off("game-update", handleGameUpdate);
                socket.off("game-error", handleGameError);
            };
        }
    }, [socket, gameId, user, navigate]);

    useEffect(() => {
        if (gameState?.status === "inprogress" && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gameState]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.endsWith(" ")) {
            if (currentInput.length === 0) return;

            const wordToCompare = gameState.words[currentWordIndex];
            if (currentInput.trim() === wordToCompare) {
                const newWordIndex = currentWordIndex + 1;
                setCurrentWordIndex(newWordIndex);
                socket.emit("player-progress-update", {
                    gameId,
                    progress: newWordIndex,
                });
            }
            setCurrentInput("");
        } else {
            setCurrentInput(value);
        }
    };

    const handleStartGame = () => {
        socket.emit("start-game", gameId);
    };

    const handleSettingsChange = (e) => {
        const { name, value } = e.target;
        const newSettings = {
            ...gameState.settings,
            [name]: name === "words" ? parseInt(value, 10) : value,
        };
        socket.emit("update-settings", { gameId, newSettings });
    };

    if (!user) return <Navigate to="/login" />;
    if (error)
        return <div className="pt-20 text-center text-red-500">{error}</div>;
    if (!gameState)
        return <div className="pt-20 text-center">Connecting to game...</div>;

    const isHost = gameState.players[0]?.id === socket.id;
    const isGameOver = currentWordIndex >= (gameState.words?.length || 0);

    if (gameState.status === "waiting") {
        return (
            <div className="pt-20 px-4 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-4">
                    Game Code: {gameState.id}
                </h1>
                <h2 className="text-xl mb-8">Waiting for players...</h2>

                <div className="w-full max-w-md mx-auto bg-gray-100 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-center">
                        Game Settings
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            {isHost ? (
                                <select
                                    name="category"
                                    value={gameState.settings.category}
                                    onChange={handleSettingsChange}
                                    className="mt-1 block w-full p-2 border rounded-md"
                                >
                                    <option value="english">English</option>
                                    <option value="coding">Coding</option>
                                    <option value="numbers">Numbers</option>
                                </select>
                            ) : (
                                <p className="font-semibold text-lg">
                                    {gameState.settings.category}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Word Count
                            </label>
                            {isHost ? (
                                <input
                                    type="number"
                                    name="words"
                                    value={gameState.settings.words}
                                    onChange={handleSettingsChange}
                                    min="10"
                                    max="50"
                                    className="mt-1 block w-full p-2 border rounded-md"
                                />
                            ) : (
                                <p className="font-semibold text-lg">
                                    {gameState.settings.words}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Difficulty
                            </label>
                            {isHost ? (
                                <select
                                    name="difficulty"
                                    value={gameState.settings.difficulty}
                                    onChange={handleSettingsChange}
                                    className="mt-1 block w-full p-2 border rounded-md"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            ) : (
                                <p className="font-semibold text-lg">
                                    {gameState.settings.difficulty}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2 text-center">
                        Players
                    </h3>
                    <ul className="space-y-2">
                        {gameState.players.map((p) => (
                            <li key={p.id} className="text-center">
                                {p.username}
                            </li>
                        ))}
                    </ul>
                </div>

                {isHost && (
                    <button
                        onClick={handleStartGame}
                        className="mt-8 bg-green-500 text-white px-6 py-3 rounded text-xl"
                    >
                        Start Game
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="pt-20 px-4 flex flex-col items-center">
            <div className="w-full max-w-4xl mb-8">
                <h2 className="text-xl font-semibold text-center mb-4">
                    Progress
                </h2>
                {gameState.players.map((player) => (
                    <div key={player.id} className="mb-2">
                        <span>
                            {player.username}{" "}
                            {player.id === socket.id && "(You)"}
                        </span>
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                            <div
                                className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-linear"
                                style={{
                                    width: `${
                                        (player.progress /
                                            gameState.words.length || 1) * 100
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-3xl mb-8 flex flex-wrap">
                {gameState.words.map((word, index) => {
                    const isTyped = index < currentWordIndex;
                    const isCurrent = index === currentWordIndex;
                    let colorClass = isTyped
                        ? "text-green-500"
                        : "text-gray-400";
                    if (isCurrent) colorClass = "text-gray-800 underline";

                    return (
                        <span key={index} className={`${colorClass} mr-4`}>
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
                className="w-full text-2xl p-4 rounded-lg border-2"
                placeholder={isGameOver ? "Finished!" : "Start typing..."}
                disabled={isGameOver || gameState.status !== "inprogress"}
            />
        </div>
    );
};

export default MultiplayerGamePage;
