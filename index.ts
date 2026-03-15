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

type Status = 'active' | 'inactive' | 'new';

function getStatusColor(status: Status): string {
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

console.log(getStatusColor('active'));
console.log(getStatusColor('inactive')); 
console.log(getStatusColor('new'));

type StringFormatter = (input: string, uppercase?: boolean) => string;

const capitalizeFirst: StringFormatter = (input, uppercase = false) => {
    if (input.length === 0) return input;
    const result = input.charAt(0).toUpperCase() + input.slice(1);
    return result;
};

const trimAndUppercase: StringFormatter = (input: string, uppercase = false) => {
    const trimmed = input.trim();
    
    if (uppercase) {
        return trimmed.toUpperCase();
    }

    return trimmed;
}

console.log(capitalizeFirst('hello world'));     
console.log(capitalizeFirst('привет'));         
console.log(capitalizeFirst(''));              
console.log(capitalizeFirst('test', true));      

console.log(trimAndUppercase('  hello  '));       
console.log(trimAndUppercase('  hello  ', true)); 
console.log(trimAndUppercase('WORLD'));      
console.log(trimAndUppercase('  world  ', false)); 