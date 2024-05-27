import { jest } from "@jest/globals";

import fs from "fs"

import { exitCodes } from "./exit-codes.js"
import {
  exit,
  fileExists,
  getFileSize,
  readJSON,
  readDir,
} from "./util.js"
//import { getZxCommand, MockZxOutput } from "./zx-mocks.js"

describe("exit()", () => {
  const mockProcessExit = jest.spyOn(process, "exit").mockImplementation(() => {})
  const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {})
  const mockConsoleWarn = jest.spyOn(console, "warn").mockImplementation(() => {})
  const mockConsoleError = jest.spyOn(console, "error").mockImplementation(() => {})

  it("should call process.exit() with the given exit code", () => {
    exit(exitCodes.SUCCESS)
    expect(mockProcessExit).toHaveBeenCalledWith(exitCodes.SUCCESS)
    exit(123)
    expect(mockProcessExit).toHaveBeenCalledWith(123)
  })
  it("should default to exit code 0", () => {
    exit()
    expect(mockProcessExit).toHaveBeenCalledWith(0)
  })
  it("should not output anything if no message is given", () => {
    exit(exitCodes.SUCCESS)
    expect(mockConsoleLog).not.toHaveBeenCalled()
    expect(mockConsoleError).not.toHaveBeenCalled()
    exit(exitCodes.ERROR_GENERIC)
    expect(mockConsoleLog).not.toHaveBeenCalled()
    expect(mockConsoleError).not.toHaveBeenCalled()
  })
  it("should print warning if using a \"reserved\" exit code", () => {
    exit(exitCodes.SUCCESS)
    expect(mockConsoleWarn).not.toHaveBeenCalled()
    exit(exitCodes.ERROR_GENERIC)
    expect(mockConsoleWarn).not.toHaveBeenCalled()
    exit(128)
    expect(mockConsoleWarn).toHaveBeenCalled()
  })
  it("should output regular message (if given) with exit code 0", () => {
    exit(exitCodes.SUCCESS, "message")
    expect(mockConsoleLog).toHaveBeenCalledWith("message")
    expect(mockConsoleError).not.toHaveBeenCalled()
  })
  it("should output error message with prefix (if given) with non-zero exit code", () => {
    exit(exitCodes.ERROR_GENERIC, "message")
    expect(mockConsoleError).toHaveBeenCalledWith("ERROR: message")
    expect(mockConsoleLog).not.toHaveBeenCalled()
  })
})

describe("fileExists()", () => {
  it("should return true for an existing file", () => {
    expect(fileExists("./src/util.test.js")).toEqual(true)
  })
  it("should return false for a non-existing file", () => {
    expect(fileExists("./non-existing-file.txt")).toEqual(false)
  })
})

describe("getFileSize()", () => {
  it("should get the file size of an existing file", () => {
    expect(getFileSize("./src/util.test.js")).toBeGreaterThan(0)
  })
  it("should return -1 for a non-existing file", () => {
    expect(getFileSize("./non-existing-file.txt")).toEqual(-1)
  })
})

describe("readJSON()", () => {
  // Mock file reads (assume that NodeJS fs library works fine, don't test that)
  const mockReadFileSync = jest.spyOn(fs, "readFileSync").mockImplementation(
    (filepath) => {
      if (filepath == "example01.json") {
        return "{}"
      }
      else if (filepath == "example02.json") {
        return `{"example": "testing"}`
      }
      else if (filepath == "invalid.json") {
        return `{"example": "testing`
      }
      else {
        throw "Exception from unit test"
      }
    }
  )

  it("should return parsed JSON from a given file", async () => {
    const parsedExample01 = readJSON("example01.json")
    expect(mockReadFileSync).toHaveBeenCalled()
    expect(parsedExample01).toEqual({})
    const parsedExample02 = readJSON("example02.json")
    expect(mockReadFileSync).toHaveBeenCalled()
    expect(parsedExample02).toEqual({"example": "testing"})
  })

  it("should return null if the file is not found or cannot be parsed", async () => {
    const parsedNonExisting = readJSON("non-existing-file.json")
    expect(mockReadFileSync).toHaveBeenCalled()
    expect(parsedNonExisting).toEqual(null)
    const parsedInvalid = readJSON("non-existing-file.json")
    expect(mockReadFileSync).toHaveBeenCalled()
    expect(parsedInvalid).toEqual(null)
  })
})

describe("readDir()", () => {
  jest.spyOn(fs, "readdirSync").mockImplementation(
    (filepath) => {
      if (filepath == "parent") {
        return ["path1", "path2"]
      }
      else if (filepath == "empty") {
        return []
      }
      else {
        throw "Exception from unit test"
      }
    }
  )

  it("should return list of paths", () => {
    expect(readDir("parent")).toEqual(["path1", "path2"])
  })
  it("should return empty list", () => {
    expect(readDir("empty")).toEqual([])
  })
})
