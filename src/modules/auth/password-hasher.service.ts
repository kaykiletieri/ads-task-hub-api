import { Logger } from '@nestjs/common';
import * as argon2 from 'argon2';

export class PasswordHasherService {
    private readonly logger = new Logger(PasswordHasherService.name);

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        this.logger.debug(`Verifying password`);
        try {
            return await argon2.verify(hashedPassword, password);
        } catch (error) {
            this.logger.error('Error verifying password', error);
            return false;
        }
    }

    async hashPassword(password: string): Promise<string> {
        this.logger.debug(`Hashing password`);
        try {
            return await argon2.hash(password);
        } catch (error) {
            this.logger.error('Error hashing password', error);
            throw new Error('Error hashing password');
        }
    }
}