import { Fragment, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { toast } from "react-toastify";
import { api } from "../lib/axios";
import { getUserId } from "../lib/jwt";

export const Dashboard = () => {

    const [file, setFile] = useState(null);

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const user_id = getUserId();
        getUserData(user_id);
    }, [])

    const getUserData = async (uid) => {
        try {
            const res = await api.get("/api/user/" + uid);
            setUserData(res.data.user);
        } catch (err) {
            return console.log(err.response)
        }
    }

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Please select a file");
        const form_data = new FormData();
        form_data.append("file", file);
        const user_id = getUserId();
        form_data.append("user_id", user_id);
        const res = await api.post("/api/user/update", form_data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return toast.success(res.data.message);
    }

    return <Fragment>
        <Header />
        <form className="flex flex-col items-center justify-center mt-20 p-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-sm mx-auto">
            <div className="relative group">
                <img
                    src={file ? URL.createObjectURL(file) : `http://localhost:8080/file/${userData?.profile_picture}`}
                    alt="profile preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-indigo-50 shadow-md transition-transform duration-200 group-hover:scale-105"
                />

                <label
                    htmlFor="file-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
                >
                    <span className="text-white text-xs font-medium">Change</span>
                </label>
            </div>

            <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">{userData?.username || "Your Profile"}</h3>
                <p className="text-sm text-gray-500">JPG, PNG or GIF</p>
            </div>

            <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button
                onClick={handleFileUpload}
                type="button"
                className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
            >
                Update Picture
            </button>
        </form>
    </Fragment>
};