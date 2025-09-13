import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-white border-b border-gray-200 p-4 flex justify-around items-center font-orbitron">
            <Link to="/" className="text-2xl font-bold text-gray-800">
                Typerace
            </Link>
            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        <span className="text-lg text-gray-700">
                            {user.username}
                        </span>
                        <button
                            onClick={logout}
                            className="border border-gray-800 px-4 py-2 text-lg hover:bg-gray-800 hover:text-white transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="border border-gray-800 px-4 py-2 text-lg hover:bg-gray-800 hover:text-white transition-colors duration-200"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-gray-800 text-white px-4 py-2 text-lg border border-gray-800 hover:bg-gray-700 transition-colors duration-200"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
