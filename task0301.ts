import { StdinReader } from "./loop";

class DigitPairSumReader extends StdinReader {
  private sum: number = 0;

  protected processLine(line: string): void {
    const largestPair = this.findLargestPair(line);
    if (largestPair !== null) {
      this.sum += largestPair;
    }
  }
  private findLargestPair(line: string): number | null {
    if (line.length < 2) {
      return null;
    }

    let maxValue = -1;
    let maxFirstDigit = -1;

    // Find the maximum digit and track its position
    for (let i = 0; i < line.length - 1; i++) {
      const digit = parseInt(line[i], 10);

      if (digit > maxFirstDigit) {
        maxFirstDigit = digit;

        // For this first digit, find the best second digit after it
        let maxSecondDigit = -1;
        for (let j = i + 1; j < line.length; j++) {
          const secondDigit = parseInt(line[j], 10);
          if (secondDigit > maxSecondDigit) {
            maxSecondDigit = secondDigit;
          }
        }

        const pairValue = maxFirstDigit * 10 + maxSecondDigit;
        if (pairValue > maxValue) {
          maxValue = pairValue;
        }
      } else if (digit === maxFirstDigit) {
        // If we find the same max digit again, check if we can get a better second digit
        let maxSecondDigit = -1;
        for (let j = i + 1; j < line.length; j++) {
          const secondDigit = parseInt(line[j], 10);
          if (secondDigit > maxSecondDigit) {
            maxSecondDigit = secondDigit;
          }
        }

        const pairValue = digit * 10 + maxSecondDigit;
        if (pairValue > maxValue) {
          maxValue = pairValue;
        }
      }
    }

    return maxValue;
  }

  protected onClose(): void {
    console.log(this.sum);
  }
}

// Create and run the reader
new DigitPairSumReader();
