'use client';

import { useSimulation, getScenarioHours } from '@/hooks/use-simulation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="border-primary/20 bg-card/80">
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Simulation</span>
            <span className="text-lg font-bold text-primary tabular-nums">
              Hour {currentHour}
            </span>
          </div>

          {/* Timeline dots */}
          <div className="flex items-center gap-1 flex-1">
            {hours.map((h, i) => (
              <div key={h} className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    i <= progress
                      ? h >= 32 ? 'bg-danger' : h >= 24 ? 'bg-warn' : h >= 16 ? 'bg-info' : 'bg-safe'
                      : 'bg-muted'
                  }`}
                  title={`Hour ${h}`}
                />
                {i < hours.length - 1 && (
                  <div className={`w-6 h-0.5 ${i < progress ? 'bg-primary/50' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="text-xs"
            >
              Reset
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-xs w-20"
            >
              {isPlaying ? 'Pause' : 'Auto-play'}
            </Button>
            <Button
              size="sm"
              onClick={handleAdvance}
              disabled={currentHour >= maxHour || isPlaying}
              className="text-xs"
            >
              Step Forward
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
