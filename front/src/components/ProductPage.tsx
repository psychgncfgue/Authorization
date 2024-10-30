import React, { useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    CircularProgress,
    useTheme,
} from '@mui/material';
import { AppDispatch, RootState } from '../redux/store/store';
import { fetchProductByIdRequest } from '../redux/actions/productActions';
import Recommendations from "./Recommendations";
import {addToCart} from "../redux/actions/cartActions";

const ProductPage: React.FC = () => {
    const { name, size } = useParams<{ name: string; size: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { productPage, isLoadingProductPage } = useSelector((state: RootState) => state.productPage);
    const [selectedSize, setSelectedSize] = React.useState<string>('');
    const theme = useTheme();
    const {userId} = useSelector((state: RootState) => state.auth)
    const productId = useSelector((state: RootState) => state.productPage.productPage.id);

    useEffect(() => {
        if (size && name) {
            dispatch(fetchProductByIdRequest(name, size));
        }
    }, [name, size, dispatch]);

    useEffect(() => {
        if (productPage.size) {
            setSelectedSize(productPage.size);
        }
    }, [productPage.size]);

    const handleSizeChange = (event: SelectChangeEvent<string>) => {
        const newSize = event.target.value as string;
        setSelectedSize(newSize);
        if (name) {
            dispatch(fetchProductByIdRequest(name, newSize));
        }
    };

    const handleAddToCart = () => {
        dispatch(addToCart(userId!, productId!))
    };

    if (isLoadingProductPage) {
        return (
            <Box
                sx={{
                    p: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!productPage || !productPage.id) {
        return (
            <Box sx={{ p: 4, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
                <Typography variant="h5" color="error">
                    Продукт не найден
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Box sx={{p: 4, backgroundColor: theme.palette.background.default, minHeight: '100vh', mt: 6}}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', md: 'row'},
                    gap: 4,
                    alignItems: {xs: 'center', md: 'flex-start'},
                }}
            >
                <Box
                    sx={{
                        width: {xs: '100%', md: '40%'},
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        src={productPage.imageUrl || ''}
                        alt={productPage.name || 'Product'}
                        style={{
                            width: '50%',
                            height: '50%',
                            borderRadius: '8px',
                            boxShadow: theme.shadows[3],
                        }}/>
                </Box>
                <Box sx={{flex: 1}}>
                    <Typography variant="h4" sx={{mb: 2, fontWeight: 'bold'}}>
                        {productPage.name}
                    </Typography>
                    <Typography variant="h5" sx={{color: theme.palette.primary.main, fontWeight: '500', mb: 1}}>
                        Цена: {productPage.price} руб.
                    </Typography>
                    {productPage.discount !== null && (
                        <Typography variant="h6" sx={{color: 'red', mt: 1}}>
                            Скидка: {productPage.discount}%
                        </Typography>
                    )}
                    <Typography sx={{mt: 2, color: theme.palette.text.secondary}}>
                        {productPage.description}
                    </Typography>
                    <FormControl variant="outlined" sx={{mt: 3, minWidth: 150}}>
                        <InputLabel id="size-label">Размер</InputLabel>
                        <Select
                            labelId="size-label"
                            value={selectedSize}
                            onChange={handleSizeChange}
                            label="Размер"
                        >
                            <MenuItem value="S">S</MenuItem>
                            <MenuItem value="M">M</MenuItem>
                            <MenuItem value="L">L</MenuItem>
                            <MenuItem value="XL">XL</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography
                        variant="body1"
                        sx={{mt: 2, color: productPage.availability ? 'green' : 'red', fontWeight: 'bold'}}
                    >
                        {productPage.availability ? 'В наличии' : 'Нет в наличии'}
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{mt: 3, py: 1, px: 3, textTransform: 'none', fontSize: '1rem'}}
                        onClick={handleAddToCart}
                        disabled={!selectedSize}
                    >
                        Добавить в корзину
                    </Button>
                </Box>
            </Box>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 4 }}>
                    <Recommendations />
                </Box>
        </Box>
        </>
    );
};

export default ProductPage;
