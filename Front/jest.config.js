module.exports = { 
displayName: 'Radio', 
maxWorkers: 3, 
bail: false,//stop when fail 
preset: 'jest-preset-angular', 
roots: ['<rootDir>/src/',], 
testMatch: ['**/+(*.)+(spec).+(ts)'], 
setupFilesAfterEnv: ['<rootDir>/src/test.ts'], 
collectCoverage: false, 
cacheDirectory: '<rootDir>/jestCache', 
coverageReporters: ['text-summary', 'lcov'], 
coverageDirectory: 'coverage/Radio', 
globals: { 
  'ts-jest': { 
    tsconfig: '<rootDir>/tsconfig.spec.json', 
    }, 
  }, 
}; 
