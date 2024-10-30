import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    List,
    Divider,
    CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store/store';
import { removeFromCart, clearCart, fetchCart, checkQuantity } from '../redux/actions/cartActions';
import { CartItem, ProductData } from "../interfaces/interfaces";
import { updateQuantity } from "../redux/reducers/cartSlice";

const convertCartItemToProductData = (item: CartItem): ProductData => ({
    name: item.product.name,
    category: item.product.category,
    collection: item.product.collection,
    gender: item.product.gender,
    size: item.product.size,
});

const Cart: React.FC = () => {
    const userId = useSelector((state: RootState) => state.auth.userId);
    const dispatch = useDispatch<AppDispatch>();
    const { cartItems, isLoadingCart, isLoadingAddToCart } = useSelector((state: RootState) => state.cart);

    useEffect(() => {
        if (userId) {
            dispatch(fetchCart(userId)); 
        }
    }, [userId, dispatch]);

    useEffect(() => {
        if (cartItems.length > 0) {
            const productDataArray = cartItems.map(convertCartItemToProductData);
            dispatch(checkQuantity(userId!, productDataArray, cartItems));
        }
    }, [cartItems.length, userId, dispatch]);

    const handleRemoveItem = (productId: number) => {
        dispatch(removeFromCart(userId!, productId));
    };

    const handleClearCart = () => {
        dispatch(clearCart(userId!));
    };

    const handleQuantityChange = (item: CartItem, change: number) => {
        const newQuantity = item.quantity + change;

        if (newQuantity >= 1) {
            dispatch(updateQuantity({ id: item.id, change }));
            dispatch(checkQuantity(userId!, [convertCartItemToProductData(item)], cartItems));
        }
    };

    return (
        <Box sx={{ p: 4, position: 'relative' }}>
            <Typography variant="h4" gutterBottom>
                Корзина
            </Typography>

            {isLoadingCart ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {cartItems.length > 0 ? (
                        <>
                            <List>
                                {cartItems.map((item) => (
                                    <Card key={item.id} sx={{ mb: 2, display: 'flex' }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 150 }}
                                            image={item.product.imageUrl}
                                            alt={item.product.name}
                                        />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <CardContent>
                                                <Typography variant="h6">{item.product.name}</Typography>
                                                <Typography variant="body1">{`Цена: ${item.product.price} руб.`}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {`Размер: ${item.product.size}`}
                                                </Typography>

                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <Button
                                                        onClick={() => handleQuantityChange(item, -1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </Button>
                                                    <Typography variant="body1" sx={{ mx: 2 }}>
                                                        {item.quantity}
                                                    </Typography>
                                                    <Button onClick={() => handleQuantityChange(item, 1)}>
                                                        +
                                                    </Button>
                                                </Box>

                                                {item.quantity <= item.totalQuantity ? (
                                                    <Typography variant="body2" color="green">
                                                        В наличии: {item.totalQuantity}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="body2" color="red">
                                                        Выбранное количество не в наличии
                                                    </Typography>
                                                )}
                                            </CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                                                <IconButton
                                                    edge="end"
                                                    color="error"
                                                    onClick={() => handleRemoveItem(item.product.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Card>
                                ))}
                            </List>
                            <Divider sx={{ my: 2 }} />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClearCart}
                                disabled={isLoadingCart}
                            >
                                Очистить корзину
                            </Button>
                        </>
                    ) : (
                        <Typography variant="body1" color="text.secondary">
                            Ваша корзина пуста.
                        </Typography>
                    )}
                </>
            )}

            {isLoadingAddToCart && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
};

export default Cart;