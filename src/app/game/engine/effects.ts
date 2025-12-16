import { Vector2 } from './types';

// Individual particle
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  gravity: number;
  friction: number;
  fadeOut: boolean;
  shrink: boolean;
  rotation?: number;
  rotationSpeed?: number;
}

// Particle emitter configuration
export interface ParticleConfig {
  count: number;
  speed: { min: number; max: number };
  angle: { min: number; max: number }; // in degrees
  life: { min: number; max: number };
  size: { min: number; max: number };
  colors: string[];
  gravity?: number;
  friction?: number;
  fadeOut?: boolean;
  shrink?: boolean;
  rotate?: boolean;
}

// Preset configurations for common effects
export const PARTICLE_PRESETS = {
  // Brick debris - chunky pieces flying outward
  brickBreak: {
    count: 8,
    speed: { min: 3, max: 6 },
    angle: { min: 200, max: 340 }, // upward spread
    life: { min: 0.4, max: 0.8 },
    size: { min: 4, max: 6 },
    colors: ['#D89868', '#A85028', '#8B4513'],
    gravity: 0.4,
    friction: 0.98,
    fadeOut: false,
    shrink: false,
    rotate: true
  } as ParticleConfig,

  // Landing dust - small puffs spreading horizontally
  landingDust: {
    count: 6,
    speed: { min: 1, max: 3 },
    angle: { min: 150, max: 210 }, // horizontal spread
    life: { min: 0.2, max: 0.4 },
    size: { min: 2, max: 4 },
    colors: ['#C4A484', '#A89070', '#8B7355'],
    gravity: -0.1, // slight float up
    friction: 0.9,
    fadeOut: true,
    shrink: true,
    rotate: false
  } as ParticleConfig,

  // Stomp effect - small burst
  stomp: {
    count: 4,
    speed: { min: 1, max: 2 },
    angle: { min: 0, max: 360 },
    life: { min: 0.15, max: 0.25 },
    size: { min: 2, max: 3 },
    colors: ['#FFFFFF', '#FFFF00', '#FFD700'],
    gravity: 0,
    friction: 0.95,
    fadeOut: true,
    shrink: true,
    rotate: false
  } as ParticleConfig,

  // Coin sparkle
  coinCollect: {
    count: 5,
    speed: { min: 2, max: 4 },
    angle: { min: 0, max: 360 },
    life: { min: 0.2, max: 0.35 },
    size: { min: 2, max: 4 },
    colors: ['#FFD700', '#FFA500', '#FFFF00'],
    gravity: 0,
    friction: 0.92,
    fadeOut: true,
    shrink: false,
    rotate: false
  } as ParticleConfig,

  // Power-up sparkle
  powerUp: {
    count: 12,
    speed: { min: 2, max: 5 },
    angle: { min: 0, max: 360 },
    life: { min: 0.3, max: 0.5 },
    size: { min: 2, max: 4 },
    colors: ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF'],
    gravity: -0.05,
    friction: 0.96,
    fadeOut: true,
    shrink: false,
    rotate: false
  } as ParticleConfig,

  // Skid dust when changing direction
  skidDust: {
    count: 3,
    speed: { min: 0.5, max: 1.5 },
    angle: { min: 170, max: 190 },
    life: { min: 0.15, max: 0.25 },
    size: { min: 2, max: 3 },
    colors: ['#C4A484', '#A89070'],
    gravity: -0.05,
    friction: 0.9,
    fadeOut: true,
    shrink: true,
    rotate: false
  } as ParticleConfig,

  // Enemy defeat poof
  enemyDefeat: {
    count: 8,
    speed: { min: 1, max: 3 },
    angle: { min: 0, max: 360 },
    life: { min: 0.2, max: 0.4 },
    size: { min: 3, max: 5 },
    colors: ['#FFFFFF', '#DDDDDD', '#BBBBBB'],
    gravity: -0.1,
    friction: 0.9,
    fadeOut: true,
    shrink: true,
    rotate: false
  } as ParticleConfig
};

export class ParticleSystem {
  private particles: Particle[] = [];
  private maxParticles = 200; // Performance cap

  emit(x: number, y: number, config: ParticleConfig): void {
    for (let i = 0; i < config.count; i++) {
      if (this.particles.length >= this.maxParticles) {
        // Remove oldest particle to make room
        this.particles.shift();
      }

      const angle = this.randomRange(config.angle.min, config.angle.max) * (Math.PI / 180);
      const speed = this.randomRange(config.speed.min, config.speed.max);
      const life = this.randomRange(config.life.min, config.life.max);
      const size = this.randomRange(config.size.min, config.size.max);
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        size,
        color,
        gravity: config.gravity ?? 0.2,
        friction: config.friction ?? 1,
        fadeOut: config.fadeOut ?? true,
        shrink: config.shrink ?? false,
        rotation: config.rotate ? Math.random() * Math.PI * 2 : 0,
        rotationSpeed: config.rotate ? (Math.random() - 0.5) * 0.3 : 0
      });
    }
  }

  // Convenience methods for common effects
  emitBrickBreak(x: number, y: number): void {
    this.emit(x, y, PARTICLE_PRESETS.brickBreak);
  }

  emitLandingDust(x: number, y: number): void {
    this.emit(x, y, PARTICLE_PRESETS.landingDust);
  }

  emitStomp(x: number, y: number): void {
    this.emit(x, y, PARTICLE_PRESETS.stomp);
  }

  emitCoinCollect(x: number, y: number): void {
    this.emit(x, y, PARTICLE_PRESETS.coinCollect);
  }

  emitPowerUp(x: number, y: number): void {
    this.emit(x, y, PARTICLE_PRESETS.powerUp);
  }

  emitSkidDust(x: number, y: number, direction: number): void {
    // Emit behind the player based on direction
    const config = { ...PARTICLE_PRESETS.skidDust };
    if (direction > 0) {
      config.angle = { min: 160, max: 200 }; // Emit to the left
    } else {
      config.angle = { min: -20, max: 20 }; // Emit to the right
    }
    this.emit(x, y, config);
  }

  emitEnemyDefeat(x: number, y: number): void {
    this.emit(x, y, PARTICLE_PRESETS.enemyDefeat);
  }

  update(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Update physics
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.x += p.vx;
      p.y += p.vy;

      // Update rotation
      if (p.rotation !== undefined && p.rotationSpeed) {
        p.rotation += p.rotationSpeed;
      }

      // Update life
      p.life -= deltaTime;

      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, camera: Vector2): void {
    for (const p of this.particles) {
      const screenX = p.x - camera.x;
      const screenY = p.y - camera.y;

      // Skip if off screen
      if (screenX < -10 || screenX > 270 || screenY < -10 || screenY > 250) {
        continue;
      }

      const lifeRatio = p.life / p.maxLife;

      // Calculate alpha (fade out)
      const alpha = p.fadeOut ? lifeRatio : 1;

      // Calculate size (shrink)
      const size = p.shrink ? p.size * lifeRatio : p.size;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Apply rotation if needed
      if (p.rotation !== undefined) {
        ctx.translate(screenX, screenY);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-size / 2, -size / 2, size, size);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(screenX - size / 2, screenY - size / 2, size, size);
      }

      ctx.restore();
    }
  }

  clear(): void {
    this.particles = [];
  }

  getParticleCount(): number {
    return this.particles.length;
  }

  private randomRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }
}

// Screen shake system
export class ScreenShake {
  private shakeX = 0;
  private shakeY = 0;
  private shakeDuration = 0;
  private shakeIntensity = 0;
  private shakeDecay = 0.9; // How quickly shake diminishes

  // Trigger a screen shake
  shake(intensity: number, duration: number): void {
    // Only apply if stronger than current shake
    if (intensity > this.shakeIntensity) {
      this.shakeIntensity = intensity;
      this.shakeDuration = duration;
    }
  }

  // Convenience methods for common shake events
  shakeSmall(): void {
    this.shake(2, 0.1); // Stomp, coin block
  }

  shakeMedium(): void {
    this.shake(4, 0.15); // Brick break, enemy defeat
  }

  shakeLarge(): void {
    this.shake(6, 0.2); // Player damage, big enemy defeat
  }

  shakeHuge(): void {
    this.shake(10, 0.3); // Boss defeat, explosion
  }

  update(deltaTime: number): void {
    if (this.shakeDuration > 0) {
      this.shakeDuration -= deltaTime;

      // Random offset within intensity bounds
      this.shakeX = (Math.random() - 0.5) * 2 * this.shakeIntensity;
      this.shakeY = (Math.random() - 0.5) * 2 * this.shakeIntensity;

      // Decay the intensity over time
      this.shakeIntensity *= this.shakeDecay;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
      this.shakeIntensity = 0;
    }
  }

  getOffset(): Vector2 {
    return {
      x: Math.round(this.shakeX),
      y: Math.round(this.shakeY)
    };
  }

  isShaking(): boolean {
    return this.shakeDuration > 0;
  }
}
