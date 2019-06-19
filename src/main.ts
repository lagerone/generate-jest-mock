#! /usr/bin/env node

import fse from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import { generateJestMock } from './generate-jest-mock';
import { logger } from './logger';

const JEST_MOCK_SUFFIX = 'mock';

const run = async () => {
  const filenamesInCwd = await fse.readdir(process.cwd());
  const validFiles = filenamesInCwd.filter(filename =>
    filename.endsWith('.js')
  );

  if (!validFiles.length) {
    logger.info(`No valid files found in "${process.cwd()}".`);
    process.exit(0);
  }

  const { selectedFilename } = await prompts({
    name: 'selectedFilename',
    message: 'Select file to mock',
    type: 'select',
    choices: validFiles.map(filename => {
      return {
        title: `${filename}`,
        value: filename,
        disabled: filename.endsWith(`.${JEST_MOCK_SUFFIX}.js`),
      };
    }),
  });

  if (!selectedFilename) {
    process.exit(0);
  }

  logger.debug(`Selected ${selectedFilename}`);

  await generateJestMock(path.join(process.cwd(), selectedFilename));
};

run();
