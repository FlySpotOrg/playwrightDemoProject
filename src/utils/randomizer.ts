export function getRandomDigits(len: number): number {
    const min = Math.pow(10, len - 1);
    const max = Math.pow(10, len) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}