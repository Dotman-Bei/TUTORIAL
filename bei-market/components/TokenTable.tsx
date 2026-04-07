'use client';

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

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

interface TokenTableProps {
  tokens: TokenInfo[];
  isLoading: boolean;
  onTokenSelect: (token: TokenInfo) => void;
  selectedTokenId?: string;
}

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

const volumeFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
});

export function TokenTable({
  tokens,
  isLoading,
  onTokenSelect,
  selectedTokenId,
}: TokenTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800">
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-200">
              Asset
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-200">
              Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-200">
              24h Change
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-200">
              24h Volume
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-200">
              Market Cap
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-200">
              FDV
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {tokens.map((token) => (
            <tr
              key={token.id}
              onClick={() => onTokenSelect(token)}
              className={`cursor-pointer transition-colors hover:bg-slate-800 ${
                selectedTokenId === token.id ? 'bg-slate-800' : 'bg-slate-900'
              }`}
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={token.image}
                    alt={token.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-slate-100">{token.name}</div>
                    <div className="text-sm text-slate-400">{token.symbol}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-right font-mono text-sm text-slate-100">
                {formatter.format(token.price)}
              </td>
              <td className="px-6 py-4 text-right">
                <div
                  className={`flex items-center justify-end gap-1 font-mono text-sm ${
                    token.priceChangePercent24h >= 0
                      ? 'text-emerald-500'
                      : 'text-rose-500'
                  }`}
                >
                  {token.priceChangePercent24h >= 0 ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  {percentFormatter.format(Math.abs(token.priceChangePercent24h))}%
                </div>
              </td>
              <td className="px-6 py-4 text-right font-mono text-sm text-slate-100">
                {volumeFormatter.format(token.volume24h)}
              </td>
              <td className="px-6 py-4 text-right font-mono text-sm text-slate-100">
                {volumeFormatter.format(token.marketCap)}
              </td>
              <td className="px-6 py-4 text-right font-mono text-sm text-slate-100">
                {token.fdv ? volumeFormatter.format(token.fdv) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
