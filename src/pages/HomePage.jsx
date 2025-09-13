import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/main.jpg";

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center pt-20 px-4">
            <div className="w-full max-w-md h-64 bg-gray-300 border-2 border-gray-800 mb-12">
                <img
                    src={heroImage}
                    alt="Typerace game theme"
                    className="w-full max-w-md h-64 object-cover border-2 border-gray-800 mb-12"
                />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-8">
                <Link to="/game/single">
                    <button className="text-2xl font-semibold px-8 py-4 border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-200">
                        Single Player
                    </button>
                </Link>
                <Link to="/game/multiplayer">
                    <button className="text-2xl font-semibold px-8 py-4 border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-200">
                        Multiplayer
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
