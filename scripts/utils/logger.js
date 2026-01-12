'use strict';

/**
 * Logger utility for standardized console output.
 * Provides methods for info, warning, error, and debug messages.
 *
 * @module logger
 */
export const logger = {
  /**
   * Logs informational messages.
   * @param {string} msg - Message text.
   * @param {...any} args - Additional arguments to log.
   */
  info: (msg, ...args) => console.info(`[INFO] ${msg}`, ...args),

  /**
   * Logs warning messages.
   * @param {string} msg - Message text.
   * @param {...any} args - Additional arguments to log.
   */
  warn: (msg, ...args) => console.warn(`[WARN] ${msg}`, ...args),

  /**
   * Logs error messages.
   * @param {string} msg - Message text.
   * @param {...any} args - Additional arguments to log.
   */
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),

  // TODO: Удалить после включения проекта в Vite   !!!!!!!

  /**
   * Logs debug messages (development use).
   * To be replaced with environment‑based conditional logging when integrated with Vite.
   * @param {string} msg - Message text.
   * @param {...any} args - Additional arguments to log.
   */
  debug: (msg, ...args) => {
    console.debug(`[DEBUG] ${msg}`, ...args);
  },

  // //Заменить на этот после включения проекта в Vite
  // debug: (msg, ...args) => {
  //   if (import.meta.env.MODE === 'development') {
  //     console.debug(`[DEBUG] ${msg}`, ...args);
  //   }
  // },
};
