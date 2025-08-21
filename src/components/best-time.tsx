import { type HourPoint, fmtHH, getRunningCondition } from "@/lib/weather-utils";
import { t } from "@/lib/translations";


interface BestTimeSlotProps {
  timeSlot: HourPoint;
  rank: number;
  language?: "EN" | "UA";
}

function BestTimeSlot({ timeSlot, rank, language = "UA" }: BestTimeSlotProps) {
  const medals = ['🥇', '🥈', '🥉'];
  const medal = medals[rank - 1] || '🏃';
  const runningCondition = getRunningCondition(timeSlot, language);

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
              {t("rankBestTime", language).replace("{rank}", rank.toString())}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="body-medium text-foreground text-lg">
            {Math.round(timeSlot.t)}°C
          </div>
          {Math.abs(timeSlot.feelsLike - timeSlot.t) > 2 && (
            <div className="text-xs text-foreground-muted">
              {t("feelsLike", language)} {Math.round(timeSlot.feelsLike)}°
            </div>
          )}
        </div>
      </div>
      
      {/* Why this time is good for running */}
      <div className="bg-card-hover rounded-lg p-3 mb-3">
        <div className="text-xs font-medium text-foreground mb-2">
          {runningCondition.explanation}
        </div>
        <div className="space-y-1">
          {runningCondition.factors.map((factor, index) => (
            <div key={index} className="text-xs text-foreground-muted">
              {factor}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface BestTimeCardProps {
  best: HourPoint[];
  language?: "EN" | "UA";
}

export function BestTimeCard({ best, language = "UA" }: BestTimeCardProps) {
  if (!best.length) {
    return (
      <div className="glass rounded-2xl p-6">
        <h3 className="heading text-lg text-foreground mb-4">{t("bestTimeForRunning", language)}</h3>
        <div className="text-foreground-muted body">
          {t("noWeatherDataForOptimal", language)}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 hover-lift">
      <h3 className="heading text-lg text-foreground mb-4">{t("bestTimeForRunning", language)}</h3>
      
      <div className="space-y-3">
        {best.slice(0, 3).map((timeSlot, index) => (
          <BestTimeSlot 
            key={timeSlot.time}
            timeSlot={timeSlot}
            rank={index + 1}
            language={language}
          />
        ))}
      </div>
      
      {best.length > 3 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-150 body">
            {t("showMoreTimes", language)}
          </button>
        </div>
      )}
    </div>
  );
}