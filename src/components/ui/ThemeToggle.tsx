import { useEffect, useState } from 'react';
import { getTheme, setTheme } from '@/lib/theme';

export default function ThemeToggle({ className = '' }: { className?: string }) {
    const [theme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const t = getTheme();
        setCurrentTheme(t);
        // Ensure matches logic
        setTheme(t);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        setCurrentTheme(newTheme);
    };

    if (!mounted) return <div className={`w-8 h-8 ${className}`} />;

    return (
        <button
            onClick={toggleTheme}
            className={`relative z-[60] p-2 text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-all active:scale-95 ${className}`}
            aria-label="Toggle theme"
        >
            <span className="sr-only">Switch to {theme === 'light' ? 'dark' : 'light'} mode</span>
            {theme === 'light' ? 'Dark' : 'Light'}
        </button>
    );
}
