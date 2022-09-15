export interface PreAverageCurrency {
  [key: string]: number[];
}

export interface AverageCurrency {
  [key: string]: number;
}

export interface AllLastCurrencies {
  currencyName: string;
  price: number;
}

export interface InfoCurrenciesByName {
  currencyName: string;
  price: number;
}

export interface InfoByCurrencyNameAndSite {
  currencyName: string;
  price: number;
  site: string;
}

export interface InfoByCurrencyNameAndInterval {
  currencyName: string;
  price: number;
  date: Date;
}
