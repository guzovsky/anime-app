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

    const onClose = () => {
        setLoginRegisterModalIsActive(false);
        setName("");
        setEmail("");
        setPassword("");
        setError("");
        setSuccessMessage("");
    }

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setError("");
        setSuccessMessage("");
        try {
            if (loginOrRegister === "login") {
                await loginUser(name, password);
                setName("");
                setPassword("");
            } else {
                await registerUser(name.trim(), email.trim(), password);
                setSuccessMessage("Registration successful! Please check your email to verify your account.");
                setName("");
                setEmail("");
                setPassword("");
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Something went wrong");
        } finally {
            setLoading(false);
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
                        <p>Or try to <button onClick={() => {
                            setLoginOrRegister(prev => prev === "login" ? "register" : "login")
                            setError("");
                            setSuccessMessage("");
                        }}>{loginOrRegister === "login" ? "Register" : "Login"}</button></p>
                        <button type="button" onClick={() => onClose()}>Close</button>

                    </div>
                </div>

            )}
        </>
    )
}

export default LoginOrRegisterModal