import { countries } from 'countries-list';

export interface CountryMeta {
  code: string;
  name: string;
  flagUrl: string;
  flagEmoji: string;
}

export const getCountryMeta = (countryInput?: string | null): CountryMeta => {
  if (!countryInput || !countryInput.trim()) {
    return {
      code: 'GH',
      name: 'Ghana',
      flagUrl: 'https://flagcdn.com/w40/gh.png',
      flagEmoji: '🇬🇭',
    };
  }

  const clean = countryInput.trim().toLowerCase();

  // 1. Direct ISO code or exact country name match
  for (const [code, c] of Object.entries(countries)) {
    if (code.toLowerCase() === clean || c.name.toLowerCase() === clean) {
      const upperCode = code.toUpperCase();
      return {
        code: upperCode,
        name: c.name,
        flagUrl: `https://flagcdn.com/w40/${code.toLowerCase()}.png`,
        flagEmoji: String.fromCodePoint(...upperCode.split('').map((ch) => 127397 + ch.charCodeAt(0))),
      };
    }
  }

  // 2. Substring or partial match
  for (const [code, c] of Object.entries(countries)) {
    if (c.name.toLowerCase().includes(clean) || clean.includes(c.name.toLowerCase())) {
      const upperCode = code.toUpperCase();
      return {
        code: upperCode,
        name: c.name,
        flagUrl: `https://flagcdn.com/w40/${code.toLowerCase()}.png`,
        flagEmoji: String.fromCodePoint(...upperCode.split('').map((ch) => 127397 + ch.charCodeAt(0))),
      };
    }
  }

  // 3. General International fallback
  return {
    code: countryInput.slice(0, 3).toUpperCase(),
    name: countryInput,
    flagUrl: 'https://flagcdn.com/w40/un.png',
    flagEmoji: '🌐',
  };
};
