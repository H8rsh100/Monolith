import React from 'react';
import { Activity, ShieldAlert, Cpu, Code2, FileSpreadsheet, Play, RefreshCw } from 'lucide-react';

interface VerticalNavProps {
  activeHud: 'graph' | 'risk' | 'detail' | 'codegen';
  setActiveHud: (hud: 'graph' | 'risk' | 'detail' | 'codegen') => void;
  onOpenReport: () => void;
  onIngest: () => void;
  onSummarizeAll: () => void;
  loading: boolean;
  selectedProgram?: string;
}

export const VerticalNav: React.FC<VerticalNavProps> = ({
  activeHud,
  setActiveHud,
  onOpenReport,
  onIngest,
  onSummarizeAll,
  loading,
  selectedProgram
}) => {
  const items = [
    { id: 'graph', label: 'Scan Chamber', icon: Activity },
    { id: 'risk', label: 'Thermal Risk Matrix', icon: ShieldAlert },
    { id: 'detail', label: selectedProgram ? `Program: ${selectedProgram}` : 'Program Inspector', icon: Cpu },
    { id: 'codegen', label: 'Codegen Engine', icon: Code2 }
  ];

  const activeIndex = items.findIndex((item) => item.id === activeHud);

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-16 z-50 flex flex-col items-center justify-between py-5 bg-void/95 backdrop-blur-xl border-r border-cyanAccent/20 shadow-[5px_0_30px_rgba(45,226,230,0.1)]">
      
      {/* Brand Icon */}
      <div className="flex flex-col items-center gap-1">
        <div className="h-10 w-10 rounded-lg bg-cyanAccent/10 border border-cyanAccent/40 flex items-center justify-center text-cyanAccent shadow-[0_0_15px_rgba(45,226,230,0.4)]">
          <Activity className="h-5 w-5 animate-pulse" />
        </div>
        <span className="font-mono text-[9px] text-cyanAccent/70 font-bold uppercase tracking-widest mt-1">AUTOPSY</span>
      </div>

      {/* Vertical Spine Rail with Sliding Indicator */}
      <div className="relative flex flex-col items-center gap-6 my-auto">
        
        {/* Background Vertical Spine Line */}
        <div className="absolute top-2 bottom-2 w-0.5 bg-slate-800/80 rounded-full" />

        {/* Active Sliding Glowing Indicator Line */}
        <div
          className="absolute w-1 bg-cyanAccent shadow-[0_0_12px_#2DE2E6] rounded-full transition-all duration-300 ease-out"
          style={{
            height: '36px',
            transform: `translateY(${activeIndex * 60}px)`
          }}
        />

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeHud === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveHud(item.id as any)}
              className={`relative z-10 p-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'text-cyanAccent bg-cyanAccent/15 border border-cyanAccent/40 shadow-[0_0_15px_rgba(45,226,230,0.3)]'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/60'
              }`}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
              
              {/* Tooltip Label (Clean Z-60 overlay) */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded glass-hud text-[11px] font-mono font-bold text-cyanAccent opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Action Controls */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onOpenReport}
          className="p-2.5 rounded-lg text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all group relative"
          title="Executive Autopsy Audit Report"
        >
          <FileSpreadsheet className="h-5 w-5" />
          <div className="absolute left-16 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded glass-hud text-[11px] font-mono font-bold text-purple-300 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl z-50">
            Executive Report
          </div>
        </button>

        <button
          onClick={onSummarizeAll}
          disabled={loading}
          className="p-2.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-900/80 border border-slate-800 transition-all disabled:opacity-50 group relative"
          title="Extract All Business Specs"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          <div className="absolute left-16 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded glass-hud text-[11px] font-mono font-bold text-slate-200 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl z-50">
            Extract Specs
          </div>
        </button>

        <button
          onClick={onIngest}
          disabled={loading}
          className="p-2.5 rounded-lg text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all disabled:opacity-50 group relative"
          title="Ingest Demo Codebase"
        >
          <Play className="h-5 w-5 fill-current" />
          <div className="absolute left-16 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded glass-hud text-[11px] font-mono font-bold text-emerald-300 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl z-50">
            Ingest Demo
          </div>
        </button>
      </div>

    </aside>
  );
};
