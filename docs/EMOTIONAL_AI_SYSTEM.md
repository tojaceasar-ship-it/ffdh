# Emotional AI System - FFDH Rewir

## 🎭 Overview

The Emotional AI System is a sophisticated multi-agent simulation that brings FFDH's emotional intelligence to life. It consists of 9 distinct emotional agents that interact dynamically on a 2D emotional map, representing valence (positive/negative) and arousal (high/low) dimensions.

## 🧠 Core Architecture

### Emotional Agents
Each agent represents a fundamental emotion with:
- **Personality**: Unique behavioral traits and motivations
- **Archetype**: System role within the emotional ecosystem
- **Relationships**: Alliances and rivalries with other emotions
- **Movement Model**: Perlin noise + boids behavior + special impulses
- **Visual Identity**: Distinct shapes, colors, and animation styles

### Movement Simulation
```typescript
// Core movement algorithm
for (const agent of agents) {
  // Perlin noise for organic wandering
  const noise = perlin.noise2D(time * speed, seed);

  // Boids forces for social behavior
  const { separation, alignment, cohesion } = neighborhoodForces(agent, agents);

  // Emotional quadrant bias
  const quadrantForce = quadrantBias(agent.emotionalProfile);

  // Special movement modifiers (levy flights, bursts, etc.)
  const specialForces = applySpecials(agent.params);

  // Edge repulsion
  const boundaryForce = edgeRepel(position, bounds);

  // Smooth velocity integration
  velocity = lerp(velocity, totalForces, smoothing);
  position = position.add(velocity).wrap(bounds);
}
```

## 🎯 Agent Profiles

### 1. Joy ☀️ (Zapalna Iskra)
- **Role**: Creative catalyst, energy booster
- **Movement**: Perlin + boids, high energy bursts
- **Quadrant**: Positive-High arousal
- **Interactions**: Attracts to curiosity, repels from fear

### 2. Fear 🜏 (Cień Analityczny)
- **Role**: Risk validator, safety enforcer
- **Movement**: Perlin + avoidance, conservative patterns
- **Quadrant**: Negative-High arousal
- **Interactions**: Attracts to peace, repels from joy

### 3. Anger ⚡ (Strażnik Granic)
- **Role**: Quality enforcer, boundary setter
- **Movement**: Perlin + impulse bursts, aggressive patterns
- **Quadrant**: Negative-High arousal
- **Interactions**: Attracts to disgust, repels from peace

### 4. Nostalgia ⌛ (Archiwista)
- **Role**: Memory integrator, continuity maintainer
- **Movement**: Perlin + orbital, stable circular patterns
- **Quadrant**: Positive-Low arousal
- **Interactions**: Attracts to peace/love, repels from chaos

### 5. Curiosity ❔ (Wędrowiec)
- **Role**: Exploration driver, question generator
- **Movement**: Perlin + levy flights, unpredictable jumps
- **Quadrant**: Center-High arousal
- **Interactions**: Attracts to joy/chaos, repels from peace

### 6. Peace 🕊️ (Mediator)
- **Role**: Harmony maintainer, rhythm stabilizer
- **Movement**: Perlin + smoothing, calm predictable motion
- **Quadrant**: Positive-Low arousal
- **Interactions**: Attracts to nostalgia/love, repels from anger

### 7. Love ❤ (Integrator)
- **Role**: Relationship builder, narrative connector
- **Movement**: Perlin + gravity wells, attractive orbital motion
- **Quadrant**: Positive-Medium arousal
- **Interactions**: Attracts to peace/nostalgia, repels from disgust

### 8. Chaos ∞ (Katalizator)
- **Role**: Structure disruptor, innovation catalyst
- **Movement**: Perlin + jitter + levy, highly erratic patterns
- **Quadrant**: All quadrants, prefers edges
- **Interactions**: Attracts to curiosity, repels from nostalgia/peace

### 9. Disgust ✖ (Filtr)
- **Role**: Quality controller, artifact remover
- **Movement**: Perlin + gatekeeping, defensive positioning
- **Quadrant**: Negative-Medium arousal
- **Interactions**: Attracts to anger, repels from love/chaos

## 🎨 Visual Design

### Emotional Map
- **X-axis**: Arousal (Low ← → High)
- **Y-axis**: Valence (Negative ← → Positive)
- **Quadrants**: 4 emotional regions with distinct behaviors

### Agent Visualization
Each agent has unique visual characteristics:
- **Shape**: Geometric forms representing emotional essence
- **Color**: Distinct hue for instant recognition
- **Glow**: Dynamic lighting effects
- **Trail**: Movement history visualization
- **Symbol**: Unicode emoji for emotional identity

## 🔧 Technical Implementation

### Core Components

#### `emotionalAgents.ts`
```typescript
export interface EmotionalAgent {
  id: string;
  name: string;
  archetype: string;
  personality: string;
  motivation: string;
  fear: string;
  color: string;
  symbol: string;
  voice_style: string;
  speech_example: string;
  relationships: { ally: string; rival: string };
  system_role: string;
  scene_behavior: string;
  visual: { shape: string; glow: string; trail: string };
  movement: {
    model: string;
    params: Record<string, any>;
    interactions: {
      attractTo: string[];
      repelFrom: string[];
      bias: { quadrants: string; strength: number };
    };
  };
  state: { energy: number; influence: number };
  modes: {
    on_scene: string;
    on_user: string;
    on_emotions: string;
  };
}
```

#### `EmotionMovementSimulator`
- **Perlin Noise**: Organic wandering patterns
- **Boids Algorithm**: Social interaction forces
- **Quadrant Bias**: Emotional map positioning
- **Special Impulses**: Levy flights, bursts, orbital motion
- **Edge Repulsion**: Boundary awareness

#### `EmotionMap.tsx`
React component providing:
- **Canvas Rendering**: 60fps animation loop
- **Interactive Controls**: Play/pause, reset
- **Agent Selection**: Click to inspect details
- **Responsive Design**: Adaptive to container size

## 🎮 Usage Examples

### Basic Visualization
```tsx
import EmotionMap from '@/components/EmotionMap';

function RewirScene() {
  return (
    <div className="rewir-container">
      <EmotionMap
        width={800}
        height={600}
        showLabels={true}
        interactive={true}
      />
    </div>
  );
}
```

### Emotional State Integration
```typescript
// Connect to user emotional state
const userEmotion = detectUserEmotion(text);
const activeAgents = getAgentsForEmotion(userEmotion);

// Update simulation based on user input
simulator.adjustAgentEnergy(activeAgents, userEmotion.intensity);
```

### Scene Generation
```typescript
// Use agent positions for creative prompts
const agentPositions = simulator.getAgents();
const creativePrompt = generatePromptFromPositions(agentPositions);

// Feed into AI for scene generation
const scene = await generateScene(creativePrompt);
```

## 🔬 Research Foundation

### Psychological Models
- **Circumplex Model**: Russell's 2D emotion representation
- **Core Affect**: Valence/arousal dimensions
- **Emotional Contagion**: Agent-to-agent influence
- **Boids Algorithm**: Reynolds flocking behavior

### AI Integration
- **Prompt Engineering**: Position-based creative generation
- **Emotional Context**: Agent states inform AI responses
- **Dynamic Storytelling**: Real-time narrative adaptation

## 🚀 Future Enhancements

### Advanced Features
- **Multi-user Synchronization**: Shared emotional spaces
- **Emotional Learning**: Agent adaptation to user patterns
- **Audio Integration**: Emotional soundscapes
- **Haptic Feedback**: Physical emotional responses
- **VR/AR Support**: Immersive emotional experiences

### Performance Optimizations
- **WebGL Rendering**: GPU-accelerated visualization
- **Spatial Partitioning**: Efficient neighbor detection
- **LOD System**: Detail level based on interaction
- **Background Simulation**: Continuous emotional processing

## 📚 Integration Guide

### Quick Start
1. Import emotional agents configuration
2. Initialize movement simulator
3. Create EmotionMap component
4. Connect to user interactions

### API Reference
- `EmotionMovementSimulator`: Core simulation engine
- `EmotionalAgent`: Agent data structure
- `EmotionMap`: React visualization component
- `EMOTIONAL_AGENTS`: Pre-configured agent array

### Customization
- Modify agent parameters for different behaviors
- Extend movement models with new algorithms
- Customize visual styles and animations
- Integrate with external emotional detection systems

## 🎭 Creative Applications

### Rewir Scene Generation
- **Dynamic Prompts**: Agent positions create unique story starters
- **Emotional Context**: Agent states inform narrative tone
- **Interactive Evolution**: User interactions modify agent behaviors

### Therapeutic Applications
- **Emotional Awareness**: Visual representation of emotional states
- **Guided Exploration**: Agent interactions teach emotional dynamics
- **Personal Growth**: Pattern recognition in emotional responses

### Educational Tools
- **Psychology Learning**: Interactive emotion models
- **Creative Writing**: Emotional character development
- **Art Therapy**: Visual emotional expression

---

*This emotional AI system transforms abstract emotional concepts into living, breathing digital entities that can enhance user experiences across creative, therapeutic, and educational applications.*
