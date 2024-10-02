import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '../redux/actions/authActions';
import { RootState, AppDispatch } from '../redux/store/store';
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Menu, MenuItem, CircularProgress, Typography, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const isLoading = useSelector((state: RootState) => state.auth.isLoading);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [message, setMessage] = useState<string>("");

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        dispatch(logoutRequest());
        navigate('/auth');
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            console.log("Message sent:", message);
            setMessage("");
        }
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: '#fff',
                    margin: 0,
                    padding: 0,
                }}
            >
                <CircularProgress color="inherit" />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Выход из системы...
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#2d2d2d',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', padding: '10px' }}>
                <Avatar
                    onClick={handleMenuOpen}
                    sx={{
                        backgroundColor: '#1976d2',
                        cursor: 'pointer',
                        width: 40,
                        height: 40,
                    }}
                >
                    {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    sx={{
                        "& .MuiPaper-root": {
                            backgroundColor: "white",
                        }
                    }}
                >
                    <MenuItem onClick={handleLogout}>Выйти из системы</MenuItem>
                </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, padding: '20px', overflowY: 'auto', color: '#fff' }}>

            </Box>
            <Box sx={{ padding: '15px', display: 'flex', backgroundColor: '#2d2d2d' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Введите сообщение..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{
                        mr: 1,
                        input: { color: '#fff' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#555',
                            },
                            '&:hover fieldset': {
                                borderColor: '#777',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#1976d2',
                            },
                        }
                    }}
                />
                <IconButton color="primary" onClick={handleSendMessage}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Dashboard;