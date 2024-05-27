/**
 * Exit codes to use with exit() / process.exit() (must be between 0-255).
 *
 * It would be nice to have these in util.js, but Jest doesn't support partial
 * mocking of ES modules, so it's easier to have these here.
 */
export const exitCodes = {
  SUCCESS: 0,
  ERROR_GENERIC: 1,

  ERROR_DEPENDENCY_NOT_FOUND: 3,
  ERROR_INVALID_ARGUMENT: 4,
  ERROR_FILESYSTEM: 5,

  ERROR_GITHUB_TOKEN_REQUIRED: 64,
}

// Make a quick and dirty map of signal exit codes (SIGHUP, SIGINT, etc.)
let signalExitCodes = {}
for (let signalExitCode = 129; signalExitCode <= 165; ++signalExitCode) {
  signalExitCodes[signalExitCode] = "Signal exit code"
}

/**
 * List of reserved exit codes (do not use these).
 *
 * See: https://tldp.org/LDP/abs/html/exitcodes.html
 */
export const reservedExitCodes = {
  2: "Misuse of shell built-ins",
  126: "Command invoked cannot execute",
  127: "Command not found",
  128: "Invalid argument to exit",
  ...signalExitCodes,
  255: "Exit status out of range",
}
