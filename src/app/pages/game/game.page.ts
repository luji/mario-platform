import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { GameEngine } from '../../game/engine/game-engine';
import { GameState } from '../../game/engine/types';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, IonContent, IonButton],
  template: `
    <ion-content [fullscreen]="true" class="game-content">
      <!-- Game HUD -->
      <div class="game-hud">
        <div class="hud-item">
          <div class="hud-label">MARIO</div>
          <div class="hud-value">{{ gameState.score | number:'6.0-0' }}</div>
        </div>
        <div class="hud-item">
          <div class="hud-label">COINS</div>
          <div class="hud-value">x{{ gameState.coins | number:'2.0-0' }}</div>
        </div>
        <div class="hud-item">
          <div class="hud-label">WORLD</div>
          <div class="hud-value">{{ gameState.world }}</div>
        </div>
        <div class="hud-item">
          <div class="hud-label">TIME</div>
          <div class="hud-value">{{ gameState.time }}</div>
        </div>
        <div class="hud-item">
          <div class="hud-label">LIVES</div>
          <div class="hud-value">x{{ gameState.lives }}</div>
        </div>
      </div>

      <!-- Game Canvas -->
      <div class="game-container" #gameContainer>
        <canvas #gameCanvas></canvas>
      </div>

      <!-- Touch Controls -->
      <div class="touch-controls" *ngIf="isMobile">
        <!-- D-Pad -->
        <div class="dpad">
          <button class="dpad-btn dpad-left"
                  (touchstart)="onTouchLeft(true)"
                  (touchend)="onTouchLeft(false)"
                  (touchcancel)="onTouchLeft(false)">
            ◀
          </button>
          <button class="dpad-btn dpad-right"
                  (touchstart)="onTouchRight(true)"
                  (touchend)="onTouchRight(false)"
                  (touchcancel)="onTouchRight(false)">
            ▶
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="action-btn btn-b"
                  (touchstart)="onTouchRun(true)"
                  (touchend)="onTouchRun(false)"
                  (touchcancel)="onTouchRun(false)">
            B
          </button>
          <button class="action-btn btn-a"
                  (touchstart)="onTouchJump(true)"
                  (touchend)="onTouchJump(false)"
                  (touchcancel)="onTouchJump(false)">
            A
          </button>
        </div>
      </div>

      <!-- Game Over / Level Complete Overlay -->
      <div class="overlay" *ngIf="showOverlay">
        <div class="overlay-content">
          <h2>{{ overlayTitle }}</h2>
          <p>Score: {{ gameState.score | number }}</p>
          <ion-button (click)="restartGame()">
            {{ isGameOver ? 'Try Again' : 'Continue' }}
          </ion-button>
        </div>
      </div>

      <!-- Start Screen -->
      <div class="start-screen" *ngIf="!gameStarted">
        <div class="start-content">
          <h1>SUPER MARIO</h1>
          <h2>PLATFORM</h2>
          <div class="controls-info">
            <h3>Controls:</h3>
            <p><strong>Arrow Keys / WASD:</strong> Move</p>
            <p><strong>Space / Z:</strong> Jump</p>
            <p><strong>Shift / X:</strong> Run</p>
            <p><strong>ESC / P:</strong> Pause</p>
          </div>
          <ion-button (click)="startGame()" size="large">
            START GAME
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .game-content {
      --background: #5C94FC;
    }

    .game-hud {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-around;
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.7);
      z-index: 100;
      font-family: 'Press Start 2P', monospace, system-ui;
    }

    .hud-item {
      text-align: center;
      color: white;
    }

    .hud-label {
      font-size: 10px;
      margin-bottom: 4px;
      color: #FFD700;
    }

    .hud-value {
      font-size: 14px;
      font-weight: bold;
    }

    .game-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      padding-top: 50px;
      box-sizing: border-box;
    }

    canvas {
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      border: 4px solid #000;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    }

    .touch-controls {
      position: fixed;
      bottom: 20px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      pointer-events: none;
      z-index: 200;
    }

    .dpad, .action-buttons {
      pointer-events: auto;
    }

    .dpad {
      display: flex;
      gap: 8px;
    }

    .dpad-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      border: 3px solid rgba(255, 255, 255, 0.6);
      color: white;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
    }

    .dpad-btn:active {
      background: rgba(255, 255, 255, 0.5);
    }

    .action-buttons {
      display: flex;
      gap: 16px;
    }

    .action-btn {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, 0.6);
      color: white;
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
    }

    .btn-a {
      background: rgba(220, 20, 60, 0.6);
    }

    .btn-b {
      background: rgba(255, 165, 0, 0.6);
    }

    .action-btn:active {
      opacity: 0.8;
      transform: scale(0.95);
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 300;
    }

    .overlay-content {
      text-align: center;
      color: white;
      font-family: monospace;
    }

    .overlay-content h2 {
      font-size: 32px;
      margin-bottom: 20px;
    }

    .overlay-content p {
      font-size: 18px;
      margin-bottom: 20px;
    }

    .start-screen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, #5C94FC 0%, #5C94FC 50%, #8B4513 50%, #8B4513 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 400;
    }

    .start-content {
      text-align: center;
      color: white;
      font-family: monospace;
      padding: 20px;
    }

    .start-content h1 {
      font-size: 36px;
      color: #FF0000;
      text-shadow: 3px 3px 0 #000, -1px -1px 0 #000;
      margin-bottom: 0;
    }

    .start-content h2 {
      font-size: 24px;
      color: #FFD700;
      text-shadow: 2px 2px 0 #000;
      margin-top: 8px;
      margin-bottom: 30px;
    }

    .controls-info {
      background: rgba(0, 0, 0, 0.6);
      padding: 16px 24px;
      border-radius: 8px;
      margin-bottom: 30px;
      text-align: left;
    }

    .controls-info h3 {
      margin-bottom: 12px;
      color: #FFD700;
    }

    .controls-info p {
      margin: 8px 0;
      font-size: 14px;
    }

    @media (max-width: 600px) {
      .hud-label {
        font-size: 8px;
      }

      .hud-value {
        font-size: 12px;
      }

      .start-content h1 {
        font-size: 28px;
      }

      .start-content h2 {
        font-size: 18px;
      }

      .controls-info {
        display: none;
      }
    }
  `]
})
export class GamePage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('gameContainer') containerRef!: ElementRef<HTMLDivElement>;

  private gameEngine!: GameEngine;

  gameState: GameState = {
    score: 0,
    coins: 0,
    lives: 3,
    time: 400,
    world: '1-1',
    playerState: 'small' as any
  };

  gameStarted = false;
  showOverlay = false;
  overlayTitle = '';
  isGameOver = false;
  isMobile = false;

  ngOnInit(): void {
    this.isMobile = this.detectMobile();
  }

  ngAfterViewInit(): void {
    // Canvas will be initialized when game starts
  }

  ngOnDestroy(): void {
    if (this.gameEngine) {
      this.gameEngine.stop();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.gameEngine && this.containerRef) {
      const container = this.containerRef.nativeElement;
      this.gameEngine.resize(container.clientWidth - 40, container.clientHeight - 80);
    }
  }

  startGame(): void {
    this.gameStarted = true;
    this.showOverlay = false;

    // Initialize game engine after view is ready
    setTimeout(() => {
      const canvas = this.canvasRef.nativeElement;
      const container = this.containerRef.nativeElement;

      this.gameEngine = new GameEngine(canvas);
      this.gameEngine.resize(container.clientWidth - 40, container.clientHeight - 80);

      this.gameEngine.setCallbacks(
        (state) => this.onScoreUpdate(state),
        () => this.onGameOver(),
        () => this.onLevelComplete()
      );

      this.gameEngine.start();
    }, 100);
  }

  restartGame(): void {
    this.showOverlay = false;
    this.isGameOver = false;

    if (this.gameEngine) {
      this.gameEngine.restart();
    }
  }

  private onScoreUpdate(state: GameState): void {
    this.gameState = state;
  }

  private onGameOver(): void {
    this.showOverlay = true;
    this.overlayTitle = 'GAME OVER';
    this.isGameOver = true;
  }

  private onLevelComplete(): void {
    this.showOverlay = true;
    this.overlayTitle = 'LEVEL COMPLETE!';
    this.isGameOver = false;
  }

  // Touch control handlers
  onTouchLeft(pressed: boolean): void {
    if (this.gameEngine) {
      this.gameEngine.setTouchLeft(pressed);
    }
  }

  onTouchRight(pressed: boolean): void {
    if (this.gameEngine) {
      this.gameEngine.setTouchRight(pressed);
    }
  }

  onTouchJump(pressed: boolean): void {
    if (this.gameEngine) {
      this.gameEngine.setTouchJump(pressed);
    }
  }

  onTouchRun(pressed: boolean): void {
    if (this.gameEngine) {
      this.gameEngine.setTouchRun(pressed);
    }
  }

  private detectMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 800);
  }
}
