import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./redux/store/store";
import Auth from './components/Auth';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import { CircularProgress, Box } from '@mui/material';
import { CssBaseline } from '@mui/material';
import {checkAuth} from "./redux/actions/authActions";
import ProductPage from "./components/ProductPage";
import Home from "./components/Home";

function App() {
    const isLoading = useSelector((state: RootState) => state.auth.isLoading)
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

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
            <CssBaseline />
            <Routes>
                <Route path="/" element={<Dashboard />}>
                    <Route index element={<Home />} />
                    <Route path="product/:name/:size" element={<ProductPage />} />
                </Route>
                <Route path="/auth" element={<Auth />} />
                <Route path="/registration" element={<Registration />} />
            </Routes>
        </Router>
    );
}

export default App;