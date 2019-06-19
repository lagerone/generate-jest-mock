#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const prompts_1 = __importDefault(require("prompts"));
const generate_jest_mock_1 = require("./generate-jest-mock");
const logger_1 = require("./logger");
const run = async () => {
    const filenamesInCwd = await fs_extra_1.default.readdir(process.cwd());
    const validFilenames = filenamesInCwd.filter(filename => filename.endsWith('.js') && !filename.endsWith('.mock.js'));
    if (!validFilenames.length) {
        logger_1.logger.info(`No valid files found in "${process.cwd()}".`);
        process.exit(0);
    }
    const { selectedFilename } = await prompts_1.default({
        name: 'selectedFilename',
        message: 'Select file to mock',
        type: 'autocomplete',
        choices: validFilenames.map(file => {
            return {
                title: file,
                value: file,
            };
        }),
    });
    if (!selectedFilename) {
        process.exit(0);
    }
    logger_1.logger.debug(`Selected ${selectedFilename}`);
    await generate_jest_mock_1.generateJestMock(path_1.default.join(process.cwd(), selectedFilename));
};
run();
