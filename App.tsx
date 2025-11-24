import React, { useEffect, useState } from 'react';
import { fetchFinancialData } from './services/gemini';
import { FinancialData, PriceCalculation } from './types';
import { ComparisonCard } from './components/ComparisonCard';
import { RateChart } from './components/RateChart';
import { RefreshCw, TrendingDown, TrendingUp, Smartphone } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFinancialData();
      setData(result);
    } catch (err) {
      setError("Failed to load real-time data. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Calculations ---
  // Canada: $1129 + 5% tax
  const canadaOriginal = 1129;
  const canadaTax = 5;
  const cadRate = data?.currentRates.CAD || 0;
  const canadaFinalLocal = canadaOriginal * (1 + canadaTax / 100);
  const canadaFinalCNY = canadaFinalLocal * cadRate;

  // Taiwan: NT$29,900 - 5% discount
  const taiwanOriginal = 29900;
  const taiwanDiscount = 5;
  const twdRate = data?.currentRates.TWD || 0;
  const taiwanFinalLocal = taiwanOriginal * (1 - taiwanDiscount / 100);
  const taiwanFinalCNY = taiwanFinalLocal * twdRate;

  const priceDiff = Math.abs(canadaFinalCNY - taiwanFinalCNY);
  const cheaperCountry = canadaFinalCNY < taiwanFinalCNY ? "Canada" : "Taiwan";
  
  const canadaData: PriceCalculation = {
    originalPrice: canadaOriginal,
    currency: "CAD",
    modifierPercentage: canadaTax,
    modifierType: "tax",
    finalLocalPrice: canadaFinalLocal,
    exchangeRate: cadRate,
    finalCNYPrice: canadaFinalCNY
  };

  const taiwanData: PriceCalculation = {
    originalPrice: taiwanOriginal,
    currency: "TWD",
    modifierPercentage: taiwanDiscount,
    modifierType: "discount",
    finalLocalPrice: taiwanFinalLocal,
    exchangeRate: twdRate,
    finalCNYPrice: taiwanFinalCNY
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-200 selection:bg-indigo-500 selection:text-white pb-20 pt-10">
      <main className="max-w-7xl mx-auto px-6">
        
        {/* Minimal Header Control */}
        <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Smartphone className="text-indigo-500" />
                    iPhone 17 Pricing
                </h1>
                <p className="text-gray-400 text-sm mt-1">Real-time Global Price Comparison (CNY Base)</p>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs text-gray-600 hidden sm:block font-mono">
                    {data ? `UPDATED: ${new Date().toLocaleTimeString()}` : 'INITIALIZING...'}
                </span>
                <button 
                  onClick={fetchData}
                  disabled={loading}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-gray-400 hover:text-white disabled:opacity-50"
                  title="Refresh Rates"
                >
                  <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>
        </div>

        {/* Loading State */}
        {loading && !data && (
           <div className="flex flex-col items-center justify-center h-96 space-y-4">
             <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
             <p className="text-gray-400 animate-pulse">Scanning global markets via Gemini...</p>
           </div>
        )}

        {error && (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-center mb-8">
                {error}
            </div>
        )}

        {data && (
          <div className="space-y-12">
            
            {/* Price Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ComparisonCard 
                country="Canada" 
                flag="🇨🇦" 
                data={canadaData} 
                accentColor="red" 
              />
              <ComparisonCard 
                country="Taiwan" 
                flag="🇹🇼" 
                data={taiwanData} 
                accentColor="emerald" 
              />
            </div>

            {/* Verdict Section - Redesigned for Impact */}
            <div className="rounded-[2.5rem] bg-[#0f1219] border border-white/10 p-8 sm:p-12 relative overflow-hidden group">
               {/* Background Ambient Glow */}
               <div className={`absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 transition-colors duration-1000 ${cheaperCountry === 'Canada' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
               
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                   <div className="space-y-6">
                       <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300">
                          {cheaperCountry === 'Canada' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          <span>Best Value Option</span>
                       </div>
                       
                       <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                           Buy in <span className={`underline decoration-4 underline-offset-8 ${cheaperCountry === 'Canada' ? 'decoration-red-500' : 'decoration-emerald-500'}`}>{cheaperCountry}</span>
                       </h2>
                       
                       <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                           Considering the current exchange rates and the {cheaperCountry === 'Canada' ? 'tax' : 'discount'} impact, 
                           purchasing in {cheaperCountry} yields significantly better value today.
                       </p>
                   </div>

                   <div className="flex flex-col justify-center items-center md:items-end p-8 rounded-3xl bg-black/20 border border-white/5 backdrop-blur-sm">
                       <span className="text-gray-500 text-sm font-mono tracking-widest uppercase mb-2">Estimated Savings</span>
                       <div className="relative">
                           <span className="text-9xl sm:text-[10rem] font-black text-white tracking-tighter leading-none">
                            ¥{priceDiff.toFixed(0)}
                           </span>
                           <span className="absolute -top-4 -right-8 text-2xl text-gray-500 font-bold">CNY</span>
                       </div>
                       <div className="mt-4 text-sm text-gray-400 flex items-center gap-2">
                           Difference in local currency value converted
                       </div>
                   </div>
               </div>
            </div>

            {/* Charts Section */}
            <div className="space-y-6 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold text-white">Exchange Rate History (3 Months)</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span className="text-sm text-gray-400">CAD</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span className="text-sm text-gray-400">TWD</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                            <span className="text-sm text-gray-400">JPY</span>
                        </div>
                    </div>
                </div>
                <RateChart data={data.history} />
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;