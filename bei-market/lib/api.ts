interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
}

interface TokenInfo {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  fdv: number | null;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number | null;
  ath: number;
  athDate: string;
  athChangePercent: number;
}

export async function fetchTopCryptos(): Promise<TokenInfo[]> {
  const ids = 'bitcoin,ethereum,solana,cardano,polkadot,dogecoin,ripple,litecoin,chainlink,uniswap';

  const url = new URL('https://api.coingecko.com/api/v3/coins/markets');
  url.searchParams.append('vs_currency', 'usd');
  url.searchParams.append('ids', ids);
  url.searchParams.append('order', 'market_cap_desc');
  url.searchParams.append('per_page', '250');
  url.searchParams.append('sparkline', 'false');
  url.searchParams.append('locale', 'en');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.statusText}`);
  }

  const data: CoinData[] = await response.json();

  return data.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    image: coin.image,
    price: coin.current_price || 0,
    marketCap: coin.market_cap || 0,
    volume24h: coin.total_volume || 0,
    priceChange24h: coin.price_change_24h || 0,
    priceChangePercent24h: coin.price_change_percentage_24h || 0,
    fdv: coin.fully_diluted_valuation || null,
    circulatingSupply: coin.circulating_supply || 0,
    totalSupply: coin.total_supply || 0,
    maxSupply: coin.max_supply || null,
    ath: coin.ath || 0,
    athDate: coin.ath_date || '',
    athChangePercent: coin.ath_change_percentage || 0,
  }));
}

export async function fetchCryptoHistoricalData(
  id: string,
  days: number = 30
): Promise<[number, number][]> {
  const url = new URL(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`);
  url.searchParams.append('vs_currency', 'usd');
  url.searchParams.append('days', days.toString());
  url.searchParams.append('interval', 'daily');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.prices || [];
}
