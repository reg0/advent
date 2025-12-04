import { StdinReader } from "./loop";

class InvalidRangeChecker extends StdinReader {
  private totalSum: number = 0;

  constructor() {
    super(","); // Use comma as delimiter
  }

  protected processLine(line: string): void {
    // Parse the range (e.g., "13-125")
    const parts = line.split("-");
    if (parts.length !== 2) {
      console.error(`Invalid range format: ${line}`);
      return;
    }

    const start = parseInt(parts[0], 10);
    const end = parseInt(parts[1], 10);

    if (isNaN(start) || isNaN(end)) {
      console.error(`Invalid numbers in range: ${line}`);
      return;
    }

    // Check each number in the range
    for (let num = start; num <= end; num++) {
      const str = String(num);
      if (this.isInvalid(str)) {
        this.totalSum += num;
      }
    }
  }

  private isInvalid(str: string): boolean {
    const len = str.length;

    // Try all possible pattern lengths (divisors of the total length)
    for (let patternLen = 1; patternLen < len; patternLen++) {
      // Pattern length must divide evenly into total length
      if (len % patternLen !== 0) {
        continue;
      }

      // Extract the pattern
      const pattern = str.substring(0, patternLen);

      // Check if the entire string is this pattern repeated
      let isRepeated = true;
      for (let i = patternLen; i < len; i += patternLen) {
        const segment = str.substring(i, i + patternLen);
        if (segment !== pattern) {
          isRepeated = false;
          break;
        }
      }

      if (isRepeated) {
        return true;
      }
    }

    return false;
  }

  protected onClose(): void {
    console.log(this.totalSum);
  }
}

// Usage
const checker = new InvalidRangeChecker();
