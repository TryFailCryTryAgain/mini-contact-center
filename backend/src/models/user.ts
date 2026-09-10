export interface User {
    id: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
}

export type PublicUser = Omit<User, 'passwordHash'>;

export function toPublicUser(user: User): PublicUser {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
}

