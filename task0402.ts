import { StdinReader } from "./loop";

class ItemCounter extends StdinReader {
  private map: string[] = [];

  protected processLine(line: string): void {
    this.map.push(line);
  }

  protected onClose(): void {
    const result = this.removeItemsIteratively();
    console.log(result);
  }

  private removeItemsIteratively(): number {
    let totalRemoved = 0;

    while (true) {
      const toRemove = this.findItemsWithFewNeighbors();

      if (toRemove.length === 0) {
        break;
      }

      // Remove the items by replacing with '.'
      for (const [row, col] of toRemove) {
        const line = this.map[row].split("");
        line[col] = ".";
        this.map[row] = line.join("");
      }

      totalRemoved += toRemove.length;
    }

    return totalRemoved;
  }

  private findItemsWithFewNeighbors(): [number, number][] {
    const rows = this.map.length;
    if (rows === 0) return [];

    const cols = this.map[0].length;
    const itemsToRemove: [number, number][] = [];

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

          // Mark this item for removal if it has fewer than 4 neighbors
          if (neighbors < 4) {
            itemsToRemove.push([row, col]);
          }
        }
      }
    }

    return itemsToRemove;
  }
}

// Create and run the counter
new ItemCounter();
