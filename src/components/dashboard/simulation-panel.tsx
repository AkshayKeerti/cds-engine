'use client';

import { useSimulation, getScenarioHours } from '@/hooks/use-simulation';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useCallback } from 'react';

export function SimulationPanel({ onStepComplete }: { onStepComplete?: () => void }) {
  const { currentHour, isPlaying, speed, advanceStep, reset, setIsPlaying } = useSimulation();
  const hours = getScenarioHours();
  const maxHour = hours[hours.length - 1];
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleAdvance = useCallback(async () => {
    await advanceStep();
    onStepComplete?.();
  }, [advanceStep, onStepComplete]);

  const handleReset = useCallback(async () => {
    await reset();
    onStepComplete?.();
  }, [reset, onStepComplete]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(async () => {
        const state = useSimulation.getState();
        if (state.currentHour >= maxHour) {
          state.setIsPlaying(false);
          return;
        }
        await state.advanceStep();
        onStepComplete?.();
      }, speed * 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, maxHour, onStepComplete]);

  const progress = hours.indexOf(currentHour);

  return (
    <div className="flex items-center gap-4 px-4 py-2.5 bg-white border border-border rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Time</span>
        <span className="text-lg font-semibold vitals text-foreground">
          {currentHour}h
        </span>
      </div>

      <div className="h-5 w-px bg-border" />

      {/* Timeline track */}
      <div className="flex items-center gap-0.5 flex-1">
        {hours.map((h, i) => {
          const isActive = i <= progress;
          const isCurrent = i === progress;
          return (
            <div key={h} className="flex items-center flex-1">
              <div className="relative flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'h-1.5 w-full rounded-full transition-all',
                    isActive
                      ? h >= 32 ? 'bg-clinical-danger' : h >= 24 ? 'bg-clinical-warn' : h >= 16 ? 'bg-clinical-info' : 'bg-clinical-safe'
                      : 'bg-border'
                  )}
                />
                <span className={cn(
                  'text-[10px] mt-1 vitals',
                  isCurrent ? 'text-foreground font-semibold' : 'text-muted-foreground'
                )}>
                  {h}h
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-5 w-px bg-border" />

      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleReset}
          className="text-xs h-7 px-2"
        >
          Reset
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-xs h-7 px-2 w-16"
        >
          {isPlaying ? 'Pause' : 'Auto'}
        </Button>
        <Button
          size="sm"
          onClick={handleAdvance}
          disabled={currentHour >= maxHour || isPlaying}
          className="text-xs h-7 px-3"
        >
          Step &rarr;
        </Button>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
