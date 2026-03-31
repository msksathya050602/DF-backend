import { User } from '@/entities/User';

type CreateUserPayload = {
    userName: string;
    email: string;
    password: string;
    roles?: string[];
};

export class UserService {
    private static instance: UserService;

    public static initialize() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    public async createUser({ userName, email, password, roles = ['user'] }: CreateUserPayload) {
        const normalizedEmail = email.trim().toLowerCase();
        return User.create({
            userName: userName.trim(),
            email: normalizedEmail,
            password,
            roles,
            isActive: true,
        }).save();
    }

    public async getUserByEmail(email: string) {
        return User.findOne({
            where: {
                email: email.trim().toLowerCase(),
                isActive: true,
            },
        });
    }

    public async getUserById(userId: string) {
        return User.findOne({
            where: {
                id: userId,
                isActive: true,
            },
        });
    }
}
