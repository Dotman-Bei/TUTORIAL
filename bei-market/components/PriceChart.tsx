'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PriceChartProps {
  data: [number, number][];
  isLoading: boolean;
  symbol: string;
}

export function PriceChart({ data, isLoading, symbol }: PriceChartProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border border-slate-700 bg-slate-900">
        <div className="text-slate-400">Loading chart...</div>
      </div>
    );
  }

  const chartData = data.map(([timestamp, price]) => ({
    time: new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    price,
  }));

  const minPrice = Math.min(...data.map(([, p]) => p));
  const maxPrice = Math.max(...data.map(([, p]) => p));
  const isGain = chartData[chartData.length - 1]?.price >= chartData[0]?.price;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-100">{symbol} Price Chart</h3>
        <p className="text-xs text-slate-400">Last 30 days</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="time"
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            interval={Math.floor(chartData.length / 6)}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            domain={[minPrice * 0.95, maxPrice * 1.05]}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#e2e8f0' }}
            formatter={(value: number) => `$${value.toFixed(2)}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isGain ? '#10b981' : '#f43f5e'}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
