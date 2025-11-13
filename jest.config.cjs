module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: [
        "jest-localstorage-mock",
        "<rootDir>/src/tests/setupTests.js"
    ],
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
};