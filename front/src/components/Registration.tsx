import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface RegistrationFormData {
    username: string;
    email: string;
    password: string;
    countryCode: string;
    phone: string;
}

const countryCodes = {
    UA: '+380',
    RU: '+7',
};

const Registration: React.FC = () => {
    const [formData, setFormData] = useState<RegistrationFormData>({
        username: '',
        email: '',
        password: '',
        countryCode: countryCodes.UA,
        phone: '',
    });

    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleCountryChange = (e: SelectChangeEvent<string>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            countryCode: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/auth/register', formData);
            console.log('Registration Success:', response.data);


            navigate('/auth');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    console.error('Email или Username уже существуют');
                    setError('Email или Username уже существуют');
                } else {
                    console.error('Registration Error:', error.message);
                    setError('Registration Error: ' + error.message);
                }
            } else {
                console.error('Unexpected Error:', error);
                setError('Unexpected Error: ' + error);
            }
        }
    };

    const handleLoginRedirect = () => {
        navigate('/auth');
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
            />
            <FormControl fullWidth required margin="normal">
                <InputLabel id="countryCode-label">Country</InputLabel>
                <Select
                    labelId="countryCode-label"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleCountryChange}
                >
                    <MenuItem value={countryCodes.UA}>Ukraine (+380)</MenuItem>
                    <MenuItem value={countryCodes.RU}>Russia (+7)</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
                InputProps={{
                    startAdornment: <>{formData.countryCode}</>,
                }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Зарегистрироваться
            </Button>
            <Box sx={{ mt: 2 }}>
                <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleLoginRedirect}
                >
                    Есть аккаунт?
                </Button>
            </Box>
        </form>
    );
};

export default Registration;