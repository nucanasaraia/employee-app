export interface UserModel {
    id: number;
    username: string;
    role: 'Admin' | 'User';
}