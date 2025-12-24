import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Reveal after 100px
            if (window.scrollY > 100) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'About', href: '#about' },
        { name: 'Work', href: '#experience' },
        { name: 'Projects', href: '#projects' },
        { name: 'Writing', href: '#writing' },
    ];

    return (
        <nav
            className={cn(
                "fixed top-6 left-0 right-0 z-40 flex justify-center transition-all duration-700 ease-out will-change-transform",
                visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            )}
        >
            <div className="flex items-center gap-8 backdrop-blur-md px-8 py-3 rounded-full bg-background/80 border border-border/50 shadow-sm supports-[backdrop-filter]:bg-background/20">
                {navItems.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {item.name}
                    </a>
                ))}
            </div>
        </nav>
    );
}
