import { useState } from "react";
import axios from "axios";

const App = () => {
    
    const [isLogin, setIsLogin] = useState(true);
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });
    const [signUpData, setSignUpData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleChangeLoginData = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    }

    const handleChangeSignUpData = (e) => {
        setSignUpData({
            ...signUpData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        const res = await axios.post("http://localhost:8080/api/user/login", loginData);
        console.log(res.data);
        localStorage.setItem("token", res.data.accessToken);
    }

    const handleSubmitSignUp = async (e) => {
        e.preventDefault();
        const res = await axios.post("http://localhost:8080/api/user/register", signUpData);
       console.log(res.data);
         setIsLogin(true);
    }

    const handleCheck = async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/check", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log(res.data);
    }

    return <div>
        <div>
            <button onClick={() => setIsLogin(true)}>Login</button>
            <button onClick={() => setIsLogin(false)}>Sign up</button>
        </div>

        {
            isLogin ? <form onChange={handleChangeLoginData} onSubmit={handleSubmitLogin}>
                <input type="text" name="username" placeholder="Username" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form> : <form onChange={handleChangeSignUpData} onSubmit={handleSubmitSignUp}>
                    <input type="text" name="username" placeholder="Username" />
                    <input type="email" name="email" placeholder="Email" />
                    <input type="text" name="phone" placeholder="Phone" />
                    <input type="password" name="password" placeholder="Password" />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" />
                    <button type="submit">Sign up</button>
            </form>
        }
        <button onClick={handleCheck}>Button For Logged in users</button>
    </div>
}

export default App;