module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '!<rootDir>/tests/**/*.ts',
    '!<rootDir>/src/shared/infra/factories',
    '<rootDir>/src/**/*.ts'
  ],
  coverageProvider: 'v8',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
