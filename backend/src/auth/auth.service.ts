import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './register.dto';
import { RefreshTokenService } from '../refreshTokens/refresh.token.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private refreshTokenService: RefreshTokenService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '30s' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    
        await this.refreshTokenService.create(user.id, refreshToken);
    
        return {
          access_token: accessToken,
          refresh_token: refreshToken,
          user,
        };
      }
    
      async refreshToken(refreshToken: string) {
        try {
          const decoded = this.jwtService.verify(refreshToken);
          const user = await this.userService.findById(decoded.sub);
    
          if (!user || !(await this.refreshTokenService.validate(user.id, refreshToken))) {
            throw new NotFoundException('User not found or invalid refresh token');
          }
    
          return this.jwtService.sign({ email: user.email, sub: user.id }, { expiresIn: '30s' });
        } catch (e) {
          throw new BadRequestException('Invalid refresh token');
        }
      }

    async register(registerDto: RegisterDto) {
        const { email, username } = registerDto;

        const existingUser = await this.userService.findByEmailOrUsername(email, username);
        if (existingUser) {
            throw new ConflictException('Email или Username уже существуют');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.userService.create({
            ...registerDto,
            password: hashedPassword,
        });

        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '30s' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        await this.refreshTokenService.create(user.id, refreshToken);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user,
        };
    }

    async logout(refreshToken: string) {
        const decoded = this.jwtService.decode(refreshToken) as { sub: string };
        if (decoded && decoded.sub) {
          await this.refreshTokenService.delete(decoded.sub);
        }
      }

    async verifyAccessToken(accessToken: string): Promise<boolean> {
        try {
            const decoded = this.jwtService.verify(accessToken);
            const user = await this.userService.findById(decoded.sub);

            if (!user) {
                return false;
            }

            return true;
        } catch (e) {
            return false;
        }
    }

    async getUserFromAccessToken(accessToken: string) {
        const decoded = this.jwtService.verify(accessToken);
        const user = await this.userService.findById(decoded.sub);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
}