export const CUISINE_CATEGORIES = [
  'BURGER',
  'DONER',
  'PIZZA',
  'PIDE_LAHMACUN',
  'CIG_KOFTE',
  'SOKAK_LEZZETLERI',
  'KOFTE',
  'SALATA_SAGLIK',
  'TATLI',
  'TAVUK',
  'MANTI_MAKARNA',
  'TANTUNI',
  'EV_YEMEKLERI',
  'TOST_SANDVIC',
  'KEBAP',
  'KAHVE_ICECEK',
  'PASTANE_FIRIN',
  'CORBA',
  'DUNYA_MUTFAGI_CAFE',
  'UZAK_DOGU',
  'MEZE',
  'BALIK_DENIZ_URUNLERI',
  'BOREK',
  'STEAK',
  'KAHVALTI',
  'DONDURMA',
] as const

export type CuisineCategory = (typeof CUISINE_CATEGORIES)[number]

export function cuisineCategoryLabelKey(category: CuisineCategory): string {
  return `cuisineCategories.${category}`
}
