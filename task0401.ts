import { StdinReader } from "./loop";

class ItemCounter extends StdinReader {
  private map: string[] = [];

  protected processLine(line: string): void {
    this.map.push(line);
  }

  protected onClose(): void {
    const result = this.countItemsWithFewNeighbors();
    console.log(result);
  }

  private countItemsWithFewNeighbors(): number {
    const rows = this.map.length;
    if (rows === 0) return 0;

    const cols = this.map[0].length;
    let count = 0;

    // Direction offsets for 8 surrounding positions
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    // Check each position in the map
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Only process if current position is an item
        if (this.map[row][col] === "@") {
          let neighbors = 0;

          // Count neighbors in all 8 directions
          for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;

            // Check bounds
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
              if (this.map[newRow][newCol] === "@") {
                neighbors++;
              }
            }
          }

          // Count this item if it has fewer than 4 neighbors
          if (neighbors < 4) {
            count++;
          }
        }
      }
    }

    return count;
  }
}

// Create and run the counter
new ItemCounter();
