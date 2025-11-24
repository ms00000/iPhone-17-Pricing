import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { HistoricalRate } from '../types';

interface RateChartProps {
  data: HistoricalRate[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-gray-400 text-xs mb-2">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-sm font-mono" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(4)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const RateChart: React.FC<RateChartProps> = ({ data }) => {
  // Normalize data for visualization if currencies have vastly different scales?
  // JPY is usually ~0.05 while CAD is ~5.0. Plotting them on the same linear axis makes JPY a flat line at 0.
  // Solution: Use multiple axes or percent change. 
  // Given the request, separate axes or lines is best. Let's use right axis for JPY.

  return (
    <div className="w-full h-[350px] bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            Exchange Rate Trends (CNY Base)
        </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
                const d = new Date(value);
                return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <YAxis 
            yAxisId="left" 
            stroke="#94a3b8" 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#f472b6" 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{paddingTop: '20px'}} />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="cad"
            name="CAD/CNY"
            stroke="#60a5fa" // blue-400
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="twd"
            name="TWD/CNY"
            stroke="#34d399" // emerald-400
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
           <Line
            yAxisId="right"
            type="monotone"
            dataKey="jpy"
            name="JPY/CNY"
            stroke="#f472b6" // pink-400
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
