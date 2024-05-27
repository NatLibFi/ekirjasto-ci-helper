import { exitCodes, reservedExitCodes } from "./exit-codes.js"

describe("exitCodes", () => {
  it("must be from 0 to 255", () => {
    for (const [_, value] of Object.entries(exitCodes)) {
      expect(value).toBeGreaterThanOrEqual(0)
      // Even 255 is reserved, but reserved values are checked separately
      expect(value).toBeLessThanOrEqual(255)
    }
  })
  it("should not contain \"reserved\" exit codes", () => {
    const values = Object.values(exitCodes)
    for (const reservedExitCode of Object.keys(reservedExitCodes)) {
      expect(values.includes(reservedExitCode)).toEqual(false)
    }
  })
  it("must not contain duplicate values", () => {
    // Create a set of the values, the size should remain the same
    const values = Object.values(exitCodes)
    expect((new Set(values)).size).toEqual(values.length)
  })
})
