/**
 * Indonesian category name mappings
 * Maps common Indonesian transaction descriptions to category names
 */

export const INDONESIAN_CATEGORY_KEYWORDS: Record<string, string[]> = {
  Makanan: [
    "restoran",
    "cafe",
    "kopi",
    "makan",
    "food",
    "warung",
    "gofood",
    "grabfood",
    "mcd",
    "kfc",
    "pizza",
  ],
  Transportasi: [
    "gojek",
    "grab",
    "taxi",
    "taksi",
    "bensin",
    "pertamina",
    "shell",
    "parkir",
    "tol",
    "kereta",
    "bus",
    "ojek",
  ],
  Belanja: [
    "tokopedia",
    "shopee",
    "lazada",
    "bukalapak",
    "indomaret",
    "alfamart",
    "supermarket",
    "mall",
    "toko",
  ],
  Hiburan: [
    "cinema",
    "bioskop",
    "netflix",
    "spotify",
    "game",
    "hiburan",
    "wisata",
    "liburan",
  ],
  Tagihan: [
    "listrik",
    "pln",
    "air",
    "pdam",
    "internet",
    "telkom",
    "indihome",
    "pulsa",
    "token",
    "cicilan",
    "kartu kredit",
  ],
  Kesehatan: [
    "rumah sakit",
    "klinik",
    "apotek",
    "dokter",
    "obat",
    "farmasi",
    "medical",
  ],
  Pendidikan: ["sekolah", "universitas", "kursus", "buku", "les", "pendidikan"],
  Transfer: [
    "transfer",
    "kirim",
    "setor",
    "tarik",
    "atm",
    "withdraw",
    "deposit",
  ],
  Gaji: ["gaji", "salary", "thr", "bonus", "insentif"],
  Lainnya: ["lain", "other", "misc"],
};

/**
 * Suggest category based on Indonesian transaction description
 */
export function suggestCategoryFromDescription(
  description: string
): string | undefined {
  const lowerDesc = description.toLowerCase();

  for (const [category, keywords] of Object.entries(
    INDONESIAN_CATEGORY_KEYWORDS
  )) {
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword)) {
        return category;
      }
    }
  }

  return undefined;
}
