import { createNoise2D } from 'simplex-noise';
import { EMOTIONAL_AGENTS, EmotionalAgent } from '../config/emotionalAgents';

export interface Vec2 {
  x: number;
  y: number;
}

export interface EmotionalAgentInstance extends EmotionalAgent {
  position: Vec2;
  velocity: Vec2;
  heading: number;
  seed: number;
}

export class EmotionMovementSimulator {
  private noise2D = createNoise2D();
  private agents: EmotionalAgentInstance[] = [];
  private time = 0;

  constructor(bounds: { width: number; height: number }) {
    this.initializeAgents(bounds);
  }

  private initializeAgents(bounds: { width: number; height: number }) {
    this.agents = EMOTIONAL_AGENTS.map(agent => ({
      ...agent,
      position: {
        x: Math.random() * bounds.width,
        y: Math.random() * bounds.height
      },
      velocity: { x: 0, y: 0 },
      heading: Math.random() * Math.PI * 2,
      seed: Math.random() * 1000
    }));
  }

  private randBetween([min, max]: [number, number]): number {
    return Math.random() * (max - min) + min;
  }

  private vec2(x: number, y: number): Vec2 {
    return { x, y };
  }

  private vec2FromAngle(angle: number): Vec2 {
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }

  private vec2Scale(v: Vec2, s: number): Vec2 {
    return { x: v.x * s, y: v.y * s };
  }

  private vec2Add(a: Vec2, b: Vec2): Vec2 {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  private vec2Sub(a: Vec2, b: Vec2): Vec2 {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  private vec2Distance(a: Vec2, b: Vec2): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private vec2Normalize(v: Vec2): Vec2 {
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    return len > 0 ? { x: v.x / len, y: v.y / len } : { x: 0, y: 0 };
  }

  private vec2Lerp(a: Vec2, b: Vec2, t: number): Vec2 {
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t
    };
  }

  private vec2Wrap(v: Vec2, bounds: { width: number; height: number }): Vec2 {
    return {
      x: ((v.x % bounds.width) + bounds.width) % bounds.width,
      y: ((v.y % bounds.height) + bounds.height) % bounds.height
    };
  }

  private neighborhoodForces(
    agent: EmotionalAgentInstance,
    allAgents: EmotionalAgentInstance[],
    params: { separation: number; alignment: number; cohesion: number }
  ): { sep: Vec2; ali: Vec2; coh: Vec2 } {
    let sep = { x: 0, y: 0 };
    let ali = { x: 0, y: 0 };
    let coh = { x: 0, y: 0 };

    let sepCount = 0;
    let aliCount = 0;
    let cohCount = 0;

    for (const other of allAgents) {
      if (other.id === agent.id) continue;

      const dist = this.vec2Distance(agent.position, other.position);
      if (dist > 0 && dist < 50) { // Neighborhood radius
        const diff = this.vec2Sub(agent.position, other.position);
        const normDiff = this.vec2Normalize(diff);

        // Separation
        if (dist < 20) {
          sep = this.vec2Add(sep, this.vec2Scale(normDiff, params.separation));
          sepCount++;
        }

        // Alignment
        ali = this.vec2Add(ali, other.velocity);
        aliCount++;

        // Cohesion
        coh = this.vec2Add(coh, other.position);
        cohCount++;
      }
    }

    // Average the forces
    if (sepCount > 0) sep = this.vec2Scale(sep, 1 / sepCount);
    if (aliCount > 0) ali = this.vec2Scale(ali, 1 / aliCount);
    if (cohCount > 0) {
      coh = this.vec2Scale(this.vec2Sub(coh, agent.position), 1 / cohCount);
      coh = this.vec2Normalize(coh);
      coh = this.vec2Scale(coh, params.cohesion);
    }

    return { sep, ali, coh };
  }

  private quadrantBias(bias: { quadrants: string; strength: number }): Vec2 {
    // Simplified quadrant bias - can be expanded based on emotional valence/arousal
    const biasStrength = bias.strength;
    let force = { x: 0, y: 0 };

    if (bias.quadrants.includes('pozytywny')) {
      force.y -= biasStrength; // Tend toward positive (top)
    }
    if (bias.quadrants.includes('negatywny')) {
      force.y += biasStrength; // Tend toward negative (bottom)
    }
    if (bias.quadrants.includes('wysoki')) {
      force.x += biasStrength; // Tend toward high arousal (right)
    }
    if (bias.quadrants.includes('niski')) {
      force.x -= biasStrength; // Tend toward low arousal (left)
    }

    return force;
  }

  private applySpecials(velocity: Vec2, params: Record<string, any>): Vec2 {
    // Apply special movement modifiers (levy flights, bursts, etc.)
    let modifiedVelocity = velocity;

    // Levy flight (occasional long jumps)
    if (params.levyJump && Math.random() < params.levyJump.prob) {
      const angle = Math.random() * Math.PI * 2;
      const jumpForce = this.vec2Scale(this.vec2FromAngle(angle), params.levyJump.multiplier);
      modifiedVelocity = this.vec2Add(modifiedVelocity, jumpForce);
    }

    // Impulse burst
    if (params.impulseBurst && Math.random() < 0.1) { // Random burst trigger
      const burstAngle = Math.random() * Math.PI * 2;
      const burstForce = this.vec2Scale(this.vec2FromAngle(burstAngle), params.impulseBurst.strength);
      modifiedVelocity = this.vec2Add(modifiedVelocity, burstForce);
    }

    return modifiedVelocity;
  }

  private edgeRepel(position: Vec2, bounds: { width: number; height: number }, strength: number): Vec2 {
    let force = { x: 0, y: 0 };

    // Repel from edges
    if (position.x < 50) force.x += strength;
    if (position.x > bounds.width - 50) force.x -= strength;
    if (position.y < 50) force.y += strength;
    if (position.y > bounds.height - 50) force.y -= strength;

    return force;
  }

  update(dt: number, bounds: { width: number; height: number }) {
    for (const agent of this.agents) {
      // Perlin noise for organic movement
      const n = this.noise2D(
        this.time * (agent.movement.params.noiseSpeed || 0.5),
        agent.seed
      ) - 0.5;

      // Base velocity from heading and speed
      let vel = this.vec2Scale(
        this.vec2FromAngle(agent.heading),
        this.randBetween(agent.movement.params.speed)
      );

      // Add noise and jitter
      vel = this.vec2Add(vel, this.vec2Scale({ x: n, y: -n }, agent.movement.params.wanderJitter));

      // Boids forces
      const { sep, ali, coh } = this.neighborhoodForces(agent, this.agents, {
        separation: agent.movement.params.separation || 0,
        alignment: agent.movement.params.alignment || 0,
        cohesion: agent.movement.params.cohesion || 0
      });

      vel = this.vec2Add(vel, sep);
      vel = this.vec2Add(vel, ali);
      vel = this.vec2Add(vel, coh);

      // Quadrant bias
      vel = this.vec2Add(vel, this.quadrantBias(agent.movement.interactions.bias));

      // Special movement modifiers
      vel = this.applySpecials(vel, agent.movement.params);

      // Edge repulsion
      vel = this.vec2Add(vel, this.edgeRepel(agent.position, bounds, agent.movement.params.edgeRepulsion));

      // Update velocity with smoothing
      agent.velocity = this.vec2Lerp(agent.velocity, vel, 0.25);

      // Update position
      agent.position = this.vec2Add(agent.position, this.vec2Scale(agent.velocity, dt));
      agent.position = this.vec2Wrap(agent.position, bounds);

      // Update heading based on velocity
      if (agent.velocity.x !== 0 || agent.velocity.y !== 0) {
        agent.heading = Math.atan2(agent.velocity.y, agent.velocity.x);
      }
    }

    this.time += dt;
  }

  getAgents(): EmotionalAgentInstance[] {
    return this.agents;
  }

  getAgentById(id: string): EmotionalAgentInstance | undefined {
    return this.agents.find(agent => agent.id === id);
  }

  reset(bounds: { width: number; height: number }) {
    this.initializeAgents(bounds);
    this.time = 0;
  }
}

export default EmotionMovementSimulator;
