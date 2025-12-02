import { StdinReader } from "./loop";

class SafeKnobReader extends StdinReader {
  private position = 50;
  private zeroCount = 0;

  protected processLine(line: string): void {
    const direction = line[0];
    const clicks = parseInt(line.slice(1), 10);

    console.log(`Turning ${direction} by ${clicks} clicks.`);

    if (direction === "L") {
      this.position -= clicks;
      console.log(`Intermediate position: ${this.position}`);
      while (this.position < 0) {
        this.position += 100;
      }
      console.log(`Adjusted position after wrap: ${this.position}`);
    } else if (direction === "R") {
      this.position += clicks;
      console.log(`Intermediate position: ${this.position}`);
      while (this.position >= 100) {
        this.position -= 100;
      }
      console.log(`Adjusted position after wrap: ${this.position}`);
    }

    if (this.position === 0) {
      this.zeroCount++;
    }

    console.log(`Position: ${this.position}, Zero count: ${this.zeroCount}`);
  }

  protected onClose(): void {
    console.log(`\nFinal position: ${this.position}`);
    console.log(`Total times at position 0: ${this.zeroCount}`);
  }
}

new SafeKnobReader();
