export interface User {
  id: number;
  name: string;
  email?: string;
  isActive: boolean;
}

export function createUser(
  id: number,
  name: string,
  email?: string,
  isActive: boolean = true
): User {
  return { id, name, email, isActive };
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
export function calculateArea(shape: 'circle' | 'square', size: number): number {
  if (shape === 'circle') {
    return Math.PI * size * size;
  } else {
    return size * size;
  }
}

export type Status = 'active' | 'inactive' | 'new';

export function getStatusColor(status: Status): string {
  switch (status) {
    case 'active':
      return 'green';
    case 'inactive':
      return 'red';
    case 'new':
      return 'blue';
    default:
      const _exhaustiveCheck: never = status;
      return _exhaustiveCheck;
  }
}

export type StringFormatter = (input: string, uppercase?: boolean) => string;

export const capitalizeFirst: StringFormatter = (input, uppercase = false) => {
  let result = input.charAt(0).toUpperCase() + input.slice(1);
  if (uppercase) {
    result = result.toUpperCase();
  }
  return result;
};

export const trimAndUpperCase: StringFormatter = (input, uppercase = false) => {
  let result = input.trim();
  if (uppercase) {
    result = result.toUpperCase();
  }
  return result;
};

export function getFirstElement<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

export interface HasId {
  id: number;
}

export function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}