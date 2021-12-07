
type DepthSummary = {
  increments: number,
  decrements: number,
}

const defaultSummary: DepthSummary = {
  increments: 0,
  decrements: 0,
}

export function parseDepthLog(log: string): DepthSummary {
  try {
    const stringReadings = log.split('\n').filter(Boolean)

    // validation can be done per reading prior to summarization if
    // upfront validation causes perf issues
    stringReadings.forEach((reading) => {
      if (isNumerical(reading)) {
        throw new ValidationError(ErrorScope.Sonar, 'Reading is not a valid number.')
      }
    });

    const readings = stringReadings.map(Number);

    const [initialReading] = readings;

    let prevReading = initialReading;

    return readings.reduce((summary, reading) => {
      const nextSummary = { ...summary };

      if (isGreater(reading, prevReading)) {
        nextSummary.increments = summary.increments + 1;
      } else if (isLesser(reading, prevReading)) {
        nextSummary.decrements = summary.decrements + 1;
      }

      prevReading = reading;

      return nextSummary;
    }, { ...defaultSummary });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ParsingError(ErrorScope.Sonar, error as Error)
  }
}

/**
 * numbers
 *********/
function isGreater(x: number, y: number): boolean {
  return x > y;
}

function isLesser(x: number, y: number): boolean {
  return x < y;
}

/**
 * strings
 *********/
function isNumerical(value: string): boolean {
  return !value.match(/^[0-9]*/)
}

/**
 * errors
 *********/
enum ErrorScope {
  Validation = 'VALIDATION',
  Sonar = 'SONAR',
}

type ErrorParts = {
  message: string
  scopes: Array<ErrorScope>
  originalError?: Error
}

class CustomError extends Error {
  message: string
  scopes: Array<ErrorScope>
  originalError: Error | null;

  constructor(parts: ErrorParts) {
    super(parts.message);

    this.message = parts.message;
    this.originalError = parts.originalError ?? null;
    this.scopes = parts.scopes;
  }
}

class ValidationError extends CustomError {
  constructor(scope: ErrorScope, message: string) {
    const parts = {
      message,
      scopes: [scope, ErrorScope.Validation]
    };

    super(parts);
  }
}

class ParsingError extends CustomError {
  constructor(scope: ErrorScope, originalError: Error) {
    const parts = {
      message: 'Error during parsing input.',
      scopes: [scope],
      originalError,
    }

    super(parts)
  }
}
