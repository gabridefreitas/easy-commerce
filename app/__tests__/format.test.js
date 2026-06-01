import { formatCurrencyBRL } from "../utils/format";

describe("formatCurrencyBRL", () => {
  it("formats amounts in Brazilian real", () => {
    expect(formatCurrencyBRL(59.9)).toBe("R$\xA059,90");
  });

  it("handles numeric strings", () => {
    expect(formatCurrencyBRL("129.9")).toBe("R$\xA0129,90");
  });
});
