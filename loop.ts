import * as readline from "readline";

abstract class StdinReader {
  protected rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    this.rl.on("line", (line: string) => {
      this.processLine(line);
    });

    this.rl.on("close", () => {
      this.onClose();
      process.exit(0);
    });
  }

  // Abstract method to be implemented by subclasses
  protected abstract processLine(line: string): void;

  // Optional hook for cleanup when stdin closes
  protected onClose(): void {
    // Default implementation does nothing
  }
}
