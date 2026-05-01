import { describe, it, expect } from "vitest";

function classifyFraud(score: number) {
  if (score >= 70) return "high";
  if (score >= 30) return "medium";
  return "low";
}

describe("Fraud Detection", () => {
  it("detects low fraud", () => {
    expect(classifyFraud(15)).toBe("low");
  });

  it("detects medium fraud", () => {
    expect(classifyFraud(45)).toBe("medium");
  });

  it("detects high fraud", () => {
    expect(classifyFraud(82)).toBe("high");
  });
});