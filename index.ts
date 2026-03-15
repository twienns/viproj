interface User {
    id: number;
    name: string;
    email?: string;
    isActive: boolean;
}

function createUser(id: number, name: string, email?: string, isActive: boolean = true): User {
    return { id, name, email, isActive};
}

type Genre = 'fiction' | 'non-fiction';

interface Book {
    title: string;
    author: string;
    year?: number;
    genre: Genre;
}

function creatBook(book: Book): Book {
    return book;
}

const book1: Book = {
    title: 'Colorless Tsukuru Tazaki and His Years of Wandering',
    author: 'Haruki Murakami',
    genre: 'non-fiction',
};

console.log(creatBook(book1));

function calculateArea(shape: 'circle', radius: number): number;
function calculateArea(shape: 'square', side: number): number;

function calculateArea(shape: 'circle' | 'square', param: number): number{
    if (shape === 'circle') {
        return Math.PI * param * param;
    } else {
        return param * param;
    }
}

console.log(calculateArea('circle', 5));
console.log(calculateArea('square', 4));