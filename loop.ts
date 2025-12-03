import * as readline from "readline";

export abstract class StdinReader {
  protected rl: readline.Interface;
  private delimiter: string | null;

  constructor(delimiter: string | null = null) {
    this.delimiter = delimiter;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    this.rl.on("line", (line: string) => {
      if (this.delimiter) {
        // Split by delimiter and process each value
        const values = line.split(this.delimiter);
        for (const value of values) {
          if (value.trim()) {
            this.processLine(value.trim());
          }
        }
      } else {
        // Process entire line
        this.processLine(line);
      }
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
