// National Statistics of the Republic of Nusantara — invented dataset.
// This is a fictional country. Every figure below is invented for this
// demonstration site and is internally consistent across sections.
'use strict';

const DATA = {
  country: 'Republic of Nusantara',
  shortName: 'Nusantara',
  currency: 'Nusara',
  currencyCode: 'NSR',
  capital: 'Kertanegara City',
  years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
  latestYear: 2025,

  // Annual national series (2019-2025, index-aligned with years above)
  population: [64.2, 65.0, 65.8, 66.6, 67.3, 67.9, 68.4], // millions
  gdp: [348.2, 341.5, 362.8, 381.4, 395.9, 404.7, 412.6], // billion NSR, current prices
  gdpGrowth: [5.1, -1.9, 6.2, 5.1, 3.8, 2.2, 2.0], // % real growth
  inflation: [2.8, 2.1, 1.9, 4.6, 3.9, 3.4, 3.1], // % CPI, annual average
  unemployment: [5.1, 7.2, 6.8, 6.1, 5.8, 5.6, 5.4], // % of labour force
  participation: [68.1, 66.4, 67.0, 67.9, 68.2, 68.4, 68.6], // % labour force participation
  exports: [82.4, 74.9, 86.3, 94.8, 97.2, 95.6, 96.4], // billion NSR
  imports: [79.8, 71.2, 82.1, 90.5, 92.8, 89.4, 88.1], // billion NSR

  // 2025 snapshot facts
  facts2025: {
    population: 68.4,
    medianAge: 31.2,
    lifeExpectancy: 74.6,
    urbanShare: 58.3,
    households: 17.9, // millions
    gdpPerCapita: 6032, // NSR
    gdp: 412.6,
    gdpGrowth: 2.0,
    inflation: 3.1,
    unemployment: 5.4,
    participation: 68.6,
    exports: 96.4,
    imports: 88.1,
    tradeBalance: 8.3,
    publicDebt: 41.2, // % of GDP
    povertyRate: 9.4, // %
    literacy: 96.8, // %
  },

  // GDP by sector, % of GDP, 2025 (sums to 100.0)
  sectors: [
    { name: 'Services', share: 54.2, note: 'Trade, transport, finance, tourism and public services' },
    { name: 'Industry', share: 28.6, note: 'Manufacturing, mining and utilities' },
    { name: 'Agriculture', share: 11.4, note: 'Crops, fisheries and forestry' },
    { name: 'Construction', share: 5.8, note: 'Buildings and infrastructure' },
  ],

  // Population by age group, 2025, millions (sums to 68.4)
  ageGroups: [
    { label: '0–14', value: 16.4 },
    { label: '15–24', value: 11.6 },
    { label: '25–44', value: 20.5 },
    { label: '45–64', value: 13.7 },
    { label: '65+', value: 6.2 },
  ],

  // CPI basket weights and 2025 inflation by group, %
  cpiGroups: [
    { name: 'Food and drink', weight: 32.5, inflation: 3.8 },
    { name: 'Housing and utilities', weight: 21.4, inflation: 2.6 },
    { name: 'Transport', weight: 13.8, inflation: 2.4 },
    { name: 'Health', weight: 6.9, inflation: 4.1 },
    { name: 'Education', weight: 5.7, inflation: 2.9 },
    { name: 'Clothing', weight: 5.2, inflation: 1.8 },
    { name: 'Recreation', weight: 7.6, inflation: 3.3 },
    { name: 'Other goods', weight: 6.9, inflation: 3.0 },
  ],

  // Employment by sector, % of employed persons, 2025 (sums to 100.0)
  employment: [
    { name: 'Services', share: 48.9 },
    { name: 'Agriculture', share: 26.3 },
    { name: 'Industry', share: 18.1 },
    { name: 'Construction', share: 6.7 },
  ],

  // Six provinces, 2025. Populations sum to 68.4 million.
  regions: [
    { name: 'Kertanegara', capital: 'Kertanegara City', population: 18.6, gdpShare: 31.8, unemployment: 5.1, density: 412, urban: 71.2 },
    { name: 'Bantala', capital: 'Bantala', population: 14.2, gdpShare: 22.4, unemployment: 5.6, density: 238, urban: 62.8 },
    { name: 'Suryapura', capital: 'Suryapura', population: 11.8, gdpShare: 16.9, unemployment: 5.9, density: 187, urban: 55.4 },
    { name: 'Wirasaba', capital: 'Wirasaba', population: 9.7, gdpShare: 12.6, unemployment: 5.3, density: 96, urban: 48.9 },
    { name: 'Mandalika', capital: 'Mandalika', population: 8.1, gdpShare: 10.2, unemployment: 4.8, density: 74, urban: 44.1 },
    { name: 'Tanjung Raya', capital: 'Tanjung Raya', population: 6.0, gdpShare: 6.1, unemployment: 6.2, density: 41, urban: 38.6 },
  ],

  // Monthly CPI inflation, % year on year, 2025
  monthlyInflation: [
    { m: 'Jan', v: 3.6 }, { m: 'Feb', v: 3.5 }, { m: 'Mar', v: 3.4 },
    { m: 'Apr', v: 3.3 }, { m: 'May', v: 3.2 }, { m: 'Jun', v: 3.1 },
    { m: 'Jul', v: 3.0 }, { m: 'Aug', v: 2.9 }, { m: 'Sep', v: 2.9 },
    { m: 'Oct', v: 3.0 }, { m: 'Nov', v: 3.1 }, { m: 'Dec', v: 3.1 },
  ],

  methodology: [
    { q: 'Where do the numbers come from?', a: 'The National Statistics Office of Nusantara compiles these figures from the annual household survey, the business register, customs records and administrative data from ministries. This demonstration site uses an invented dataset, not real survey results.' },
    { q: 'How often are figures updated?', a: 'Population estimates are published every January, GDP every quarter, consumer prices every month and labour figures every quarter. The latest release on this site is dated 15 November 2026.' },
    { q: 'What is the base year for prices?', a: 'The consumer price index uses 2020 as its base year (2020 = 100). Real GDP growth is measured in constant 2020 prices.' },
    { q: 'Why do some totals differ by 0.1?', a: 'Figures are rounded to one decimal place. Rounded components can sum to 0.1 more or less than the rounded total.' },
    { q: 'Can I download the data?', a: 'Yes. Every table on this site has a download button that saves the visible table as a CSV file, generated in your browser.' },
  ],
};
