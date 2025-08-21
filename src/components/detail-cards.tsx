import { Chip } from "./weather-badges";
import { DetailedOutfit } from "@/lib/weather-utils";
import { t } from "@/lib/translations";

interface WearCardProps {
  outfit: DetailedOutfit;
  language?: "EN" | "UA";
}

export function WearCard({ outfit, language = "UA" }: WearCardProps) {
  return (
    <div className="glass rounded-2xl p-6 hover-lift">
      <h3 className="heading text-lg text-foreground mb-4">{t("whatToWear", language)}</h3>
      
      <div className="space-y-4">
        {/* Basic clothing */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">👕</div>
            <div className="flex-1">
              <div className="body-medium text-foreground text-sm">{t("top", language)}</div>
              <div className="body text-foreground-muted text-sm">{outfit.top}</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="text-2xl">🩳</div>
            <div className="flex-1">
              <div className="body-medium text-foreground text-sm">{t("bottom", language)}</div>
              <div className="body text-foreground-muted text-sm">{outfit.bottom}</div>
            </div>
          </div>
        </div>

        {/* Footwear */}
        {outfit.footwear.length > 0 && (
          <div className="border-t border-card-border pt-3">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">👟</div>
              <div className="flex-1">
                <div className="body-medium text-foreground text-sm mb-2">{t("footwearSocks", language)}</div>
                <div className="flex flex-wrap gap-1">
                  {outfit.footwear.map((item, index) => (
                    <Chip key={index} size="sm">
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Headwear */}
        {outfit.headwear.length > 0 && (
          <div className="border-t border-card-border pt-3">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🧢</div>
              <div className="flex-1">
                <div className="body-medium text-foreground text-sm mb-2">{t("headwearGlasses", language)}</div>
                <div className="flex flex-wrap gap-1">
                  {outfit.headwear.map((item, index) => (
                    <Chip key={index} variant="gradient" size="sm">
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accessories */}
        {outfit.accessories.length > 0 && (
          <div className="border-t border-card-border pt-3">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🧤</div>
              <div className="flex-1">
                <div className="body-medium text-foreground text-sm mb-2">{t("accessories", language)}</div>
                <div className="flex flex-wrap gap-1">
                  {outfit.accessories.map((item, index) => (
                    <Chip key={index} size="sm">
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Extras */}
        {outfit.extras.length > 0 && (
          <div className="border-t border-card-border pt-3">
            <div className="body-medium text-foreground text-sm mb-2">{t("additional", language)}</div>
            <div className="flex flex-wrap gap-1">
              {outfit.extras.map((extra, index) => (
                <Chip key={index} variant="gradient" size="sm">
                  {extra}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface SPFCardProps {
  spf: {
    spf: number;
    note: string;
  };
  language?: "EN" | "UA";
}

export function SPFCard({ spf, language = "UA" }: SPFCardProps) {
  const getSPFColor = (spfValue: number) => {
    if (spfValue >= 50) return 'text-pink';
    if (spfValue >= 30) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="glass rounded-2xl p-6 hover-lift">
      <h3 className="heading text-lg text-foreground mb-4">{t("sunProtection", language)}</h3>
      
      <div className="flex items-center space-x-4 mb-3">
        <div className="text-4xl">☀️</div>
        <div>
          <div className={`text-3xl font-bold ${getSPFColor(spf.spf)}`}>
            SPF {spf.spf}
          </div>
        </div>
      </div>
      
      <div className="body text-foreground-muted text-sm">
        {spf.note}
      </div>
    </div>
  );
}

interface HydrationCardProps {
  water: {
    ml: number;
    electrolyte: boolean;
    beforeWorkout: number;
    duringWorkout: number;
    afterWorkout: number;
    recommendation: string;
  };
  language?: "EN" | "UA";
}

export function HydrationCard({ water, language = "UA" }: HydrationCardProps) {
  return (
    <div className="glass rounded-2xl p-6 hover-lift">
      <h3 className="heading text-lg text-foreground mb-4">{t("hydration", language)}</h3>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-4xl">💧</div>
        <div>
          <div className="text-3xl font-bold text-blue">
{water.ml} {language === "EN" ? "ml" : "мл"}
          </div>
          <div className="body text-foreground-muted text-sm">
{t("totalWaterAmount", language)}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-card rounded-lg">
            <div className="text-lg font-bold text-blue">{water.beforeWorkout}</div>
            <div className="text-xs text-foreground-muted">{t("before", language)}</div>
          </div>
          <div className="p-3 bg-card rounded-lg">
            <div className="text-lg font-bold text-pink">{water.duringWorkout}</div>
            <div className="text-xs text-foreground-muted">{t("during", language)}</div>
          </div>
          <div className="p-3 bg-card rounded-lg">
            <div className="text-lg font-bold text-blue">{water.afterWorkout}</div>
            <div className="text-xs text-foreground-muted">{t("after", language)}</div>
          </div>
        </div>

        <div className="p-3 bg-card-hover rounded-lg">
          <div className="body text-foreground-muted text-sm">
            💡 {water.recommendation}
          </div>
        </div>
      </div>
      
      {water.electrolyte && (
        <div className="flex flex-wrap gap-2">
          <Chip variant="gradient" size="sm">
{t("electrolytesRecommended", language)}
          </Chip>
        </div>
      )}
    </div>
  );
}

interface SafetyWarningProps {
  warnings: string[];
  language?: "EN" | "UA";
}

export function SafetyWarning({ warnings, language = "UA" }: SafetyWarningProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-500/20 to-pink/20 border border-red-500/30 rounded-2xl p-4">
      <div className="flex items-start space-x-3">
        <div className="text-2xl">⚠️</div>
        <div>
          <h4 className="heading text-foreground text-sm mb-2">{t("warning", language)}</h4>
          <ul className="space-y-1">
            {warnings.map((warning, index) => (
              <li key={index} className="body text-foreground-muted text-sm flex items-start space-x-2">
                <span>•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}