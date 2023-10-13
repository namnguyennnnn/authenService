import { hash, compare } from 'bcrypt';

const salt = 10;

const Hashing = {
  hash: (content: string) => hash(content, salt),
  compare: (content: string, hashedContent: string) =>
    compare(content, hashedContent),
};

export { Hashing };
