export const log = (...args: unknown[]) => {
// small shared logger (can be swapped for pino later)
// eslint-disable-next-line no-console
console.log("[repo]", ...args);
};