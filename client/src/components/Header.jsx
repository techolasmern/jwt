import { FaRegUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import { storage } from "../lib/storage";

export const Header = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        storage.remove();
        navigate("/auth");
    }

    return <header className="flex items-center justify-between px-10 h-16">
        <h1>USER DASHBOARD</h1>
        <div className="flex gap-5">
            <FaRegUserCircle />
            <FaSignOutAlt color="red" cursor={"pointer"} onClick={handleLogout}/>
        </div>
    </header>
};