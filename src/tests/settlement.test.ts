import { describe, it, expect } from "vitest";

function calculateSettlement(
  gross: number,
  depreciationRate: number,
  ncb: number,
  deductible: number,
  zeroDep = false
) {
  const depreciation = zeroDep ? 0 : Math.round((gross * depreciationRate) / 100);
  const afterDep = gross - depreciation;
  const afterNcb = Math.round(afterDep * (1 - ncb / 100));
  return Math.max(0, afterNcb - deductible);
}

describe("Settlement Engine", () => {
  it("applies depreciation correctly", () => {
    expect(calculateSettlement(10000, 20, 0, 1000)).toBe(7000);
  });

  it("skips depreciation in zero dep", () => {
    expect(calculateSettlement(10000, 20, 0, 1000, true)).toBe(9000);
  });

  it("applies NCB correctly", () => {
    expect(calculateSettlement(10000, 0, 20, 1000)).toBe(7000);
  });

  it("never returns negative settlement", () => {
    expect(calculateSettlement(500, 50, 50, 1000)).toBe(0);
  });
});