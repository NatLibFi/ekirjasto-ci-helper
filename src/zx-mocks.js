/**
 * Flatten an array of arrays.
 * @param {array<*>} array Array to flatten
 * @returns {array<*>} Flattened array.
 */
export function flattenArray(array) {
  return array.reduce(
    (flat, toFlatten) => flat.concat(
      Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten
    ),
    []
  )
}

/**
 * Get a zx command as a string from zx call arguments.
 * @param {*} args Arguments to a zx call.
 * @returns {string} The zx command as a string.
 */
export function getZxCommand(args) {
  return flattenArray(args).join("")
}

/**
 * Simple class to mock zx calls when testing with Jest.
 */
export class MockZxOutput {
  constructor(props = {}) {
    this.stdout = props.stdout || ""
  }

  quiet() {
    return this
  }
}
