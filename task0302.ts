import { StdinReader } from "./loop";

let t;

class Digit12SumReader extends StdinReader {
  private sum: number = 0;

  protected processLine(line: string): void {
    const largestNumber = this.findLargestNDigits(line, 12);
    if (largestNumber !== null) {
      this.sum += largestNumber;
    }
  }

  private findLargestNDigits(line: string, n: number): number | null {
    if (line.length < n) {
      return null;
    }

    const stack: string[] = [];
    let toRemove = line.length - n;

    for (let i = 0; i < line.length; i++) {
      // While we can still remove digits and the top of stack is smaller than current digit
      while (
        toRemove > 0 &&
        stack.length > 0 &&
        stack[stack.length - 1] < line[i]
      ) {
        stack.pop();
        toRemove--;
      }
      stack.push(line[i]);
    }

    // If we still need to remove digits, remove from the end
    while (toRemove > 0) {
      stack.pop();
      toRemove--;
    }

    return parseInt(stack.join(""), 10);
  }

  protected onClose(): void {
    console.log(this.sum);
    console.log(process.hrtime.bigint() - t);
  }
}
// Create and run the reader
t = process.hrtime.bigint();
new Digit12SumReader();
