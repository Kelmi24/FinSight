import { describe, it, expect } from 'vitest'
import { categorizationService } from './categorizationService'

describe('CategorizationService', () => {
  it('should categorize known keywords correctly', async () => {
    const result = await categorizationService.categorize('Pembayaran Listrik PLN')
    expect(result).toBe('Tagihan')

    const result2 = await categorizationService.categorize('Makan di Restoran Padang')
    expect(result2).toBe('Makanan')

    const result3 = await categorizationService.categorize('Topham Gojek')
    expect(result3).toBe('Transportasi') // "Gojek" is in Transportasi
  })

  it('should return null for unknown descriptions (until AI is active)', async () => {
    const result = await categorizationService.categorize('Unknown Transaction 123')
    expect(result).toBeNull()
  })

  it('should handle batch predictions', async () => {
    const inputs = ['Gaji Bulan Ini', 'Netflix Subscription']
    const results = await categorizationService.predictBatch(inputs)
    
    expect(results).toHaveLength(2)
    expect(results[0]).toBe('Gaji')
    expect(results[1]).toBe('Hiburan')
  })
})
