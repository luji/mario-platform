export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  run: boolean;
  pause: boolean;
}

export class InputHandler {
  private keys: InputState = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    run: false,
    pause: false
  };

  private touchControls = {
    left: false,
    right: false,
    jump: false,
    run: false
  };

  private jumpPressed = false;
  private jumpReleased = true;

  constructor() {
    this.setupKeyboardListeners();
  }

  private setupKeyboardListeners(): void {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  private handleKeyDown(e: KeyboardEvent): void {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = true;
        break;
      case 'ArrowUp':
      case 'KeyW':
        this.keys.up = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.keys.down = true;
        break;
      case 'Space':
      case 'KeyZ':
        this.keys.jump = true;
        if (this.jumpReleased) {
          this.jumpPressed = true;
          this.jumpReleased = false;
        }
        break;
      case 'ShiftLeft':
      case 'KeyX':
        this.keys.run = true;
        break;
      case 'Escape':
      case 'KeyP':
        this.keys.pause = true;
        break;
    }

    // Prevent default for game keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = false;
        break;
      case 'ArrowUp':
      case 'KeyW':
        this.keys.up = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.keys.down = false;
        break;
      case 'Space':
      case 'KeyZ':
        this.keys.jump = false;
        this.jumpReleased = true;
        break;
      case 'ShiftLeft':
      case 'KeyX':
        this.keys.run = false;
        break;
      case 'Escape':
      case 'KeyP':
        this.keys.pause = false;
        break;
    }
  }

  // Touch control methods for mobile
  setTouchLeft(pressed: boolean): void {
    this.touchControls.left = pressed;
  }

  setTouchRight(pressed: boolean): void {
    this.touchControls.right = pressed;
  }

  setTouchJump(pressed: boolean): void {
    if (pressed && !this.touchControls.jump) {
      this.jumpPressed = true;
    }
    this.touchControls.jump = pressed;
  }

  setTouchRun(pressed: boolean): void {
    this.touchControls.run = pressed;
  }

  isLeft(): boolean {
    return this.keys.left || this.touchControls.left;
  }

  isRight(): boolean {
    return this.keys.right || this.touchControls.right;
  }

  isUp(): boolean {
    return this.keys.up;
  }

  isDown(): boolean {
    return this.keys.down;
  }

  isJump(): boolean {
    return this.keys.jump || this.touchControls.jump;
  }

  isJumpPressed(): boolean {
    const pressed = this.jumpPressed;
    this.jumpPressed = false;
    return pressed;
  }

  isRun(): boolean {
    return this.keys.run || this.touchControls.run;
  }

  isPause(): boolean {
    const paused = this.keys.pause;
    this.keys.pause = false;
    return paused;
  }

  getState(): InputState {
    return {
      left: this.isLeft(),
      right: this.isRight(),
      up: this.isUp(),
      down: this.isDown(),
      jump: this.isJump(),
      run: this.isRun(),
      pause: this.isPause()
    };
  }

  destroy(): void {
    window.removeEventListener('keydown', (e) => this.handleKeyDown(e));
    window.removeEventListener('keyup', (e) => this.handleKeyUp(e));
  }
}
