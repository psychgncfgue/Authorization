import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterDto } from '../auth/register.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findByEmailOrUsername(email: string, username: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: [
                { email },
                { username },
            ],
        });
    }

    async findById(id: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id } });
    }

    async create(registerDto: RegisterDto): Promise<User> {
        const user = this.userRepository.create(registerDto);
        return this.userRepository.save(user);
    }
}