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
      if (this.isInvalidStr(num.toString())) {
        this.totalSum += num;
      }
    }
  }

  private isInvalidStr(str: string): boolean {
    const len = str.length;

    // A number can only be "invalid" if it has even length
    if (len % 2 !== 0) {
      return false;
    }

    // Check if the first half equals the second half
    const halfLen = len / 2;
    for (let i = 0; i < halfLen; i++) {
      if (str[i] !== str[i + halfLen]) {
        return false;
      }
    }

    return true;
  }

  protected onClose(): void {
    console.log(this.totalSum);
  }
}

// Usage
const checker = new InvalidRangeChecker();
