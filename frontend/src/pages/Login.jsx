import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

const Login = () => {
    const [role, setRole] = useState("customer");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [apiError, setApiError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setEmailError("");
        setPasswordError("");
        setApiError("");

        let isValid = true;
        if (!email) {
            setEmailError("Email is required.");
            isValid = false;
        }
        if (!password) {
            setPasswordError("Password is required.");
            isValid = false;
        }
        if (!isValid) return;

        try {
            const data = await loginUser(email, password, role);

            if (data.status === "success") {
                if (role === "customer") {
                    navigate("/customer/transactions");
                } else {
                    navigate("/banker/accounts");
                }
            } else {
                setApiError(data.message || "Login failed.");
            }
        } catch (error) {
            setApiError(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="p-8 w-full max-w-[500px] bg-white rounded-xl shadow-lg flex flex-col gap-6">
                <div className="flex justify-between">
                    <button
                        className={`p-2 w-1/2 rounded-l-xl ${role === "customer" ? "bg-[#6e6151] text-white" : "bg-gray-200"}`}
                        onClick={() => setRole("customer")}
                    >
                        Customer Login
                    </button>

                    <button
                        className={`p-2 w-1/2 rounded-r-xl ${role === "banker" ? "bg-[#6e6151] text-white" : "bg-gray-200"}`}
                        onClick={() => setRole("banker")}
                    >
                        Banker Login
                    </button>
                </div>

                <div className="font-bold text-[2.2rem] text-center">
                    {role === "customer" ? "Customer Login" : "Banker Login"}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[#3B312899] text-[1.2rem]">
                        {role === "customer" ? "Customer Email" : "Banker Email"}
                    </label>

                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full outline-none border p-2 rounded-xl ${emailError ? "border-red-500" : "border-[#3b3128]"}`}
                    />

                    {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[#3B312899] text-[1.2rem]">Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full outline-none border p-2 rounded-xl ${passwordError ? "border-red-500" : "border-[#3b3128]"}`}
                    />

                    {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                </div>

                {apiError && <p className="text-center text-red-600">{apiError}</p>}

                <button onClick={handleLogin} className="bg-[#6e6151] text-white p-3 rounded-xl text-[1.3rem]">
                    LOGIN
                </button>
            </div>
        </div>
    );
};

export default Login;
