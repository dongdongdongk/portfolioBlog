'use client'

import { useEffect, useState } from 'react'

interface AnimatedBackgroundProps {
  className?: string
}

export default function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      left: number
      top: number
      delay: number
      duration: number
      size: number
      color: string
    }>
  >([])

  useEffect(() => {
    // Generate random particles with different properties for smooth floating animation
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 8 + Math.random() * 4, // Longer duration for smoother movement
      size: Math.random() * 8 + 4,
      color:
        i % 4 === 0
          ? 'bg-blue-500/12'
          : i % 4 === 1
            ? 'bg-primary-500/12'
            : i % 4 === 2
              ? 'bg-purple-500/12'
              : 'bg-cyan-500/12',
    }))
    setParticles(newParticles)
  }, [])

  return (
    <>
      {/* CSS Keyframes for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.4;
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-10px) translateX(-15px) rotate(180deg);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-30px) translateX(5px) rotate(270deg);
            opacity: 0.9;
          }
        }

        @keyframes pulse-gentle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>

      <div className={`absolute inset-0 ${className}`}>
        {/* Main gradient layers */}
        <div className="from-primary-500/8 absolute inset-0 bg-gradient-to-br via-transparent to-blue-500/8"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/6 via-transparent to-cyan-500/6"></div>

        {/* Large gradient orbs with gentle pulsing */}
        <div
          className="to-primary-500/8 absolute top-0 left-0 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/12 blur-3xl"
          style={{
            animation: 'pulse-gentle 6s ease-in-out infinite',
          }}
        ></div>
        <div
          className="absolute top-20 right-0 h-80 w-80 rounded-full bg-gradient-to-bl from-purple-500/10 to-pink-500/6 blur-3xl"
          style={{
            animation: 'pulse-gentle 8s ease-in-out infinite',
            animationDelay: '3s',
          }}
        ></div>
        <div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gradient-to-tr from-cyan-500/8 to-teal-500/6 blur-3xl"
          style={{
            animation: 'pulse-gentle 7s ease-in-out infinite',
            animationDelay: '1.5s',
          }}
        ></div>

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/30 to-transparent"></div>

        {/* Floating Particles with smooth movement */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full transition-all duration-1000 ${particle.color}`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>
      </div>
    </>
  )
}
