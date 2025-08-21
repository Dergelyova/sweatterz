"use client";

import { Slider } from "./slider";
import { t } from "@/lib/translations";

interface ControlsSectionProps {
  duration: number;
  setDuration: (duration: number) => void;
  gender: "male" | "female" | "prefer_not_to_say";
  setGender: (gender: "male" | "female" | "prefer_not_to_say") => void;
  intensity: "light" | "moderate" | "intense";
  setIntensity: (intensity: "light" | "moderate" | "intense") => void;
  allowDark: boolean;
  setAllowDark: (allowDark: boolean) => void;
  preferredTime: "any" | "morning" | "day" | "evening";
  setPreferredTime: (time: "any" | "morning" | "day" | "evening") => void;
  language?: "EN" | "UA";
}

interface SelectProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: Array<{ value: string | number; label: string }>;
}

function GradientSelect({ label, value, onChange, options }: SelectProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-xs text-foreground-subtle body uppercase tracking-wide">
        {label}
      </label>
      <select
        className="bg-card border border-card-border rounded-lg px-3 py-2 text-sm body text-foreground focus-gradient hover:border-foreground-muted transition-colors duration-150"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-card">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function GradientCheckbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`
          w-5 h-5 rounded border-2 transition-all duration-150 flex items-center justify-center
          ${checked 
            ? 'bg-gradient-to-r from-blue to-pink border-transparent' 
            : 'border-card-border group-hover:border-foreground-muted'
          }
        `}>
          {checked && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm body text-foreground group-hover:text-foreground-muted transition-colors duration-150">
        {label}
      </span>
    </label>
  );
}

export function ControlsSection({
  duration,
  setDuration,
  gender,
  setGender,
  intensity,
  setIntensity,
  allowDark,
  setAllowDark,
  preferredTime,
  setPreferredTime,
  language = "UA"
}: ControlsSectionProps) {
  const genderOptions = [
    { value: 'male', label: t('male', language) },
    { value: 'female', label: t('female', language) },
    { value: 'prefer_not_to_say', label: t('preferNotToSay', language) },
  ];

  const intensityOptions = [
    { value: 'light', label: t('lightWorkout', language) },
    { value: 'moderate', label: t('moderateWorkout', language) },
    { value: 'intense', label: t('intenseWorkout', language) },
  ];

  const timeOptions = [
    { value: 'any', label: t('anyTime', language) },
    { value: 'morning', label: t('morning', language) },
    { value: 'day', label: t('day', language) },
    { value: 'evening', label: t('evening', language) },
  ];

  const formatDuration = (value: number) => {
    const minutesLabel = t('minutes', language);
    const hoursLabel = t('hours', language);
    
    if (value < 60) return `${value} ${minutesLabel}`;
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return minutes === 0 ? `${hours} ${hoursLabel}` : `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="space-y-4">
        <Slider
          label={t('duration', language)}
          value={duration}
          onChange={setDuration}
          min={15}
          max={120}
          step={5}
          formatValue={formatDuration}
        />
        
        <GradientSelect
          label={t('intensity', language)}
          value={intensity}
          onChange={(value) => setIntensity(value as "light" | "moderate" | "intense")}
          options={intensityOptions}
        />
      </div>

      <div className="space-y-4">
        <GradientSelect
          label={t('gender', language)}
          value={gender}
          onChange={(value) => setGender(value as "male" | "female" | "prefer_not_to_say")}
          options={genderOptions}
        />
        
        <GradientSelect
          label={t('preferredTime', language)}
          value={preferredTime}
          onChange={(value) => setPreferredTime(value as "any" | "morning" | "day" | "evening")}
          options={timeOptions}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center pt-6">
          <GradientCheckbox
            label={t('allowDarkTime', language)}
            checked={allowDark}
            onChange={setAllowDark}
          />
        </div>
      </div>
    </div>
  );
}