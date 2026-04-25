export class DevTools {
    static chooseRandom<T>(data: T[]): T {
        const min = 0;
        const max = data.length - 1;
        const idx = Math.floor(Math.random() * (max - min + 1)) + min;
        return data[idx];
    }
}