import { comparePassword } from '@helpers/bcrypt';
import { UserService } from '@services/UserService';
import jwt from 'jsonwebtoken';

import { JWT_KEYS, TOKEN_EXPIRY } from '@/config';

export type DecodedPayload = {
    userId: string;
    email: string;
    roles: string[];
    [key: string]: unknown;
};

type TokenType = 'access' | 'refresh';

export class AuthService {
    private static instance: AuthService;
    private readonly userService = UserService.initialize();

    public static initialize() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async validateLogin(email: string, password: string) {
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            return null;
        }

        const isHashedPassword = user.password.startsWith('$2');
        const isPasswordValid = isHashedPassword ? await comparePassword(password, user.password) : password === user.password;

        if (!isPasswordValid) {
            return null;
        }

        return {
            userId: user.id,
            email: user.email,
            roles: user.roles || ['user'],
        };
    }

    public async signJwt(payload: DecodedPayload, type: TokenType, expiration: `${number}${'d' | 'h' | 'm' | 's'}`): Promise<string> {
        const secret = JWT_KEYS[type];
        return new Promise((resolve, reject) => {
            jwt.sign(payload, secret, { expiresIn: expiration, algorithm: 'HS256' }, (err, token) => {
                if (err || !token) {
                    return reject(err);
                }
                resolve(token);
            });
        });
    }

    public async verifyJwt(token: string, type: TokenType): Promise<DecodedPayload> {
        const secret = JWT_KEYS[type];
        return jwt.verify(token, secret) as DecodedPayload;
    }

    public async generateToken(userId: string, email: string, roles: string[]) {
        const payload: DecodedPayload = { userId, email, roles };
        const [accessToken, refreshToken] = await Promise.all([this.signJwt(payload, 'access', TOKEN_EXPIRY.access), this.signJwt(payload, 'refresh', TOKEN_EXPIRY.refresh)]);
        return [accessToken, refreshToken] as const;
    }
}
