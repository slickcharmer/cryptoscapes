import snakeCase from 'lodash.snakecase';
import {
  AvailableDayRanges,
  AvailableIntervals,
  CoinSortingKey,
  CoinSortingOrder,
  ExchangeVolumeChartDayRanges,
  StatusUpdateCategory
} from '../models';

export const coinGecko = {
  coins: (sortingKey: CoinSortingKey, sortingOrder: CoinSortingOrder, page: number, perPage: number, sparkline: boolean, category: string) =>
    `/coins/markets?vs_currency=usd&order=${sortingKey}_${sortingOrder}&per_page=${perPage}&page=${page}&sparkline=${sparkline}&price_change_percentage=24h,7d${category ? `&category=${category}` : ''}`,
  coinMarketChart: (coinId: string, days: AvailableDayRanges, interval: AvailableIntervals) =>
    `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`,
  trending:
    `/search/trending`,
  global:
    `/global`,
  coinDetails: (coinId: string) =>
    `/coins/${coinId}`,
  supportedCoins:
    `/coins/list`,
  categories:
    `/coins/categories/list`,
  exchanges: (page: number, perPage: number) =>
    `/exchanges?per_page=${perPage}&page=${page}`,
  exchangeVolumeChart: (exchangeId: string, days: ExchangeVolumeChartDayRanges) =>
    `/exchanges/${exchangeId}/volume_chart?days=${days}`,
  companies: (coinId: 'bitcoin' | 'ethereum') =>
    `/companies/public_treasury/${coinId}`,
  statusUpdates: (page: number, perPage: number, category: StatusUpdateCategory) =>
    `/status_updates?per_page=${perPage}&page=${page}&category=${snakeCase(category)}`
};

export const ethGasStation = {
  gasOracle:
    `/json/ethgasAPI.json`
};

export const alternativeMe = {
  fearGreedIndex: (days: AvailableDayRanges) =>
    `/fng/?limit=${days}`
};

export const blockchainCom = {
  bitcoinHashRate:
    `/charts/hash-rate?daysAverageString=7D&timespan=1year&sampled=true&metadata=false&cors=true&format=json`
};
