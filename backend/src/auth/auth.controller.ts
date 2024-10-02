import {Controller, Post, Body, Request, UseGuards, Res, Req, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterDto } from './register.dto';
import { Response, Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    private setCookies(res: Response, accessToken: string, refreshToken: string) {
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 1000, // 30 секунд для access_token
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней для refresh_token
        });
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
        const { access_token, refresh_token, user } = await this.authService.register(registerDto);
        this.setCookies(res, access_token, refresh_token);

        return res.send({
            username: user.username,
            email: user.email,
        });
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: ExpressRequest, @Res() res: Response) {
        const { access_token, refresh_token, user } = await this.authService.login(req.user);
        this.setCookies(res, access_token, refresh_token);

        return res.send({
            username: user.username,
            email: user.email,
        });
    }

    @Post('refresh')
    async refresh(@Req() req: ExpressRequest, @Res() res: Response) {
        const refreshToken = req.cookies.refreshToken; // Получаем refreshToken из cookies

        if (!refreshToken) {
            return res.status(400).send({ error: 'No refresh token found' });
        }

        try {
            const newAccessToken = await this.authService.refreshToken(refreshToken);
            this.setCookies(res, newAccessToken, refreshToken);

            return res.send({ message: 'Access token обновлен' });
        } catch (error) {
            console.error('Error refreshing token:', error);
            return res.status(401).send({ error: 'Invalid refresh token' });
        }
    }

    @Post('logout')
    async logout(@Body() body: { refreshToken: string }, @Res() res: Response) {
        await this.authService.logout(body.refreshToken);

        // Очищаем cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return res.send({ message: 'Successfully logged out' });
    }

    @Get('check')
    async checkAuth(@Req() req: ExpressRequest, @Res() res: Response) {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken && !refreshToken) {
            return res.status(401).send({ error: 'No tokens found' });
        }

        try {
            const isAccessTokenValid = await this.authService.verifyAccessToken(accessToken);

            if (isAccessTokenValid) {
                return res.send({ accessToken, isAuthenticated: true });
            } else if (refreshToken) {
                const newAccessToken = await this.authService.refreshToken(refreshToken);
                if (newAccessToken) {
                    this.setCookies(res, newAccessToken, refreshToken);
                    return res.send({ accessToken: newAccessToken, isAuthenticated: true });
                } else {
                    return res.status(401).send({ error: 'Failed to refresh access token' });
                }
            } else {
                return res.status(401).send({ error: 'Access token is invalid, and no refresh token found' });
            }
        } catch (error) {
            return res.status(401).send({ error: 'Error verifying token', details: error.message });
        }
    }
}