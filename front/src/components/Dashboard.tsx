import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '../redux/actions/authActions';
import { RootState, AppDispatch } from '../redux/store/store';
import {clearFavorites, fetchFavorites, removeFromFavorites} from "../redux/actions/favoritesActions";
import {Outlet, useNavigate} from "react-router-dom";
import {
    Box,
    Avatar,
    Menu,
    MenuItem,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    CircularProgress,
    Drawer,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { closeCart, openCart } from "../redux/reducers/authSlice";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = useSelector((state: RootState) => state.auth.userId);
    const isLoading = useSelector((state: RootState) => state.auth.isLoading);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { favoritesProducts, isLoadingFavorites, error } = useSelector((state: RootState) => state.favorites);
    const cartOpen = useSelector((state: RootState) => state.auth.cartOpen);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNavigateLogin = () => {
        navigate('/auth');
    };

    const handleNavigateCard = () => {
        navigate('./card/${userId}')
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        dispatch(logoutRequest());
    };

    const handleCardOpen = () => {
        dispatch(openCart());
        if (userId) {
            dispatch(fetchFavorites(userId));
        } else {
            console.error('User ID is not available');
        }
    };

    const handleRemoveItem = (userId: string, productName: string) => {
        if (userId) {
            dispatch(removeFromFavorites(userId, productName));
        } else {
            console.error('User ID is not available');
        }
    };

    const handleClearCart = (userId: string) => {
        if (userId) {
            dispatch(clearFavorites(userId));
        } else {
            console.error('User ID is not available');
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
        <>
            <AppBar position="fixed" color="primary" sx={{ height: '60px' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: 0 }}>
                    <Typography variant="h6">Магазин</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton sx={{ display: 'flex' }} color="inherit" onClick={handleNavigateCard}>
                            <ShoppingCartIcon />
                        </IconButton>
                        {isAuthenticated && (
                            <IconButton sx={{ display: 'flex', ml: 2 }} color="inherit" onClick={handleCardOpen}>
                                <FavoriteBorderIcon />
                            </IconButton>
                        )}
                        {isAuthenticated ? (
                            <>
                                <Avatar
                                    onClick={handleMenuOpen}
                                    sx={{
                                        backgroundColor: '#1976d2',
                                        cursor: 'pointer',
                                        width: 40,
                                        height: 40,
                                        ml: 2,
                                    }}
                                >
                                    {user?.username?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleLogout}>Выйти из системы</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <MenuItem onClick={handleNavigateLogin} sx={{ ml: 2 }}>
                                Войти
                            </MenuItem>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingTop: '60px',
                    height: '100vh',
                    overflow: 'hidden',
                    overflowX: 'hidden',
                }}
            >
                <Drawer
                    anchor="right"
                    open={cartOpen}
                    onClose={() => dispatch(closeCart())}
                    transitionDuration={{ enter: 500, exit: 300 }}
                >
                    <Box sx={{ width: 400, padding: 2, position: 'relative' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mr:4, ml: 4 }}>
                            <IconButton
                                onClick={() => dispatch(closeCart())}
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0',
                                    },
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => userId && handleClearCart(userId)}
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    minWidth: '100px',
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0',
                                    },
                                }}
                            >
                                <Typography variant="body2" color="textPrimary">
                                    Очистить все
                                </Typography>
                            </IconButton>
                        </Box>
                        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
                            Избранное
                        </Typography>
                        {isLoadingFavorites ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
                                Ошибка: {error}
                            </Typography>
                        ) : (
                            <Box>
                                {Array.isArray(favoritesProducts) && favoritesProducts.length > 0 ? (
                                    favoritesProducts.map((item) => (
                                        <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                style={{ width: '50px', height: 'auto', marginRight: '16px' }}
                                            />
                                            <Box sx={{ flexGrow: 1, mr: 1 }}>
                                                <Typography
                                                    variant="body1"
                                                    noWrap
                                                    sx={{
                                                        maxWidth: '150px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {item.product.name}
                                                </Typography>
                                            </Box>
                                            <IconButton
                                                onClick={() => {
                                                    if (userId) {
                                                        handleRemoveItem(userId, item.product.name);
                                                    } else {
                                                        console.error('User ID is not available');
                                                    }
                                                }}
                                                sx={{ ml: 1 }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body1">Вы пока что ничего не добавили</Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                </Drawer>
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Outlet />
                </Box>
            </Box>
        </>
    );
};

export default Dashboard;