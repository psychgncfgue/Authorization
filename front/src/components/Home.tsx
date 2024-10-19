import { Dialog, DialogActions, DialogContent, DialogTitle, Pagination, Backdrop } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
    Typography,
    Grid,
    Box,
    CircularProgress,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { fetchProductsRequest } from "../redux/actions/productActions";
import { Link, useNavigate } from 'react-router-dom';
import { Product } from "../interfaces/interfaces";
import { addToFavorites, fetchFavorites } from "../redux/actions/favoritesActions";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ProductCarousel from '../components/ProductCarousel';

const Home: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, isLoadingProduct, error, totalPages } = useSelector((state: RootState) => state.product);
    const isLoadingAddToFavorites = useSelector((state: RootState) => state.favorites.loadingStates);
    const addedItems = useSelector((state: RootState) => state.favorites.addedItems);
    const { userId, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [selectedProductNames, setSelectedProductNames] = useState<string[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const productsRef = useRef<HTMLDivElement | null>(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    useEffect(() => {
        dispatch(fetchProductsRequest(page));
    }, [dispatch, page]);

    useEffect(() => {
        if (userId) {
            dispatch(fetchFavorites(userId));
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (!Object.values(isLoadingAddToFavorites).some(loading => loading)) {
            setSelectedProductNames([]);
        }
    }, [isLoadingAddToFavorites]);

    useEffect(() => {
        if (!isLoadingProduct && shouldScroll && productsRef.current) {
            productsRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            setShouldScroll(false);
        }
    }, [isLoadingProduct, shouldScroll]);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleGoToAuth = () => {
        handleCloseDialog();
        navigate('/auth');
    };

    const handleAddToFavorites = (product: Product) => {
        if (isAuthenticated) {
            if (userId && !isAddedToFavorites(product.name)) {
                dispatch(addToFavorites({ userId, productNames: [product.name] }));
            } else if (!userId) {
                console.error('User ID is not available');
                setOpenDialog(true);
            }
        } else {
            setOpenDialog(true);
        }
    };

    const isAddedToFavorites = (productName: string) => addedItems.includes(productName);
    const isLoadingForProduct = (productName: string) => isLoadingAddToFavorites[productName] || false;
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        setShouldScroll(true);
    };

    return (
        <>
            <Box>
                <ProductCarousel
                    isAddedToFavorites={isAddedToFavorites}
                    isLoadingForProduct={isLoadingForProduct}
                    handleAddToFavorites={handleAddToFavorites}
                    openDialog={openDialog}
                    handleCloseDialog={handleCloseDialog}
                    handleGoToAuth={handleGoToAuth}/>
            </Box>
            <Box sx={{backgroundColor: '#f5f5f5', minHeight: '100vh', overflowX: 'hidden'}}>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={isLoadingProduct}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>

                <Box sx={{padding: 3, marginTop: 3}}>
                    <FormControl variant="outlined" sx={{mt: 12, minWidth: 120}}>
                        <InputLabel id="sort-label">Сортировка</InputLabel>
                        <Select
                            labelId="sort-label"
                            label="Сортировка"
                        >
                            <MenuItem value="asc">По возрастанию цены</MenuItem>
                            <MenuItem value="desc">По убыванию цены</MenuItem>
                        </Select>
                    </FormControl>
                    <Grid container spacing={2} sx={{mt: 2}} ref={productsRef}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                <Box sx={{padding: 2, backgroundColor: '#fff', borderRadius: 1}}>
                                    <Link to={`/product/${product.name}/${product.size}`}>
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            style={{
                                                width: '100%',
                                                borderRadius: '4px',
                                                maxWidth: '100%',
                                            }}/>
                                        <Typography variant="h6">{product.name}</Typography>
                                    </Link>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mt: 1
                                    }}>
                                        <Typography>{`Цена: ${product.price} руб.`}</Typography>
                                        <>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAddToFavorites(product)}
                                                disabled={isAddedToFavorites(product.name) || isLoadingForProduct(product.name)}
                                            >
                                                {isAddedToFavorites(product.name) ? (
                                                    <CheckCircleIcon/>
                                                ) : (
                                                    isLoadingForProduct(product.name) ? (
                                                        <CircularProgress size={24} color="inherit"/>
                                                    ) : (
                                                        <FavoriteBorderIcon/>
                                                    )
                                                )}
                                            </Button>

                                            <Dialog open={openDialog} onClose={handleCloseDialog}>
                                                <DialogTitle>Необходима аутентификация</DialogTitle>
                                                <DialogContent>
                                                    Войдите в учетную запись или зарегистрируйтесь для того, чтобы
                                                    добавлять в избранное.
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleGoToAuth} color="primary">
                                                        Войти в учетную запись
                                                    </Button>
                                                    <Button onClick={handleCloseDialog} color="secondary">
                                                        Отмена
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Pagination
                        sx={{mt: 4, display: 'flex', justifyContent: 'center'}}
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}/>
                </Box>
            </Box>
        </>
    );
};

export default Home;