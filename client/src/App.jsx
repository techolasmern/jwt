import { BrowserRouter, Route, Routes } from "react-router";
import { AuthPage } from "./pages/AuthPage";

export const App = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route path="auth" element={<AuthPage />} /> 
            </Route>
        </Routes>
    </BrowserRouter>
}