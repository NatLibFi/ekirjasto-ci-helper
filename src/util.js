import fs from "fs"
import 'zx/globals'

import { exitCodes, reservedExitCodes } from './exit-codes.js'

/**
 * Exit the process with an exit code and a message.
 * @param {int} exitCode    Exit code to use (0 for success)
 * @param {string} message  (optional) Message to show on exit.
 */
export function exit(exitCode, message = null) {
  exitCode ??= exitCodes.SUCCESS

  if (Object.keys(reservedExitCodes).includes(String(exitCode))) {
    console.warn(`WARNING: Use of reserved exit code: ${exitCode}`)
  }

  if (message) {
    if (exitCode == 0) {
      console.log(message)
    } else {
      console.error(`ERROR: ${message}`)
    }
  }

  process.exit(exitCode)
}

/**
 * Check if a file exists.
 * @param {string} filepath Filepath to check.
 * @returns {bool} True if the file exists, false otherwise.
 */
export function fileExists(filepath) {
  return fs.existsSync(filepath)
}

/**
 * Get the size of a file.
 * @param {string} filepath Filepath to check.
 * @returns {int} The file's size in bytes, or -1 if size couldn't be retrieved.
 */
export function getFileSize(filepath) {
  return fs.statSync(filepath, {throwIfNoEntry: false})?.size || -1
}

/**
 * Read a file and parse it as JSON.
 * @param {string} filepath Filepath to read and parse as JSON.
 * @returns {*} The parsed JSON, or null on errors.
 */
export function readJSON(filepath) {
  try {
    const contents = fs.readFileSync(filepath, "utf8")
    return JSON.parse(contents)
  } catch (err) {
    console.error(`ERROR: Failed to parse file as JSON: ${filepath}\n`, err)
    return null
  }
}

/**
 * Reads content of the directory.
 * @param {string} filepath Path to check.
 * @returns {string[]} List of filenames in the directory.
 */
export function readDir(filepath) {
  return fs.readdirSync(filepath)
}
