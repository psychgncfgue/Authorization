import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly redisService: RedisService) {}

  async create(userId: string, token: string): Promise<void> {
    const hashedToken = await bcrypt.hash(token, 10);
    const redisKey = `refresh_token:${userId}`;

    await this.redisService.set(redisKey, hashedToken, 7 * 24 * 60 * 60);
  }

  async validate(userId: string, token: string): Promise<boolean> {
    const redisKey = `refresh_token:${userId}`;
    const storedToken = await this.redisService.get(redisKey);

    if (!storedToken) {
      return false;
    }

    return await bcrypt.compare(token, storedToken);
  }

  async delete(userId: string): Promise<void> {
    const redisKey = `refresh_token:${userId}`;
    await this.redisService.del(redisKey);
  }
}