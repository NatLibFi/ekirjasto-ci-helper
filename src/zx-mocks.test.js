import { flattenArray, getZxCommand, MockZxOutput } from './zx-mocks.js'

// Unit testing for unit testing helpers, this is pretty meta...

describe("flattenArray()", () => {
  it("should flatten an array of arrays", async () => {
    expect(flattenArray(["a", ["b", "c"]])).toEqual(["a", "b", "c"])
  })
})

describe("getZxCommand()", () => {
  it("should return the given zx call input as a string", async () => {
    expect(getZxCommand(["a", ["b", "c"]])).toEqual("abc")
  })
})

describe("MockZxOutput", () => {
  it("should have reasonable defaults", async () => {
    const mockZxOutput = new MockZxOutput()
    expect(mockZxOutput.stdout).toEqual("")
  })
  it("should allow setting common zx properties", async () => {
    const mockZxOutput = new MockZxOutput({
      stdout: "test output"
    })
    expect(mockZxOutput.stdout).toEqual("test output")
  })
  it("quiet() should be a no-op, which returns the object", async () => {
    const mockZxOutput = new MockZxOutput()
    const newMockZxOutput = mockZxOutput.quiet()
    expect(mockZxOutput).toEqual(newMockZxOutput)
  })
})
