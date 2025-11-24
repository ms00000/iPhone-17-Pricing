import React from 'react';
import { PriceCalculation } from '../types';
import { ArrowUpRight, ArrowDownRight, Calculator, Globe } from 'lucide-react';

interface ComparisonCardProps {
  country: string;
  flag: string;
  data: PriceCalculation;
  accentColor: string;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ country, flag, data, accentColor }) => {
  const isTax = data.modifierType === 'tax';
  
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-xl border border-white/10 shadow-2xl transition-transform duration-300 hover:scale-[1.02] group`}>
      {/* Background Accent Glow */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-${accentColor}-500/20 rounded-full blur-3xl group-hover:bg-${accentColor}-500/30 transition-all`}></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{flag}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{country}</h2>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <Globe size={12} /> Apple Store Official
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-gray-300 border border-white/5">
            1 {data.currency} ≈ {data.exchangeRate.toFixed(4)} CNY
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>Original Price</span>
            <span className="font-mono text-white">{data.currency} {data.originalPrice.toLocaleString()}</span>
          </div>

          <div className={`flex justify-between items-center text-sm ${isTax ? 'text-red-400' : 'text-green-400'}`}>
            <span className="flex items-center gap-1">
              {isTax ? 'Plus Tax' : 'Discount'} ({data.modifierPercentage}%)
              {isTax ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            </span>
            <span className="font-mono">
              {isTax ? '+' : '-'}{data.currency} {(data.originalPrice * (data.modifierPercentage / 100)).toFixed(2)}
            </span>
          </div>

          <div className="h-px w-full bg-white/10 my-2"></div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Actual Cost (Local)</span>
            <span className="font-mono text-lg text-white font-semibold">
              {data.currency} {data.finalLocalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10">
             <div className="flex items-center gap-2 mb-1 text-xs text-gray-400 uppercase tracking-wider">
                <Calculator size={14} />
                Converted to CNY
             </div>
             <div className="text-3xl font-bold text-white tracking-tight">
                ¥{data.finalCNYPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
