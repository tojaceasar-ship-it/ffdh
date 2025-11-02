'use client';

import React, { useEffect, useRef, useState } from 'react';
import EmotionMovementSimulator, { EmotionalAgentInstance } from '../utils/emotionMovement';
import { EMOTIONAL_AGENTS } from '../config/emotionalAgents';

interface EmotionMapProps {
  width?: number;
  height?: number;
  showLabels?: boolean;
  interactive?: boolean;
}

export default function EmotionMap({
  width = 800,
  height = 600,
  showLabels = true,
  interactive = true
}: EmotionMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulatorRef = useRef<EmotionMovementSimulator | null>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<EmotionalAgentInstance | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize simulator
    simulatorRef.current = new EmotionMovementSimulator({ width, height });

    // Animation loop
    const animate = () => {
      if (!simulatorRef.current || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update simulation
      if (isPlaying) {
        simulatorRef.current.update(0.016, { width, height }); // ~60fps
      }

      // Draw agents
      const agents = simulatorRef.current.getAgents();
      agents.forEach(agent => {
        drawAgent(ctx, agent);
      });

      // Draw quadrant labels
      drawQuadrants(ctx, width, height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, isPlaying]);

  const drawAgent = (ctx: CanvasRenderingContext2D, agent: EmotionalAgentInstance) => {
    const { position, visual, color, symbol, name } = agent;

    ctx.save();

    // Draw trail (simple fade effect)
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(position.x, position.y, 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw main agent
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    // Draw based on shape
    switch (visual.shape) {
      case 'pulsujący okrąg spiralny':
        // Pulsing spiral circle
        const pulse = Math.sin(Date.now() * 0.005) * 0.5 + 1;
        ctx.beginPath();
        ctx.arc(position.x, position.y, 8 * pulse, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'wąski elipsowy znacznik':
        // Elliptical marker
        ctx.beginPath();
        ctx.ellipse(position.x, position.y, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'ostry trójkąt':
        // Sharp triangle
        ctx.beginPath();
        ctx.moveTo(position.x, position.y - 8);
        ctx.lineTo(position.x - 6, position.y + 6);
        ctx.lineTo(position.x + 6, position.y + 6);
        ctx.closePath();
        ctx.fill();
        break;

      case 'okrąg z orbitami':
        // Circle with orbits
        ctx.beginPath();
        ctx.arc(position.x, position.y, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(position.x, position.y, 12, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'falująca kropka':
        // Waving dot
        const wave = Math.sin(Date.now() * 0.01) * 2;
        ctx.beginPath();
        ctx.arc(position.x + wave, position.y, 5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'miękki okrąg':
        // Soft circle
        ctx.beginPath();
        ctx.arc(position.x, position.y, 7, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'koncentryczne kręgi':
        // Concentric circles
        ctx.beginPath();
        ctx.arc(position.x, position.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(position.x, position.y, 8, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'fraktalna plamka':
        // Fractal spot
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 3 + Math.sin(Date.now() * 0.003 + i) * 2;
          const x = position.x + Math.cos(angle) * radius;
          const y = position.y + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;

      case 'kwadrat z ostrymi rogami':
        // Square with sharp corners
        ctx.beginPath();
        ctx.rect(position.x - 5, position.y - 5, 10, 10);
        ctx.fill();
        break;

      default:
        // Default circle
        ctx.beginPath();
        ctx.arc(position.x, position.y, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw symbol
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, position.x, position.y);

    // Draw label if enabled
    if (showLabels) {
      ctx.fillStyle = color;
      ctx.font = '10px Arial';
      ctx.fillText(name, position.x, position.y + 20);
    }

    ctx.restore();
  };

  const drawQuadrants = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    ctx.setLineDash([5, 5]);

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Quadrant labels
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    ctx.fillText('High Arousal', width * 0.75, height * 0.25);
    ctx.fillText('Low Arousal', width * 0.25, height * 0.25);
    ctx.fillText('High Arousal', width * 0.75, height * 0.75);
    ctx.fillText('Low Arousal', width * 0.25, height * 0.75);

    ctx.restore();
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive || !simulatorRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked agent
    const agents = simulatorRef.current.getAgents();
    for (const agent of agents) {
      const distance = Math.sqrt(
        Math.pow(agent.position.x - x, 2) + Math.pow(agent.position.y - y, 2)
      );
      if (distance < 20) {
        setSelectedAgent(agent);
        break;
      }
    }
  };

  return (
    <div className="emotion-map-container">
      <div className="controls mb-4 flex gap-4 items-center">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-neon-yellow text-black font-bold rounded hover:bg-neon-yellow/90 transition-colors"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={() => simulatorRef.current?.reset({ width, height })}
          className="px-4 py-2 border border-white/20 text-white rounded hover:bg-white/10 transition-colors"
        >
          Reset
        </button>

        <div className="text-white/70 text-sm">
          Emotional AI Agents: {EMOTIONAL_AGENTS.length} active
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        className="border border-white/20 rounded-lg bg-black cursor-pointer"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      {selectedAgent && (
        <div className="mt-4 p-4 bg-white/10 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedAgent.symbol}</span>
            <div>
              <h3 className="text-white font-bold">{selectedAgent.name}</h3>
              <p className="text-white/70 text-sm">{selectedAgent.archetype}</p>
            </div>
          </div>
          <p className="text-white/80 mt-2">{selectedAgent.personality}</p>
          <div className="mt-2 text-sm text-white/60">
            Energy: {(selectedAgent.state.energy * 100).toFixed(0)}% |
            Influence: {(selectedAgent.state.influence * 100).toFixed(0)}%
          </div>
        </div>
      )}

      <div className="mt-4 text-white/50 text-sm">
        <p>Click on agents to see their details. The map shows emotional valence (vertical) vs arousal (horizontal).</p>
      </div>
    </div>
  );
}
