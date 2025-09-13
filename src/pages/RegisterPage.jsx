import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const { username, email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await AuthService.register(
                username,
                email,
                password
            );
            if (response.data.token) {
                login(response.data.token);
                navigate("/");
            }
        } catch (err) {
            setError(err.response.data.msg || "An unknown error occurred.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center pt-20">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Create an Account
                </h1>
                {error && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
                        role="alert"
                    >
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <form onSubmit={onSubmit} className="flex flex-col gap-6">
                    <div>
                        <label
                            className="block text-lg font-medium mb-2"
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={onChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-lg font-medium mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-lg font-medium mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            minLength="6"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center mt-6">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-gray-800 hover:underline font-medium"
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
