interface HeaderProps {
  onLanguageChange?: (lang: string) => void;
  onSettingsClick?: () => void;
  currentLang?: string;
}

export function Header({ onLanguageChange, onSettingsClick, currentLang = 'EN' }: HeaderProps) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h1 className="logo text-4xl gradient-text">
          RUNREADY
        </h1>
        <div className="text-foreground-muted text-sm body hidden sm:block">
          Smart running weather advice
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onLanguageChange?.(currentLang === 'EN' ? 'UA' : 'EN')}
          className="px-3 py-1 text-sm body-medium text-foreground-muted hover:text-foreground transition-colors duration-150 rounded-lg hover:bg-card"
        >
          {currentLang}
        </button>
        
        <button
          onClick={onSettingsClick}
          className="p-2 text-foreground-muted hover:text-foreground transition-colors duration-150 rounded-lg hover:bg-card"
          aria-label="Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
}