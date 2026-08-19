import React from 'react';
import { PinManager } from '../../engine/pinManager';

interface Props {
  pinManager: PinManager;
}

export const PinInspector: React.FC<Props> = ({ pinManager }) => {
  const pinStates = pinManager.getAllPinStates();
  const entries = Array.from(pinStates.entries());

  return (
    <div className="w-full h-full bg-[#18181b] p-3 overflow-y-auto font-mono text-xs text-slate-300">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {entries.length === 0 ? (
          <div className="col-span-full text-slate-500 italic py-2">
            No pin activity recorded yet. Start simulation to inspect live voltages and logic levels.
          </div>
        ) : (
          entries.map(([pin, st]) => {
            const isHigh = st.value > 0;
            return (
              <div
                key={pin}
                className="p-2 bg-[#27272a] rounded border border-slate-700 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-300">{pin}</span>
                  <span className="text-[10px] text-slate-400">{st.mode}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isHigh ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-600' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isHigh ? (st.value === 1 ? 'HIGH' : `PWM (${st.value})`) : 'LOW'}
                  </span>
                  <span className="text-slate-400 text-[10px]">{st.voltage.toFixed(1)}V</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
