import { Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import MapPage from "./pages/Map/MapPage";
import SessionsPage from "./pages/Sessions/SessionsPage";

const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signin" element={<Login />} />
                <Route path={"/dashboard"} element={
                    //<ProtectedRoute>
                        <DashboardLayout />
                    //</ProtectedRoute>
                }>
                    <Route path="" element={<Dashboard />} />
                    <Route path="map" element=  {<MapPage />} />
                    <Route path="chat/:sessionId" element={<SessionsPage />} />
                </Route>
            </Routes>
        </>
    )
}

export default AppRouter