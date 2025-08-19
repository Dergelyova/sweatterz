import { type HourPoint, fmtHH } from "@/lib/weather-utils";

interface ComfortBarProps {
  score: number;
  maxScore: number;
}

function ComfortBar({ score, maxScore }: ComfortBarProps) {
  const comfortLevel = Math.max(0, (maxScore - score) / maxScore);
  const widthPercentage = comfortLevel * 100;
  
  return (
    <div className="w-full h-2 bg-card-border rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-blue to-pink rounded-full transition-all duration-300"
        style={{ width: `${widthPercentage}%` }}
      />
    </div>
  );
}

interface BestTimeSlotProps {
  timeSlot: HourPoint;
  rank: number;
  maxScore: number;
}

function BestTimeSlot({ timeSlot, rank, maxScore }: BestTimeSlotProps) {
  const medals = ['🥇', '🥈', '🥉'];
  const medal = medals[rank - 1] || '🏃';

  return (
    <div className="p-4 rounded-xl bg-card border border-card-border hover:border-foreground-muted/30 transition-colors duration-150">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-xl">{medal}</span>
          <div>
            <div className="body-medium text-foreground">
              {fmtHH(timeSlot.time)}
            </div>
            <div className="text-xs text-foreground-subtle">
              #{rank} найкращий час
            </div>
          </div>
        </div>
        <div className="body-medium text-foreground text-lg">
          {Math.round(timeSlot.t)}°C
        </div>
      </div>
      
      <div className="mb-2">
        <ComfortBar score={timeSlot.score} maxScore={maxScore} />
      </div>
      
      <div className="flex flex-wrap gap-1 text-xs">
        <span className="px-2 py-1 bg-card-hover rounded text-foreground-subtle">
          💧 {timeSlot.rh}%
        </span>
        <span className="px-2 py-1 bg-card-hover rounded text-foreground-subtle">
          🌬️ {Math.round(timeSlot.wind)} km/h
        </span>
        <span className="px-2 py-1 bg-card-hover rounded text-foreground-subtle">
          ☀️ UV {timeSlot.uv}
        </span>
        <span className="px-2 py-1 bg-card-hover rounded text-foreground-subtle">
          🌧️ {timeSlot.precip}%
        </span>
      </div>
    </div>
  );
}

interface BestTimeCardProps {
  best: HourPoint[];
}

export function BestTimeCard({ best }: BestTimeCardProps) {
  if (!best.length) {
    return (
      <div className="glass rounded-2xl p-6">
        <h3 className="heading text-lg text-foreground mb-4">Найкращий час для бігу</h3>
        <div className="text-foreground-muted body">
          Немає даних про погоду для розрахунку оптимального часу
        </div>
      </div>
    );
  }

  const maxScore = Math.max(...best.map(slot => slot.score));
  
  return (
    <div className="glass rounded-2xl p-6 hover-lift">
      <h3 className="heading text-lg text-foreground mb-4">Найкращий час для бігу</h3>
      
      <div className="space-y-3">
        {best.slice(0, 3).map((timeSlot, index) => (
          <BestTimeSlot 
            key={timeSlot.time}
            timeSlot={timeSlot}
            rank={index + 1}
            maxScore={maxScore}
          />
        ))}
      </div>
      
      {best.length > 3 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-150 body">
            Показати більше часів →
          </button>
        </div>
      )}
    </div>
  );
}