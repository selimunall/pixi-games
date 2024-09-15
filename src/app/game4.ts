import { Spine } from "@pixi/spine-pixi";
import { Container, Sprite, Texture, TilingSprite } from "pixi.js";

const keyMap = {
  Space: "space",
  KeyW: "up",
  ArrowUp: "up",
  KeyA: "left",
  ArrowLeft: "left",
  KeyS: "down",
  ArrowDown: "down",
  KeyD: "right",
  ArrowRight: "right",
};

export class Controller {
  keys: any;
  constructor() {
    this.keys = {
      up: { pressed: false, doubleTap: false, timestamp: 0 },
      left: { pressed: false, doubleTap: false, timestamp: 0 },
      down: { pressed: false, doubleTap: false, timestamp: 0 },
      right: { pressed: false, doubleTap: false, timestamp: 0 },
      space: { pressed: false, doubleTap: false, timestamp: 0 },
    };
    window.addEventListener("keydown", (event) => this.keydownHandler(event));
    window.addEventListener("keyup", (event) => this.keyupHandler(event));
  }

  keydownHandler(event: any) {
    const key = keyMap[event.code as Partial<keyof typeof keyMap>];
    if (!key) return;
    const now = Date.now();
    this.keys[key].doubleTap = this.keys[key].doubleTap || now - this.keys[key].timestamp < 300;
    this.keys[key].pressed = true;
  }

  keyupHandler(event: any) {
    const key = keyMap[event.code as Partial<keyof typeof keyMap>];
    if (!key) return;
    const now = Date.now();
    this.keys[key].pressed = false;
    if (this.keys[key].doubleTap) this.keys[key].doubleTap = false;
    else this.keys[key].timestamp = now;
  }
}

export class Scene {
  view: Container;
  sky: Sprite;
  background: TilingSprite;
  midground: TilingSprite;
  platform: TilingSprite;
  floorHeight: number;
  scale: number;
  constructor(width: number, height: number) {
    this.view = new Container();

    this.sky = Sprite.from("sky");
    this.sky.anchor.set(0, 1);
    this.sky.width = width;
    this.sky.height = height;

    const backgroundTexture = Texture.from("background");
    const midgroundTexture = Texture.from("midground");
    const platformTexture = Texture.from("platform");

    const maxPlatformHeight = platformTexture.height;
    const platformHeight = Math.min(maxPlatformHeight, height * 0.4);
    const scale = (this.scale = platformHeight / maxPlatformHeight);

    const baseOptions = {
      tileScale: { x: scale, y: scale },
      anchor: { x: 0, y: 1 },
      applyAnchorToTexture: true,
    };

    this.background = new TilingSprite({
      texture: backgroundTexture,
      width,
      height: backgroundTexture.height * scale,
      ...baseOptions,
    });
    this.midground = new TilingSprite({
      texture: midgroundTexture,
      width,
      height: midgroundTexture.height * scale,
      ...baseOptions,
    });
    this.platform = new TilingSprite({
      texture: platformTexture,
      width,
      height: platformHeight,
      ...baseOptions,
    });
    this.floorHeight = platformHeight * 0.43;

    this.background.y = this.midground.y = -this.floorHeight;
    this.view.addChild(this.sky, this.background, this.midground, this.platform);
  }
  get positionX() {
    return this.platform.tilePosition.x;
  }
  set positionX(value) {
    this.background.tilePosition.x = value * 0.1;
    this.midground.tilePosition.x = value * 0.25;
    this.platform.tilePosition.x = value;
  }
}

const animationMap = {
  idle: {
    name: "idle",
    loop: true,
  },
  walk: {
    name: "walk",
    loop: true,
  },
  run: {
    name: "run",
    loop: true,
  },
  jump: {
    name: "jump",
    timeScale: 1.5,
  },
  hover: {
    name: "hoverboard",
    loop: true,
  },
  spawn: {
    name: "portal",
  },
};

export class SpineBoy {
  state: any;
  view: Container;
  directionalView: Container;
  spine: Spine;

  constructor() {
    this.state = {
      walk: false,
      run: false,
      hover: false,
      jump: false,
    };

    this.view = new Container();
    this.directionalView = new Container();

    this.spine = Spine.from({
      skeleton: "spineSkeleton",
      atlas: "spineAtlas",
    });
    this.directionalView.addChild(this.spine);
    this.view.addChild(this.directionalView);
    this.spine.state.data.defaultMix = 0.2;
  }

  spawn() {
    this.spine.state.setAnimation(0, animationMap.spawn.name);
  }

  playAnimation({
    name,
    loop = false,
    timeScale = 1,
  }: {
    name: string;
    loop?: boolean;
    timeScale?: number;
  }) {
    if (this.currentAnimationName === name) return;
    const trackEntry = this.spine.state.setAnimation(0, name, loop);
    trackEntry.timeScale = timeScale;
  }

  update() {
    if (this.state.jump) this.playAnimation(animationMap.jump);

    if (this.isAnimationPlaying(animationMap.jump)) return;

    if (this.state.hover) this.playAnimation(animationMap.hover);
    else if (this.state.run) this.playAnimation(animationMap.run);
    else if (this.state.walk) this.playAnimation(animationMap.walk);
    else this.playAnimation(animationMap.idle);
  }

  isSpawning() {
    return this.isAnimationPlaying(animationMap.spawn);
  }

  isAnimationPlaying({ name }: { name: string }) {
    return (
      this.currentAnimationName === name && !(this.spine.state.getCurrent(0) as any).isComplete()
    );
  }

  get currentAnimationName() {
    return (this.spine.state.getCurrent(0) as any)?.animation.name;
  }

  get direction() {
    return this.directionalView.scale.x > 0 ? 1 : -1;
  }

  set direction(value) {
    this.directionalView.scale.x = value;
  }
}
