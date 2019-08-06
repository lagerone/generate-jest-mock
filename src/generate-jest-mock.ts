import fse from 'fs-extra';
import path from 'path';
import { logger } from './logger';

const renderDefaultMockImplementations = (functionNames: string[]) => {
  return functionNames
    .map(fname => {
      return `mock.${fname}.mockImplementation(() => {
    // Enter default ${fname} implementation here
    return undefined;
  });`;
    })
    .join('\n  ');
};
const renderMockResets = (functionNames: string[]) => {
  return functionNames
    .map(fname => {
      return `mock.${fname}.mockReset();`;
    })
    .join('\n  ');
};

const renderMockFunctions = (functionNames: string[]) => {
  return functionNames
    .map(fname => {
      return `${fname}: jest.fn()`;
    })
    .join(`,\n  `);
};

export const generateJestMock = async (sourcePath: string) => {
  logger.debug(`Generating jest mock for source "${sourcePath}"...`);

  let input: any;
  try {
    input = await import(sourcePath);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
  const functionNames = Object.keys(input);
  const sourceFileName = path.parse(path.basename(sourcePath)).name;
  const outputFilePath = path.join(
    path.dirname(sourcePath),
    `${sourceFileName}.mock${path.extname(sourcePath)}`
  );

  const outputFileExists = await fse.pathExists(outputFilePath);

  if (outputFileExists) {
    logger.warn(`File at "${outputFilePath}" already exists.`);
    return;
  }

  const fileContent = `const mock = {
  ${renderMockFunctions(functionNames)},
};

const beforeAll = () => {
  jest.mock('./${sourceFileName}', () => {
    return mock;
  });
};

const beforeEach = () => {
  ${renderDefaultMockImplementations(functionNames)}
};

const afterEach = () => {
  ${renderMockResets(functionNames)}
};

module.exports = {
  beforeAll,
  beforeEach,
  afterEach,
  mock,
};
`;

  await fse.outputFile(outputFilePath, fileContent);

  logger.info(`Successfully created mock file at "${outputFilePath}".`);
};
