# generate-jest-mock

## Install

```bash
npm install -g github:lagerone/generate-jest-mock
```

## Usage

CD to a directory containing files you want to mock and run:

```bash
generate-jest-mock
```

Turns this

```js
// my-repository.js
return {
  getById,
  getAll,
};
```

into this:

```js
// my-repository.mock.js
const mock = {
  getById: jest.fn(),
  getAll: jest.fn(),
};

const beforeAll = () => {
  jest.mock('./my-repository', () => {
    return mock;
  });
};

const beforeEach = () => {
  mock.getById.mockImplementation(() => {
    // Enter default getById implementation here
    return undefined;
  });
  mock.getAll.mockImplementation(() => {
    // Enter default getAll implementation here
    return undefined;
  });
};

const afterEach = () => {
  mock.getById.mockReset();
  mock.getAll.mockReset();
};

module.exports = {
  beforeAll,
  beforeEach,
  afterEach,
  mock,
};
```

which you can utilize like this

```js
// my-service.test.js
const mockRepository = require('./my-repository.mock');

describe('my-service', () => {
  beforeAll(() => {
    mockRepository.beforeAll();
  });

  beforeEach(() => {
    mockRepository.beforeEach();
  });

  afterEach(() => {
    mockRepository.afterEach();
  });

  it('should ...', () => {
    // Arrange
    mockRepository.mock.getById.mockImplementation(() => {
      return Promise.resolve({ id: 'some-id' });
    });

    const myService = require('./my-service');

    // Act
    await myService.run();

    // Assert
    expect(mockRepository.mock.getById.mock.calls.length)
    .toEqual(1)
  });
});
```
