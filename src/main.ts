#! /usr/bin/env node

import fse from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import { generateJestMock } from './generate-jest-mock';
import { logger } from './logger';

const run = async () => {
  const filenamesInCwd = await fse.readdir(process.cwd());
  const validFilenames = filenamesInCwd.filter(
    filename => filename.endsWith('.js') && !filename.endsWith('.mock.js')
  );

  if (!validFilenames.length) {
    logger.info(`No valid files found in "${process.cwd()}".`);
    process.exit(0);
  }

  const { selectedFilename } = await prompts({
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

  logger.debug(`Selected ${selectedFilename}`);

  await generateJestMock(path.join(process.cwd(), selectedFilename));
};

run();
