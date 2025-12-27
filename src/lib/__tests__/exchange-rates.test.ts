import { convertCurrency, getExchangeRate, formatExchangeRate, batchConvertCurrency, EXCHANGE_RATES } from "@/lib/exchange-rates"
import { CurrencyCode } from "@/lib/currency"
import { describe, it, expect } from "vitest"

describe("Exchange Rates Service", () => {
  describe("convertCurrency", () => {
    it("converts USD to IDR correctly", () => {
      const result = convertCurrency(1000, "USD", "IDR")
      expect(result).toBe(16600000)
    })

    it("converts IDR to USD correctly", () => {
      const result = convertCurrency(16600000, "IDR", "USD")
      expect(result).toBe(1000)
    })

    it("converts USD to SGD correctly", () => {
      const result = convertCurrency(100, "USD", "SGD")
      expect(result).toBe(135)
    })

    it("converts SGD to MYR correctly", () => {
      const result = convertCurrency(10, "SGD", "MYR")
      expect(result).toBeCloseTo(31.1, 1)
    })

    it("returns same amount when converting same currency", () => {
      expect(convertCurrency(1000, "USD", "USD")).toBe(1000)
      expect(convertCurrency(50000, "IDR", "IDR")).toBe(50000)
      expect(convertCurrency(12.50, "SGD", "SGD")).toBe(12.50)
    })

    it("handles zero amounts", () => {
      expect(convertCurrency(0, "USD", "IDR")).toBe(0)
      expect(convertCurrency(0, "IDR", "SGD")).toBe(0)
    })

    it("handles negative amounts (representing debt/credits)", () => {
      expect(convertCurrency(-1000, "USD", "IDR")).toBe(-16600000)
      expect(convertCurrency(-500, "SGD", "MYR")).toBe(-1555.56)
    })

    it("handles decimal amounts", () => {
      const result = convertCurrency(99.99, "USD", "IDR")
      expect(result).toBeCloseTo(1659834, 0)
    })

    it("rounds to 2 decimal places", () => {
      const result = convertCurrency(1, "USD", "SGD")
      // 1.35 should round properly
      expect(result).toBe(1.35)
    })

    it("throws error for invalid source currency", () => {
      expect(() => {
        convertCurrency(100, "INVALID" as any, "USD")
      }).toThrow()
    })

    it("throws error for invalid target currency", () => {
      expect(() => {
        convertCurrency(100, "USD", "INVALID" as any)
      }).toThrow()
    })
  })

  describe("getExchangeRate", () => {
    it("returns correct rate from USD to IDR", () => {
      expect(getExchangeRate("USD", "IDR")).toBe(16600)
    })

    it("returns correct rate from IDR to USD", () => {
      const rate = getExchangeRate("IDR", "USD")
      expect(rate).toBeCloseTo(1 / 16600, 8)
    })

    it("returns 1 for same currency", () => {
      expect(getExchangeRate("USD", "USD")).toBe(1)
      expect(getExchangeRate("IDR", "IDR")).toBe(1)
      expect(getExchangeRate("SGD", "SGD")).toBe(1)
    })

    it("returns different rates based on direction", () => {
      const usdToSgd = getExchangeRate("USD", "SGD")
      const sgdToUsd = getExchangeRate("SGD", "USD")
      expect(usdToSgd).toBeCloseTo(1 / sgdToUsd, 8)
    })

    it("throws error for invalid currencies", () => {
      expect(() => getExchangeRate("INVALID" as any, "USD")).toThrow()
      expect(() => getExchangeRate("USD", "INVALID" as any)).toThrow()
    })
  })

  describe("formatExchangeRate", () => {
    it("formats rate display correctly", () => {
      const result = formatExchangeRate("USD", "IDR")
      expect(result).toBe("1 USD = 16,600 IDR")
    })

    it("formats smaller rates correctly", () => {
      const result = formatExchangeRate("IDR", "USD")
      expect(result).toContain("1 IDR = ")
      expect(result).toContain(" USD")
    })
  })

  describe("batchConvertCurrency", () => {
    it("converts multiple amounts correctly", () => {
      const amounts = [100, 200, 300]
      const result = batchConvertCurrency(amounts, "USD", "IDR")
      expect(result).toEqual([1660000, 3320000, 4980000])
    })

    it("handles empty array", () => {
      const result = batchConvertCurrency([], "USD", "IDR")
      expect(result).toEqual([])
    })

    it("preserves order", () => {
      const amounts = [50, 10, 200, 75]
      const result = batchConvertCurrency(amounts, "USD", "IDR")
      expect(result.length).toBe(4)
      expect(result[0]).toBe(830000) // 50 * 16600
      expect(result[1]).toBe(166000) // 10 * 16600
      expect(result[2]).toBe(3320000) // 200 * 16600
      expect(result[3]).toBe(1245000) // 75 * 16600
    })

    it("handles mixed positive/negative amounts", () => {
      const amounts = [100, -50, 0, 25]
      const result = batchConvertCurrency(amounts, "USD", "SGD")
      expect(result[0]).toBe(135) // 100 * 1.35
      expect(result[1]).toBe(-67.5) // -50 * 1.35
      expect(result[2]).toBe(0) // 0 * 1.35
      expect(result[3]).toBeCloseTo(33.75, 2) // 25 * 1.35
    })
  })

  describe("Exchange Rate Matrix", () => {
    it("has all supported currencies", () => {
      const currencies = Object.keys(EXCHANGE_RATES)
      expect(currencies).toContain("USD")
      expect(currencies).toContain("IDR")
      expect(currencies).toContain("SGD")
      expect(currencies).toContain("MYR")
      expect(currencies).toContain("THB")
      expect(currencies).toContain("INR")
    })

    it("has rates for all currency pairs", () => {
      const currencies = Object.keys(EXCHANGE_RATES) as CurrencyCode[]
      currencies.forEach(from => {
        currencies.forEach(to => {
          expect(EXCHANGE_RATES[from][to]).toBeDefined()
          expect(typeof EXCHANGE_RATES[from][to]).toBe("number")
          expect(EXCHANGE_RATES[from][to]).toBeGreaterThan(0)
        })
      })
    })

    it("maintains rate symmetry", () => {
      // Test bidirectional conversion: X → Y → X should equal X (within 1% margin due to rounding)
      const amount = 1000000
      const currencies: CurrencyCode[] = [
        "USD",
        "IDR",
        "SGD",
        "MYR",
        "THB",
        "INR",
      ]

      currencies.forEach(from => {
        currencies.forEach(to => {
          if (from !== to) {
            const converted = convertCurrency(amount, from, to)
            const reversed = convertCurrency(converted, to, from)
            
            // Calculate relative error
            const error = Math.abs(reversed - amount) / amount
            expect(error).toBeLessThan(0.01) // Less than 1% error
          }
        })
      })
    })
  })

  describe("Edge Cases", () => {
    it("handles very large amounts", () => {
      const largeAmount = 1000000000 // 1 billion USD
      const result = convertCurrency(largeAmount, "USD", "IDR")
      expect(result).toBe(16600000000000) // 16.6 trillion IDR
    })

    it("handles very small amounts", () => {
      const smallAmount = 0.01 // 1 cent USD
      const result = convertCurrency(smallAmount, "USD", "IDR")
      expect(result).toBe(166) // 166 IDR
    })

    it("handles precision with decimal conversions", () => {
      const amount = 123.45
      const converted = convertCurrency(amount, "USD", "SGD")
      const reversed = convertCurrency(converted, "SGD", "USD")
      expect(reversed).toBeCloseTo(amount, 2)
    })
  })
})
