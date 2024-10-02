import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { RootState } from "./redux/store/store";
import Auth from './components/Auth';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { CircularProgress, Box } from '@mui/material';
import { CssBaseline } from '@mui/material'; // Импортируем CssBaseline

function App() {
    const isLoading = useSelector((state: RootState) => state.auth.isLoading);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Router>
            <CssBaseline /> {/* Добавляем CssBaseline здесь */}
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/registration" element={<Registration />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/" element={<Navigate to="/auth" />} />
            </Routes>
        </Router>
    );
}

export default App;