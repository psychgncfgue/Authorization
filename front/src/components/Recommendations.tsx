import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store/store';
import { fetchRecommendationsRequest } from '../redux/actions/recommendationsActions';
import { Product } from '../interfaces/interfaces';


const Recommendations: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { recommendations, isLoadingRecommendations } = useSelector((state: RootState) => state.recommendations);

    useEffect(() => {
        dispatch(fetchRecommendationsRequest());
    }, [dispatch]);

    return (
        <Box sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h6" gutterBottom>
                Вам также может понравиться
            </Typography>
            {isLoadingRecommendations ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {recommendations.map((product: Product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                            <Link to={`/product/${product.name}/${product.size}`} style={{ textDecoration: 'none' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            borderRadius: '4px',
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <Typography sx={{ mt: 1 }}>{product.name}</Typography>
                                    <Typography>{`Цена: ${product.price} руб.`}</Typography>
                                    {product.discount && (
                                        <Typography sx={{ color: 'red' }}>{`Скидка: ${product.discount}%`}</Typography>
                                    )}
                                </Box>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Recommendations;