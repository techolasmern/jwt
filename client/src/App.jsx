import { BrowserRouter, Route, Routes } from "react-router";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";

export const App = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route path="auth" element={<AuthPage />} /> 
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    </BrowserRouter>
}