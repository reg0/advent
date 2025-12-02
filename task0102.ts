import { StdinReader } from "./loop";

export class SafeKnobReader extends StdinReader {
  private position: number;
  private zeroStops = 0;
  private zeroTotal = 0;

  constructor(startPosition: number = 50) {
    super();
    this.position = startPosition;
  }

  protected processLine(line: string): void {
    const result = this.processMove(line);
    console.log(
      `Position: ${result.position}, Zero stops: ${result.zeroStops}, Zero total: ${result.zeroTotal}`
    );
  }

  // Testable method that processes a move and returns the state
  public processMove(line: string): {
    position: number;
    zeroStops: number;
    zeroTotal: number;
  } {
    const direction = line[0];
    const clicks = parseInt(line.slice(1), 10);
    const wasAtZero = this.position === 0;

    if (direction === "L") {
      this.position -= clicks;
      while (this.position < 0) {
        if (wasAtZero && this.position <= -100) {
          this.zeroTotal++;
        }
        this.position += 100;
        if (!wasAtZero) {
          this.zeroTotal++;
        }
      }
    } else if (direction === "R") {
      this.position += clicks;
      while (this.position >= 100) {
        if (wasAtZero && this.position >= 100) {
          this.zeroTotal++;
        }
        this.position -= 100;
        if (!wasAtZero && this.position !== 0) {
          this.zeroTotal++;
        }
      }
    }

    // Count stopping at 0 (only if we didn't start there)
    if (this.position === 0 && !wasAtZero) {
      this.zeroStops++;
      this.zeroTotal++;
    }

    return {
      position: this.position,
      zeroStops: this.zeroStops,
      zeroTotal: this.zeroTotal,
    };
  }

  protected onClose(): void {
    console.log(`\nFinal position: ${this.position}`);
    console.log(`Total times stopped at position 0: ${this.zeroStops}`);
    console.log(`Total times at/through position 0: ${this.zeroTotal}`);
  }
}

new SafeKnobReader();
