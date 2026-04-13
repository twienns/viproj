export interface User {
    id: number;
    name: string;
    email?: string;
    isActive: boolean;
}

export function createUser(id: number, name: string, email?: string, isActive: boolean = true): User {
    return { id, name, email, isActive};
}

export type Genre = 'fiction' | 'non-fiction';

export interface Book {
    title: string;
    author: string;
    year?: number;
    genre: Genre;
}

export function createBook(book: Book): Book {
    return book;
}

export function calculateArea(shape: 'circle', radius: number): number;
export function calculateArea(shape: 'square', side: number): number;

export function calculateArea(shape: 'circle' | 'square', param: number): number{
    if (shape === 'circle') {
        return Math.PI * param * param;
    } else {
        return param * param;
    }
}

export type Status = 'active' | 'inactive' | 'new';

export function getStatusColor(status: Status): string {
    switch (status) {
        case 'active':
            return 'green';
        case 'inactive':
            return 'gray';
        case 'new':
            return 'blue';
        default:
            const _exhaustiveCheck: never = status;
            return _exhaustiveCheck;
    }
}

export type StringFormatter = (input: string, uppercase?: boolean) => string;

export const capitalizeFirst: StringFormatter = (input, uppercase = false) => {
    if (input.length === 0) return input;
    const result = input.charAt(0).toUpperCase() + input.slice(1);
    return result;
};

export const trimAndUppercase: StringFormatter = (input: string, uppercase = false) => {
    const trimmed = input.trim();
    
    if (uppercase) {
        return trimmed.toUpperCase();
    }

    return trimmed;
}

export function getFirstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

export interface HasId {
    id: number;
}

export function findById<T extends HasId>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}

export interface User1 extends HasId {
    name: string;
}

export interface Product extends HasId {
    title: string;
    price: number;
}
