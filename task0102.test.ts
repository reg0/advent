import { SafeKnobReader } from "./task0102";

describe("SafeKnobReader", () => {
  describe("Going LEFT (L)", () => {
    test("from positive to positive (no wrap, no zero)", () => {
      const reader = new SafeKnobReader(50);
      // Start at 50, go left 20 -> 30
      const result = reader.processMove("L20");
      expect(result.position).toBe(30);
      expect(result.zeroStops).toBe(0);
      expect(result.zeroTotal).toBe(0);
    });

    test("from positive to zero", () => {
      const reader = new SafeKnobReader(50);
      // Start at 50, go left 50 -> 0
      const result = reader.processMove("L50");
      expect(result.position).toBe(0);
      expect(result.zeroStops).toBe(1);
      expect(result.zeroTotal).toBe(1);
    });

    test("from positive to negative (wraps to high number)", () => {
      const reader = new SafeKnobReader(50);
      // Start at 50, go left 60 -> -10 -> 90
      const result = reader.processMove("L60");
      expect(result.position).toBe(90);
      expect(result.zeroStops).toBe(0);
      expect(result.zeroTotal).toBe(1); // Crossed 0 once during wrap
    });

    test("from zero to negative (no count)", () => {
      const reader = new SafeKnobReader(0);
      // Start at 0, go left 10 -> -10 -> 90
      const result = reader.processMove("L10");
      expect(result.position).toBe(90);
      expect(result.zeroStops).toBe(0);
      expect(result.zeroTotal).toBe(0); // Should not count crossing when starting from 0
    });

    test("from zero to negative with wrap", () => {
      const reader = new SafeKnobReader(0);
      // Start at 0, go left 10 -> -10 -> 90
      const result = reader.processMove("L110");
      expect(result.position).toBe(90);
      expect(result.zeroStops).toBe(0);
      expect(result.zeroTotal).toBe(1); // Should not count crossing when starting from 0
    });

    test("by more than 100 (multiple wraps)", () => {
      const reader = new SafeKnobReader(50);
      // Start at 50, go left 150 -> wraps once through 0
      const result = reader.processMove("L150");
      expect(result.position).toBe(0); // (50 - 150) = -100, +100 = 0, +100 = 100, -100 = 0
      expect(result.zeroStops).toBe(1);
      expect(result.zeroTotal).toBe(2); // Wrapped twice (crossed 0 once, stopped at 0 once)
    });

    test("by more than 200 (multiple wraps)", () => {
      const reader = new SafeKnobReader(50);
      // Start at 50, go left 250 -> wraps multiple times
      const result = reader.processMove("L250");
      expect(result.position).toBe(0); // (50 - 250) = -200, needs 3 wraps: -200+100=-100+100=0+100=100, but that's 100 so -100 = 0
      expect(result.zeroStops).toBe(1);
      expect(result.zeroTotal).toBe(3); // Should cross 0 twice during wraps, then stop at 0
    });
  });

  describe("Going RIGHT (R)", () => {
    test("from positive to positive (no wrap, no zero)", () => {
      const reader = new SafeKnobReader(50);
      // Start at 50, go right 20 -> 70
      const result = reader.processMove("R20");
      expect(result.position).toBe(70);
      expect(result.zeroStops).toBe(0);
      expect(result.zeroTotal).toBe(0);
    });

    test("from positive to 99 (no wrap)", () => {
      const reader = new SafeKnobReader(50);
      // Start at 50, go right 49 -> 99
      const result = reader.processMove("R49");
      expect(result.position).toBe(99);
      expect(result.zeroStops).toBe(0);
      expect(result.zeroTotal).toBe(0);
    });

    test("from positive wrapping to zero", () => {
      const reader = new SafeKnobReader(50);
      // Start at 50, go right 50 -> 100 -> 0
      const result = reader.processMove("R50");
      expect(result.position).toBe(0);
      expect(result.zeroStops).toBe(1);
      expect(result.zeroTotal).toBe(1); // Only stopped at 0, not an additional crossing
    });

    test("from positive wrapping past zero", () => {
      const reader = new SafeKnobReader(50);
      // Start at 50, go right 60 -> 110 -> 10
      const result = reader.processMove("R60");
      expect(result.position).toBe(10);
      expect(result.zeroStops).toBe(0);
      expect(result.zeroTotal).toBe(1); // Crossed 0 once during wrap
    });

    test("from zero to positive (no count)", () => {
      const reader = new SafeKnobReader(0);
      // Start at 0, go right 10 -> 10
      const result = reader.processMove("R10");
      expect(result.position).toBe(10);
      expect(result.zeroStops).toBe(0);
      expect(result.zeroTotal).toBe(0); // Should not count when leaving from 0
    });

    test("from zero wrapping (no count for first wrap)", () => {
      const reader = new SafeKnobReader(0);
      // Start at 0, go right 110 -> 110 -> 10
      const result = reader.processMove("R110");
      expect(result.position).toBe(10);
      expect(result.zeroStops).toBe(0);
      expect(result.zeroTotal).toBe(1); // Should not count wrapping when starting from 0
    });

    test("from zero multi wrapping (no count for first wrap)", () => {
      const reader = new SafeKnobReader(0);
      // Start at 0, go right 110 -> 110 -> 10
      const result = reader.processMove("R210");
      expect(result.position).toBe(10);
      expect(result.zeroStops).toBe(0);
      expect(result.zeroTotal).toBe(2); // Should not count wrapping when starting from 0
    });

    test("by more than 100 (multiple wraps)", () => {
      const reader = new SafeKnobReader(50);
      // Start at 50, go right 150 -> 200 -> wraps twice
      const result = reader.processMove("R150");
      expect(result.position).toBe(0); // (50 + 150) = 200, -100 = 100, -100 = 0
      expect(result.zeroStops).toBe(1);
      expect(result.zeroTotal).toBe(2); // Wrapped once (crossed 0 once) + stopped at 0
    });

    test("by more than 200 (multiple wraps)", () => {
      const reader = new SafeKnobReader(50);
      // Start at 50, go right 250 -> 300 -> wraps multiple times
      const result = reader.processMove("R250");
      expect(result.position).toBe(0); // (50 + 250) = 300, -100 = 200, -100 = 100, -100 = 0
      expect(result.zeroStops).toBe(1);
      expect(result.zeroTotal).toBe(3); // Wrapped 2 times (crossed 0 twice) + stopped at 0
    });
  });

  describe("Edge cases", () => {
    test("staying at the same position", () => {
      const reader = new SafeKnobReader(50);
      const result = reader.processMove("L0");
      expect(result.position).toBe(50);
      expect(result.zeroStops).toBe(0);
      expect(result.zeroTotal).toBe(0);
    });

    test("exact wrap around (100 clicks right from 0)", () => {
      const reader = new SafeKnobReader(0);
      const result = reader.processMove("R100");
      expect(result.position).toBe(0);
      expect(result.zeroStops).toBe(0);
      expect(result.zeroTotal).toBe(1); // Starting from 0, wrapping shouldn't count
    });

    test("exact multi wrap around (200 clicks right from 0)", () => {
      const reader = new SafeKnobReader(0);
      const result = reader.processMove("R200");
      expect(result.position).toBe(0);
      expect(result.zeroStops).toBe(0);
      expect(result.zeroTotal).toBe(2); // Starting from 0, wrapping shouldn't count
    });

    test("sequential moves accumulate correctly", () => {
      const reader = new SafeKnobReader(50);
      reader.processMove("L50"); // 50 -> 0, zeroTotal = 1
      reader.processMove("R10"); // 0 -> 10, zeroTotal = 1 (no change)
      const result = reader.processMove("L20"); // 10 -> -10 -> 90, zeroTotal = 2
      expect(result.position).toBe(90);
      expect(result.zeroStops).toBe(1);
      expect(result.zeroTotal).toBe(2);
    });
  });
});
