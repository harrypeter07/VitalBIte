'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create floating food-like shapes
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshPhongMaterial({
      color: 0xFF6B6B,
      opacity: 0.6,
      transparent: true,
    });

    const shapes: THREE.Mesh[] = [];
    for (let i = 0; i < 20; i++) {
      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      );
      shape.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      shapes.push(shape);
      scene.add(shape);
    }

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x4ECDC4, 0.5);
    scene.add(ambientLight);

    camera.position.z = 15;

    let animationFrameId: number;

    // Animation loop
    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      shapes.forEach((shape, i) => {
        shape.rotation.x += 0.001 * (i % 2 ? 1 : -1);
        shape.rotation.y += 0.002 * (i % 3 ? 1 : -1);
        shape.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
      });

      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(to bottom right, #2C3E50, #3498db)' }}
    />
  );
}
