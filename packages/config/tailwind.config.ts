import type { Config } from "tailwindcss";


export default {
content: ["./apps/web/**/*.{ts,tsx}", "./packages/ui/src/**/*.{ts,tsx}"],
theme: { extend: {} },
plugins: []
} satisfies Config;