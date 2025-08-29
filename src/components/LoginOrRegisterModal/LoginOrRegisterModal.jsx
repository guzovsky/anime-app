import { useState } from "react";
import AnimeContext from "../../contexts/AnimeContext";
import { useContext } from "react"
import axios from "axios";
import "./LoginOrRegisterModal.css";

function LoginOrRegisterModal() {
    const {
        loginRegisterModalIsActive,
        setLoginRegisterModalIsActive,
        loginOrRegister,
        setLoginOrRegister,
        registerUser,
        loginUser,
    } = useContext(AnimeContext);

    const onClose = () => setLoginRegisterModalIsActive(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        try {
            if (loginOrRegister === "login") {
                await loginUser(name, password);
            } else {
                await registerUser(name, email, password);
                setSuccessMessage("Registration successful! Please check your email to verify your account.");
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Something went wrong");
        }
    };




    return (
        <>
            {loginRegisterModalIsActive && (
                <div className="login-register-modal-overlay">
                    <div className="login-register-modal-container" onClick={(e) => e.stopPropagation()}>

                        <h2>{loginOrRegister === "login" ? "Login" : "Register"}</h2>

                        <form onSubmit={handleSubmit}>
                            {loginOrRegister === "register" && (
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            )}
                            <input
                                type="text"
                                placeholder="Username"
                                value={name}
                                onChange={(e) => {
                                    const validName = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                                    setName(validName);
                                }}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit">{loginOrRegister === "login" ? "Login" : "Register"}</button>
                        </form>
                        {error && <p>{error}</p>}
                        {successMessage && <p>{successMessage}</p>}
                        <p>Or try to <button onClick={() => setLoginOrRegister(prev => prev === "login" ? "register" : "login")}>{loginOrRegister === "login" ? "Register" : "Login"}</button></p>
                        <button type="button" onClick={() => onClose()}>Close</button>

                    </div>
                </div>

            )}
        </>
    )
}

export default LoginOrRegisterModal