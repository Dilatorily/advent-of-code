import { createConsola } from 'consola';

export const logger = createConsola({
  level: 3,
});

export const setQuietMode = (quiet: boolean): void => {
  logger.level = quiet ? 0 : 3;
};
