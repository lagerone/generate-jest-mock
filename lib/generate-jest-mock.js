"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("./logger");
const renderDefaultMockImplementations = (functionNames) => {
    return functionNames
        .map(fname => {
        return `mock.${fname}.mockImplementation(() => {
    // Enter default ${fname} implementation here
    return null;
  });`;
    })
        .join('\n  ');
};
const renderMockResets = (functionNames) => {
    return functionNames
        .map(fname => {
        return `mock.${fname}.mockReset();`;
    })
        .join('\n  ');
};
const renderMockFunctions = (functionNames) => {
    return functionNames
        .map(fname => {
        return `${fname}: jest.fn()`;
    })
        .join(`,\n  `);
};
exports.generateJestMock = async (sourcePath) => {
    logger_1.logger.debug(`Generating jest mock for source "${sourcePath}"...`);
    const input = require(sourcePath);
    const functionNames = Object.keys(input);
    const sourceFileName = path_1.default.parse(path_1.default.basename(sourcePath)).name;
    const outputFilePath = path_1.default.join(path_1.default.dirname(sourcePath), `${sourceFileName}.mock.js`);
    const outputFileExists = await fs_extra_1.default.pathExists(outputFilePath);
    if (outputFileExists) {
        logger_1.logger.warn(`File at "${outputFilePath}" already exists.`);
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
    await fs_extra_1.default.outputFile(outputFilePath, fileContent);
    logger_1.logger.info(`Successfully created mock file at "${outputFilePath}".`);
};
