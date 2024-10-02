import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh.token.entity';

@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
    ) {}

    async create(userId: string, token: string): Promise<RefreshToken> {
        const refreshToken = this.refreshTokenRepository.create({ userId, token });
        return this.refreshTokenRepository.save(refreshToken);
    }

    async findByToken(token: string): Promise<RefreshToken | undefined> {
        return this.refreshTokenRepository.findOne({ where: { token } });
    }

    async deleteByToken(token: string): Promise<void> {
        await this.refreshTokenRepository.delete({ token });
    }
}