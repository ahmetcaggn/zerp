import cityRowsRaw from './tr-cities-source.json'
import districtRowsRaw from './tr-districts-source.json'

interface CitySourceRow {
  cityCode: string
  cityName: string
}

interface DistrictSourceRow {
  cityCode: string
  cityName: string
  districtName: string
}

const LOCALE = 'tr-TR'

function normalizeKey(value: string): string {
  return value.trim().toLocaleUpperCase(LOCALE).replace(/\s+/g, ' ')
}

function toDisplayName(value: string): string {
  const normalized = value.trim().replace(/\s+/g, ' ')
  if (!normalized) {
    return normalized
  }

  return normalized
    .toLocaleLowerCase(LOCALE)
    .split(/([\s'-]+)/)
    .map((part) => {
      if (!part || /[\s'-]+/.test(part)) {
        return part
      }
      return part.charAt(0).toLocaleUpperCase(LOCALE) + part.slice(1)
    })
    .join('')
}

const cityRows = cityRowsRaw as CitySourceRow[]
const districtRows = districtRowsRaw as DistrictSourceRow[]

const cityNameByCode = new Map<string, string>()
const cityLookupByKey = new Map<string, string>()
for (const row of cityRows) {
  const displayName = toDisplayName(row.cityName)
  cityNameByCode.set(row.cityCode, displayName)
  cityLookupByKey.set(normalizeKey(displayName), displayName)
}

const districtsByCity = new Map<string, string[]>()
const districtLookupByCityAndKey = new Map<string, Map<string, string>>()
for (const row of districtRows) {
  const cityName = cityNameByCode.get(row.cityCode) ?? toDisplayName(row.cityName)
  const districtName = toDisplayName(row.districtName)

  const districtList = districtsByCity.get(cityName)
  if (districtList) {
    if (!districtList.includes(districtName)) {
      districtList.push(districtName)
    }
  } else {
    districtsByCity.set(cityName, [districtName])
  }

  const cityDistrictLookup = districtLookupByCityAndKey.get(cityName)
  if (cityDistrictLookup) {
    cityDistrictLookup.set(normalizeKey(districtName), districtName)
  } else {
    districtLookupByCityAndKey.set(cityName, new Map([[normalizeKey(districtName), districtName]]))
  }
}

for (const [cityName, districtList] of districtsByCity.entries()) {
  districtList.sort((a, b) => a.localeCompare(b, LOCALE))
  districtsByCity.set(cityName, districtList)
}

export const TURKEY_CITY_OPTIONS = Array.from(cityNameByCode.values()).sort((a, b) =>
  a.localeCompare(b, LOCALE),
)

export function resolveCityName(input: string | null | undefined): string | null {
  if (!input || !input.trim()) {
    return null
  }

  const normalized = normalizeKey(input)
  return cityLookupByKey.get(normalized) ?? input.trim()
}

export function resolveDistrictName(
  cityName: string | null | undefined,
  districtName: string | null | undefined,
): string | null {
  if (!districtName || !districtName.trim()) {
    return null
  }

  const resolvedCity = resolveCityName(cityName)
  if (!resolvedCity) {
    return districtName.trim()
  }

  const cityDistrictLookup = districtLookupByCityAndKey.get(resolvedCity)
  if (!cityDistrictLookup) {
    return districtName.trim()
  }

  return cityDistrictLookup.get(normalizeKey(districtName)) ?? districtName.trim()
}

export function getDistrictOptions(cityName: string | null | undefined): string[] {
  const resolvedCity = resolveCityName(cityName)
  if (!resolvedCity) {
    return []
  }
  return districtsByCity.get(resolvedCity) ?? []
}
