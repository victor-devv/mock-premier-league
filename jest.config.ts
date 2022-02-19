import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ['<rootDir>'],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testRegex: ["(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$"],
    collectCoverageFrom: [
        "**/*.{js,jsx,ts,tsx}",
        "!**/*.d.ts",
        "!**/node_modules/**",
    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json",
        },
    },
    modulePathIgnorePatterns: ["<rootDir>/database/"]
};
export default config;