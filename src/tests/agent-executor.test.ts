import { describe, it, expect } from "vitest";

function decide(fraudScore: number, amount: number) {
  if (fraudScore > 70) return "escalate";
  if (fraudScore > 30) return "manual_review";
  if (amount > 20000) return "manual_review";
  return "auto_approve";
}

describe("ClaimNova Agent Decision Engine", () => {
  it("auto approves low risk claims", () => {
    expect(decide(12, 9000)).toBe("auto_approve");
  });

  it("manual reviews medium fraud", () => {
    expect(decide(40, 9000)).toBe("manual_review");
  });

  it("escalates high fraud", () => {
    expect(decide(88, 9000)).toBe("escalate");
  });

  it("manual reviews high amount", () => {
    expect(decide(10, 45000)).toBe("manual_review");
  });
});