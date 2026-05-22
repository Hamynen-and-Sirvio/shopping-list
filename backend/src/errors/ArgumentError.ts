export default class ArgumentError extends Error {
  argumentName
  expectedValue
  valueReceived

  constructor(
    argumentName: string,
    expectedValue: string,
    valueReceived: string,
  ) {
    super(
      `Invalid value for argument '${argumentName}' ` +
      `(expected it to be ${expectedValue}, got ${valueReceived})`
    )
    this.name = 'ArgumentError'
    this.argumentName = argumentName
    this.expectedValue = expectedValue
    this.valueReceived = valueReceived
  }
}
