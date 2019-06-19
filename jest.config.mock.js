const mock = {
  moduleFileExtensions: jest.fn(),
  transform: jest.fn(),
  globals: jest.fn(),
  testMatch: jest.fn(),
  testPathIgnorePatterns: jest.fn(),
};

const beforeAll = () => {
  jest.mock('./jest.config', () => {
    return mock;
  });
};

const beforeEach = () => {
  mock.moduleFileExtensions.mockImplementation(() => {
    // Enter default moduleFileExtensions implementation here
    return null;
  });
  mock.transform.mockImplementation(() => {
    // Enter default transform implementation here
    return null;
  });
  mock.globals.mockImplementation(() => {
    // Enter default globals implementation here
    return null;
  });
  mock.testMatch.mockImplementation(() => {
    // Enter default testMatch implementation here
    return null;
  });
  mock.testPathIgnorePatterns.mockImplementation(() => {
    // Enter default testPathIgnorePatterns implementation here
    return null;
  });
};

const afterEach = () => {
  mock.moduleFileExtensions.mockReset();
  mock.transform.mockReset();
  mock.globals.mockReset();
  mock.testMatch.mockReset();
  mock.testPathIgnorePatterns.mockReset();
};

module.exports = {
  beforeAll,
  beforeEach,
  afterEach,
  mock,
};
