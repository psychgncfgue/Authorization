import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store/store';
import { fetchCarouselRequest } from '../redux/actions/carouselActions';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Product } from '../interfaces/interfaces';

interface ProductCarouselProps {
    isAddedToFavorites: (productName: string) => boolean;
    isLoadingForProduct: (productName: string) => boolean;
    handleAddToFavorites: (product: Product) => void;
    openDialog: boolean;
    handleCloseDialog: () => void;
    handleGoToAuth: () => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
                                                             isAddedToFavorites,
                                                             isLoadingForProduct,
                                                             handleAddToFavorites,
                                                             openDialog,
                                                             handleCloseDialog,
                                                             handleGoToAuth,
                                                         }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, isLoadingCarousel } = useSelector((state: RootState) => state.carousel);

    useEffect(() => {
        dispatch(fetchCarouselRequest());
    }, [dispatch]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <Box sx={{ padding: 3, mb: 10, mt: 6 }}>
            {isLoadingCarousel ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Slider {...settings}>
                    {products.map(product => (
                        <div key={product.id} style={{ padding: '0 10px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                                <Link to={`/product/${product.name}/${product.size}`}>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={{
                                            width: '60%',
                                            borderRadius: '4px',
                                            display: 'block',
                                            maxWidth: '100%',
                                            margin: '0 auto',
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            m: 2,
                                            textAlign: 'center',
                                            maxHeight: '3rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {product.name}
                                    </Typography>
                                </Link>
                                {product.discount !== null && (
                                    <Typography>{`Скидка: ${product.discount}%`}</Typography>
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 3, ml: 7, mr: 7 }}>
                                    <Typography>{`Цена: ${product.price} руб.`}</Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleAddToFavorites(product)}
                                        disabled={isAddedToFavorites(product.name) || isLoadingForProduct(product.name)}
                                    >
                                        {isAddedToFavorites(product.name) ? (
                                            <CheckCircleIcon />
                                        ) : (
                                            isLoadingForProduct(product.name) ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : (
                                                <FavoriteBorderIcon />
                                            )
                                        )}
                                    </Button>

                                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                                        <DialogTitle>Необходима аутентификация</DialogTitle>
                                        <DialogContent>
                                            Войдите в учетную запись или зарегистрируйтесь для того, чтобы добавлять в избранное.
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
                                </Box>
                            </div>
                        </div>
                    ))}
                </Slider>
            )}
        </Box>
    );
};

export default ProductCarousel;