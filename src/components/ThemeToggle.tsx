import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative p-1.5 rounded-lg transition-all',
        'bg-background/30 hover:bg-background/50 border border-border/50',
        'hover:border-primary/50'
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dim'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-muted-foreground" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400" />
      )}
    </button>
  );
};

export default ThemeToggle;
