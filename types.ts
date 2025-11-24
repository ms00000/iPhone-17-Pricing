export interface HistoricalRate {
  date: string;
  cad: number;
  twd: number;
  jpy: number;
}

export interface CurrentRates {
  CAD: number;
  TWD: number;
  JPY: number;
}

export interface FinancialData {
  currentRates: CurrentRates;
  history: HistoricalRate[];
  lastUpdated: string;
}

export interface PriceCalculation {
  originalPrice: number;
  currency: string;
  modifierPercentage: number;
  modifierType: 'tax' | 'discount';
  finalLocalPrice: number;
  exchangeRate: number;
  finalCNYPrice: number;
}
