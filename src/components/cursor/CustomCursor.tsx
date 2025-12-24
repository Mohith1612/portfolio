import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!visible) setVisible(true);
        };

        const onMouseEnter = () => setVisible(true);
        const onMouseLeave = () => setVisible(false);

        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a, button, input, textarea, [role="button"]')) {
                setHovered(true);
            } else {
                setHovered(false);
            }
        }

        if (window.matchMedia('(pointer: fine)').matches) {
            window.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseenter', onMouseEnter);
            document.addEventListener('mouseleave', onMouseLeave);
            document.addEventListener('mouseover', onMouseOver);
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseenter', onMouseEnter);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseover', onMouseOver);
        };
    }, [visible]);

    // Don't render on touch devices logic inside effect or here
    // returning null if not visible yet or touch

    return (
        <div
            className="fixed pointer-events-none z-[9999] mix-blend-difference top-0 left-0"
            style={{
                transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%) scale(${hovered ? 1.5 : 1})`,
                transition: 'transform 0.1s ease-out',
                display: visible ? 'block' : 'none'
            }}
        >
            <div className="w-3 h-3 rounded-full bg-accent" />
        </div>
    );
}
