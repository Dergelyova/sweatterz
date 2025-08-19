import { WeatherClient } from "@/components/weather-client";

export default function RunReadyPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <WeatherClient />
      </div>
    </div>
  );
}
