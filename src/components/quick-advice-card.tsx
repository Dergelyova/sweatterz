import { WeatherBadges } from "./weather-badges";
import { type HourPoint, fmtHH } from "@/lib/weather-utils";
import { t } from "@/lib/translations";

interface QuickAdviceCardProps {
  loading: boolean;
  error: string | null;
  quick: string | null;
  current: HourPoint | null;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  selectedDate: string;
  selectedHour?: HourPoint | null;
  language?: "EN" | "UA";
}

export function QuickAdviceCard({ 
  loading, 
  error, 
  quick, 
  current,
  lastUpdated,
  onRefresh,
  selectedDate,
  selectedHour,
  language = "UA"
}: QuickAdviceCardProps) {
  return (
    <div className="gradient-border rounded-2xl p-6 hover-lift relative overflow-hidden">
      {/* Background gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue/5 to-pink/5 pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="heading text-xl text-foreground">
              {t("quickAdvice", language)}
            </h2>
            {/* Date and Time Context */}
            <div className="text-sm text-blue body-medium space-y-1">
              {selectedDate !== new Date().toISOString().split('T')[0] ? (
                <div>
                  {new Date(selectedDate).toLocaleDateString(language === "EN" ? 'en-US' : 'uk-UA', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              ) : (
                <div>
                  {language === "EN" ? "Today" : "Сьогодні"}
                </div>
              )}
              {selectedHour && (
                <div className="text-xs">
                  {(() => {
                    const now = new Date();
                    const selectedTime = new Date(selectedHour.time);
                    const isToday = selectedDate === now.toISOString().split('T')[0];
                    const isCurrentHour = isToday && 
                      selectedTime.getHours() === now.getHours() &&
                      selectedTime.getDate() === now.getDate();
                    
                    return isCurrentHour ? t("now", language) : fmtHH(selectedHour.time);
                  })()}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {lastUpdated && (
              <div className="text-xs text-foreground-muted body">
                {t("updatedJustNow", language)}
              </div>
            )}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className="p-2 text-foreground-muted hover:text-foreground transition-colors duration-150 rounded-lg hover:bg-card/50 disabled:opacity-50"
                aria-label={t("refreshForecast", language)}
              >
                <svg 
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="mb-4">
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue border-t-transparent rounded-full animate-spin" />
              <span className="body text-foreground-muted">{t("loading", language)}</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center space-x-2 text-red-400">
              <span className="text-lg">⚠️</span>
              <span className="body text-red-400">{error}</span>
            </div>
          )}
          
          {!loading && !error && quick && (
            <div className="body text-white text-lg leading-relaxed font-medium">
              {quick}
            </div>
          )}
        </div>

        {!loading && !error && current && (
          <div className="border-t border-card-border pt-4">
            <div className="text-xs text-foreground-muted body uppercase tracking-wide mb-2">
              {(() => {
                const now = new Date();
                const isToday = selectedDate === now.toISOString().split('T')[0];
                const isCurrentHour = selectedHour && new Date(selectedHour.time).getHours() === now.getHours() && isToday;
                
                if (isCurrentHour) {
                  return t("currentConditions", language);
                } else {
                  return t("conditions", language);
                }
              })()}
            </div>
            <WeatherBadges
              temperature={current.t}
              feelsLike={current.feelsLike}
              humidity={current.rh}
              windSpeed={current.wind}
              uvIndex={current.uv}
              precipProbability={current.precip}
              language={language}
            />
          </div>
        )}
      </div>
    </div>
  );
}