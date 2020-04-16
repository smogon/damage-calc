declare global {
    namespace jest {
        interface Matchers<R, T> {
            toBeRange(a: number, b: number): R;
        }
    }
}
export {};
