import {
  Application,
  Container,
  DisplacementFilter,
  Renderer,
  Sprite,
  Texture,
  TilingSprite,
} from "pixi.js";

export function addBackground(app: Application<Renderer>) {
  const background = Sprite.from("background");

  background.anchor.set(0.5);

  if (app.screen.width > app.screen.height) {
    background.width = app.screen.width * 1.2;
    background.scale.y = background.scale.x;
  } else {
    background.height = app.screen.height * 1.2;
    background.scale.x = background.scale.y;
  }

  background.x = app.screen.width / 2;
  background.y = app.screen.height / 2;

  app.stage.addChild(background);
}

export function addFishes(app: Application<Renderer>, fishes: any[]) {
  const fishContainer = new Container();
  app.stage.addChild(fishContainer);
  const fishCount = 20;
  const fishAssets = ["fish1", "fish2", "fish3", "fish4", "fish5"];

  for (let i = 0; i < fishCount; i++) {
    const fishAsset = fishAssets[i % fishAssets.length];

    const fish = Sprite.from(fishAsset) as any;

    fish.anchor.set(0.5);

    fish.direction = Math.random() * Math.PI * 2;
    fish.speed = 2 + Math.random() * 2;
    fish.turnSpeed = Math.random() - 0.8;

    fish.x = Math.random() * app.screen.width;
    fish.y = Math.random() * app.screen.height;

    fish.scale.set(0.5 + Math.random() * 0.2);

    fishContainer.addChild(fish);

    fishes.push(fish);
  }
}

export function animateFishes(app: Application<Renderer>, fishes: any[], time: any) {
  const delta = time.deltaTime;

  const stagePadding = 100;
  const boundWidth = app.screen.width + stagePadding * 2;
  const boundHeight = app.screen.height + stagePadding * 2;

  fishes.forEach((fish) => {
    fish.direction += fish.turnSpeed * 0.01;

    fish.x += Math.sin(fish.direction) * fish.speed;
    fish.y += Math.cos(fish.direction) * fish.speed;

    fish.rotation = -fish.direction - Math.PI / 2;

    if (fish.x < -stagePadding) {
      fish.x += boundWidth;
    }
    if (fish.x > app.screen.width + stagePadding) {
      fish.x -= boundWidth;
    }
    if (fish.y < -stagePadding) {
      fish.y += boundHeight;
    }
    if (fish.y > app.screen.height + stagePadding) {
      fish.y -= boundHeight;
    }
  });
}

export let overlay: any;

export function addWaterOverlay(app: Application<Renderer>) {
  const texture = Texture.from("overlay");

  overlay = new TilingSprite({
    texture,
    width: app.screen.width,
    height: app.screen.height,
  });

  app.stage.addChild(overlay);
}

export function addDisplacementEffect(app: Application<Renderer>) {
  const sprite = Sprite.from("displacement");
  sprite.texture.baseTexture.wrapMode = "repeat";
  const filter = new DisplacementFilter({
    sprite,
    scale: 50,
    width: app.screen.width,
    height: app.screen.height,
  });

  app.stage.filters = [filter];
}

export function animateWaterOverlay(app: Application<Renderer>, time: any) {
  const delta = time.deltaTime;

  overlay.tilePosition.x -= delta;
  overlay.tilePosition.y -= delta;
}
