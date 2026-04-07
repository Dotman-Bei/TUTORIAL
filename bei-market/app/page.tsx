'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TokenTable } from '@/components/TokenTable';
import { PriceChart } from '@/components/PriceChart';
import { StatCard } from '@/components/StatCard';
import { fetchTopCryptos, fetchCryptoHistoricalData } from '@/lib/api';
import { TrendingUp } from 'lucide-react';

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

const tokenDescriptions: Record<string, string> = {
  bitcoin:
    'First blockchain-based cryptocurrency. Decentralized peer-to-peer payment protocol using proof-of-work consensus.',
  ethereum:
    'Smart contract platform enabling programmable applications. Uses proof-of-stake consensus mechanisms.',
  solana:
    'High-throughput blockchain with proof-of-history consensus. Optimized for scalability and transaction speed.',
  cardano:
    'Evidence-based cryptocurrency using peer-reviewed research. Implements proof-of-stake with academic governance.',
  polkadot:
    'Multi-chain interoperability protocol. Enables heterogeneous sharding for cross-chain communication.',
  dogecoin: 'Community-driven cryptocurrency using proof-of-work consensus. No supply cap.',
  ripple:
    'Real-time settlement network for financial institutions. Enables multi-hop transactions across currencies.',
  litecoin:
    'Fork of Bitcoin with modified parameters. Faster block times and different hashing algorithm.',
  chainlink:
    'Decentralized oracle network providing external data to smart contracts. Enables off-chain computation.',
  uniswap:
    'Automated market maker protocol for decentralized token exchange. Uses constant product formula.',
};

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function Dashboard() {
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);

  const { data: tokens, isLoading: tokensLoading } = useQuery({
    queryKey: ['cryptocurrencies'],
    queryFn: fetchTopCryptos,
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['chartData', selectedToken?.id],
    queryFn: () =>
      selectedToken ? fetchCryptoHistoricalData(selectedToken.id, 30) : Promise.resolve([]),
    enabled: !!selectedToken,
    staleTime: 3600000,
  });

  const displayToken = selectedToken || tokens?.[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-8 py-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-emerald-500" />
          <h1 className="font-serif text-3xl font-bold tracking-tight">Bei Market</h1>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Real-time cryptocurrency market intelligence
        </p>
      </header>

      <main className="space-y-8 p-8">
        {/* Token Table */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Market Overview</h2>
          <TokenTable
            tokens={tokens || []}
            isLoading={tokensLoading}
            onTokenSelect={setSelectedToken}
            selectedTokenId={selectedToken?.id}
          />
        </section>

        {/* Detail Section */}
        {displayToken && (
          <section className="space-y-6">
            <div className="flex items-center gap-4 rounded-lg border border-slate-700 bg-slate-900 p-6">
              <img
                src={displayToken.image}
                alt={displayToken.name}
                className="h-12 w-12 rounded-full"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-100">{displayToken.name}</h2>
                <p className="text-sm text-slate-400">{displayToken.symbol}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-slate-100">
                  {formatter.format(displayToken.price)}
                </div>
                <div
                  className={`font-mono text-sm font-semibold ${
                    displayToken.priceChangePercent24h >= 0
                      ? 'text-emerald-500'
                      : 'text-rose-500'
                  }`}
                >
                  {displayToken.priceChangePercent24h >= 0 ? '+' : ''}
                  {percentFormatter.format(displayToken.priceChangePercent24h)}%
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
              <p className="text-sm leading-relaxed text-slate-300">
                {tokenDescriptions[displayToken.id] ||
                  'No description available.'}
              </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Key Statistics Card */}
              <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-900 p-4 lg:col-span-1">
                <h3 className="text-sm font-semibold text-slate-200">Key Statistics</h3>
                <div className="space-y-3">
                  <StatCard
                    label="Market Cap"
                    value={
                      displayToken.marketCap > 0
                        ? `$${(displayToken.marketCap / 1e9).toFixed(2)}B`
                        : '—'
                    }
                  />
                  <StatCard
                    label="FDV"
                    value={
                      displayToken.fdv && displayToken.fdv > 0
                        ? `$${(displayToken.fdv / 1e9).toFixed(2)}B`
                        : '—'
                    }
                  />
                  <StatCard
                    label="24h Volume"
                    value={
                      displayToken.volume24h > 0
                        ? `$${(displayToken.volume24h / 1e9).toFixed(2)}B`
                        : '—'
                    }
                  />
                  <StatCard
                    label="ATH"
                    value={formatter.format(displayToken.ath)}
                    subValue={new Date(displayToken.athDate).toLocaleDateString()}
                    variant={displayToken.athChangePercent < 0 ? 'negative' : 'default'}
                  />
                </div>
              </div>

              {/* Price Chart */}
              <div className="lg:col-span-2">
                <PriceChart
                  data={chartData || []}
                  isLoading={chartLoading}
                  symbol={displayToken.symbol}
                />
              </div>
            </div>

            {/* Supply Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Circulating Supply"
                value={`${(displayToken.circulatingSupply / 1e6).toFixed(2)}M`}
              />
              <StatCard
                label="Total Supply"
                value={`${(displayToken.totalSupply / 1e6).toFixed(2)}M`}
              />
              <StatCard
                label="Max Supply"
                value={
                  displayToken.maxSupply ? `${(displayToken.maxSupply / 1e6).toFixed(2)}M` : '—'
                }
              />
              <StatCard
                label="24h Change"
                value={formatter.format(displayToken.priceChange24h)}
                variant={displayToken.priceChange24h >= 0 ? 'positive' : 'negative'}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
