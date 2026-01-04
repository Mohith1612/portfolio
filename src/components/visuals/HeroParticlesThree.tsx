import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroParticlesThree() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- SETUP ---
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 2; // Close up for immersion

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // --- PARTICLES ---
        const particlesGeometry = new THREE.BufferGeometry();
        const count = 1500;

        const posArray = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 8;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Initial Color based on theme
        const isLight = document.documentElement.classList.contains('light');
        const color = isLight ? '#171717' : '#ffffff';

        const material = new THREE.PointsMaterial({
            size: 0.008,
            color: new THREE.Color(color),
            transparent: true,
            opacity: isLight ? 0.6 : 0.3,
            sizeAttenuation: true,
        });

        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);

        // --- SCROLL OPACITY HANDLER ---
        const handleScroll = () => {
            if (!containerRef.current) return;
            const scrollY = window.scrollY;
            // Fade out over the first 80vh (approx 700px on typical screens)
            const fadeEnd = window.innerHeight * 0.8;
            const opacity = Math.max(0, 1 - (scrollY / fadeEnd));

            containerRef.current.style.opacity = opacity.toString();
            // Optional: Pause rendering if opacity is 0 for performance
            if (opacity === 0) {
                containerRef.current.style.visibility = 'hidden';
            } else {
                containerRef.current.style.visibility = 'visible';
            }
        };

        // --- INTERACTION STATE ---
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        // --- HANDLERS ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const handleMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX / window.innerWidth) - 0.5;
            mouseY = (event.clientY / window.innerHeight) - 0.5;
        };

        const updateTheme = () => {
            const isLite = document.documentElement.classList.contains('light');
            const newColor = isLite ? '#171717' : '#ffffff';
            material.color.set(newColor);
            material.opacity = isLite ? 0.3 : 0.4;
        };

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousemove', handleMouseMove);

        // --- ANIMATION LOOP ---
        const clock = new THREE.Clock();

        const animate = () => {
            // Optimization: Don't render if fully scrolled out
            if (containerRef.current && containerRef.current.style.opacity === '0') {
                requestAnimationFrame(animate);
                return;
            }

            const elapsedTime = clock.getElapsedTime();

            particlesMesh.rotation.y = elapsedTime * 0.05;
            particlesMesh.rotation.x = elapsedTime * 0.01;

            targetX = mouseX * 0.5;
            targetY = mouseY * 0.5;

            particlesMesh.rotation.y += 0.5 * (targetX - particlesMesh.rotation.y) * 0.1;
            particlesMesh.rotation.x += 0.5 * (targetY - particlesMesh.rotation.x) * 0.1;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();
        handleScroll(); // Init Check

        // --- CLEANUP ---
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousemove', handleMouseMove);
            observer.disconnect();

            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }

            particlesGeometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-75 ease-out" />;
}
