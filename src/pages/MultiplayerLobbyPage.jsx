import React, { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";

const MultiplayerLobbyPage = () => {
    const { user } = useContext(AuthContext);
    const [gameCode, setGameCode] = useState("");
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    const gameSettings = {
        difficulty: "medium",
        category: "english",
        words: 30,
    };

    useEffect(() => {
        if (socket) {
            const handleGameCreated = (gameId) => {
                console.log(`Game created with ID: ${gameId}`);
                navigate(`/game/multiplayer/${gameId}`);
            };
            socket.on("game-created", handleGameCreated);
            return () => {
                socket.off("game-created", handleGameCreated);
            };
        }
    }, [socket, navigate]);

    const handleCreateGame = () => {
        if (socket) {
            socket.emit("create-game", gameSettings);
        }
    };

    const handleJoinGame = (e) => {
        e.preventDefault();
        if (gameCode.trim()) {
            navigate(`/game/multiplayer/${gameCode.trim().toUpperCase()}`);
        }
    };

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="pt-20 px-4 flex flex-col items-center">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h1 className="text-4xl font-bold text-center mb-8 font-orbitron">
                    Multiplayer Lobby
                </h1>

                <div className="mb-8 border-b pb-8">
                    <h2 className="text-2xl font-semibold text-center mb-6 font-orbitron">
                        Host a New Game
                    </h2>
                    <button
                        onClick={handleCreateGame}
                        className="w-full bg-gray-800 text-white py-3 rounded-lg text-xl font-semibold hover:bg-gray-700"
                    >
                        Generate Game Code
                    </button>
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4 font-orbitron">
                        Join an Existing Game
                    </h2>
                    <form
                        onSubmit={handleJoinGame}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <input
                            type="text"
                            value={gameCode}
                            onChange={(e) => setGameCode(e.target.value)}
                            placeholder="Enter Game Code"
                            maxLength="4"
                            className="flex-grow w-full px-4 py-3 border rounded-lg focus:outline-none font-orbitron text-center uppercase"
                        />
                        <button
                            type="submit"
                            className="bg-gray-800 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-gray-700"
                        >
                            Join
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MultiplayerLobbyPage;
