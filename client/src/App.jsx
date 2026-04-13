import { BrowserRouter, Route, Routes } from "react-router";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./ProtectedRoute";

export const App = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route path="auth" element={<ProtectedRoute is_auth={true}><AuthPage /></ProtectedRoute>} /> 
                <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Route>
        </Routes>
    </BrowserRouter>
}