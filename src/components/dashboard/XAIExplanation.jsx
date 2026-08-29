import React from 'react';
import { Sparkles, Info, ShieldAlert, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export function XAIExplanation({ xaiData, className = '' }) {
  const factors = xaiData?.factors || [];
  const explanation = xaiData?.explanation;

  return (
    <Card
      title="Why did the AI predict this?"
      subtitle="Explainable AI (XAI) feature attribution & contribution analysis"
      icon={Sparkles}
      action={
        <Badge variant="purple" dot>
          SHAP Attribution
        </Badge>
      }
      className={className}
    >
      {/* Plain Language Summary Banner */}
      <div className="p-4 rounded-xl bg-aerodark-900 border border-slate-700/80 mb-5">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex-shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-1">
              Model Diagnostic Summary
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              The predicted AQI is primarily influenced by <strong>elevated NO₂</strong> and <strong>unusual HCHO levels</strong>, combined with <strong>low wind speed</strong> that may reduce pollutant dispersion.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Factor Contribution Bars */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider pb-1 border-b border-slate-800">
          <span>Input Feature / Variable</span>
          <span>Predicted AQI Impact</span>
        </div>

        {factors.map((factor, index) => {
          const contrib = typeof factor.contribution === 'number' ? factor.contribution : 0;
          const isAggravator = contrib > 0;
          const absContribution = Math.abs(contrib);
          const maxImpact = 45; // benchmark scale
          const barWidthPercent = Math.min(100, (absContribution / maxImpact) * 100);

          return (
            <div
              key={factor.id || factor.name || index}
              className="p-3 rounded-xl bg-aerodark-800/60 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-xs text-slate-200 truncate">
                    {factor.name}
                  </span>
                  {factor.value && (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {factor.value}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isAggravator ? (
                    <span className="flex items-center text-xs font-mono font-bold text-rose-400">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      +{contrib.toFixed(1)} pts
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-mono font-bold text-emerald-400">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      {contrib.toFixed(1)} pts
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isAggravator ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                <span className="truncate pr-2">{factor.description}</span>
                <span className="font-mono text-[10px] text-slate-400 flex-shrink-0">
                  Baseline: {factor.baseline}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Model Transparency & Disclaimer Notice */}
      <div className="mt-5 p-3 rounded-xl bg-aerodark-950/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span>Scientific Transparency Note</span>
        </div>
        <p>
          AeroLens AI visualizes input feature contributions and statistical correlation vectors. These values explain the internal weights of the deep predictive model and do not constitute judicial proof of specific polluter liability.
        </p>
      </div>
    </Card>
  );
}
