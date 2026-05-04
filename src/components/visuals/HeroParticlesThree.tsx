import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function isWebGLAvailable(): boolean {
    try {
        const canvas = document.createElement('canvas');
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext('webgl2') || canvas.getContext('webgl'))
        );
    } catch {
        return false;
    }
}

export default function HeroParticlesThree() {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        if (rendererRef.current) return;
        if (!isWebGLAvailable()) return;

        // --- SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 2;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // --- PARTICLES ---
        const particlesGeometry = new THREE.BufferGeometry();
        const count = 1500;
        const posArray = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) posArray[i] = (Math.random() - 0.5) * 8;
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const isLight = document.documentElement.classList.contains('light');
        const material = new THREE.PointsMaterial({
            size: 0.008,
            color: new THREE.Color(isLight ? '#171717' : '#ffffff'),
            transparent: true,
            opacity: isLight ? 0.6 : 0.3,
            sizeAttenuation: true,
        });

        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);

        // --- HANDLERS ---
        const handleScroll = () => {
            if (!containerRef.current) return;
            const opacity = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.8));
            containerRef.current.style.opacity = String(opacity);
            containerRef.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
        };

        let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX / window.innerWidth - 0.5;
            mouseY = e.clientY / window.innerHeight - 0.5;
        };

        const updateTheme = () => {
            const lite = document.documentElement.classList.contains('light');
            material.color.set(lite ? '#171717' : '#ffffff');
            material.opacity = lite ? 0.3 : 0.4;
        };

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousemove', handleMouseMove);

        // --- ANIMATION LOOP ---
        const clock = new THREE.Clock();
        let animationFrameId: number;

        const animate = () => {
            if (containerRef.current?.style.opacity === '0') {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }
            const t = clock.getElapsedTime();
            particlesMesh.rotation.y = t * 0.05;
            particlesMesh.rotation.x = t * 0.01;
            targetX = mouseX * 0.5;
            targetY = mouseY * 0.5;
            particlesMesh.rotation.y += 0.5 * (targetX - particlesMesh.rotation.y) * 0.1;
            particlesMesh.rotation.x += 0.5 * (targetY - particlesMesh.rotation.x) * 0.1;
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        handleScroll();

        // --- CLEANUP ---
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousemove', handleMouseMove);
            observer.disconnect();
            if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            particlesGeometry.dispose();
            material.dispose();
            renderer.forceContextLoss();
            renderer.dispose();
            rendererRef.current = null;
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-75 ease-out"
        />
    );
}
