import { Component, inject, signal } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { Application, Assets, Container, Sprite } from "pixi.js";
import * as Game2 from "./game2";
import * as Game3 from "./game3";
import { Controller, Scene, SpineBoy } from "./game4";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "pixi";
  router = inject(Router);
  gameNumber = signal(1);

  canvas = document.getElementsByTagName("canvas");

  ngAfterViewInit(): void {
    this.renderGame();
  }

  prev() {
    if (this.gameNumber() === 1) return;
    this.gameNumber.set(this.gameNumber() - 1);
    this.renderGame();
  }

  next() {
    if (this.gameNumber() === 4) return;
    this.gameNumber.set(this.gameNumber() + 1);
    this.renderGame();
  }

  renderGame() {
    if (this.canvas.length > 0) {
      document.body.removeChild(this.canvas[0]);
    }
    switch (this.gameNumber()) {
      case 1:
        return this.game1();
      case 2:
        return this.game2();
      case 3:
        return this.game3();
      case 4:
        return this.game4();
      default:
        return null;
    }
  }

  async game1() {
    console.log("game1");
    const app = new Application();
    await app.init({ background: "#1099bb", resizeTo: window });

    document.body.appendChild(app.canvas);

    const texture = await Assets.load("https://pixijs.com/assets/bunny.png");
    const bunny = new Sprite(texture);

    app.stage.addChild(bunny);

    bunny.anchor.set(0.5);

    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    app.ticker.add((time) => {
      bunny.rotation += 0.1 * time.deltaTime;
    });
  }

  trainerContainer = new Container();
  async game2() {
    const app = new Application();
    await app.init({ background: "#021f4b", resizeTo: window });
    document.body.appendChild(app.canvas);
    Game2.addStars(app);
    Game2.addMoon(app);
    Game2.addMountain(app);
    Game2.addTrees(app);
    Game2.addGroud(app);
    Game2.addTrain(app, this.trainerContainer);
    Game2.addSmoke(app, this.trainerContainer);
  }

  async game3Preload() {
    const assets = [
      {
        alias: "background",
        src: "https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg",
      },
      { alias: "fish1", src: "https://pixijs.com/assets/tutorials/fish-pond/fish1.png" },
      { alias: "fish2", src: "https://pixijs.com/assets/tutorials/fish-pond/fish2.png" },
      { alias: "fish3", src: "https://pixijs.com/assets/tutorials/fish-pond/fish3.png" },
      { alias: "fish4", src: "https://pixijs.com/assets/tutorials/fish-pond/fish4.png" },
      { alias: "fish5", src: "https://pixijs.com/assets/tutorials/fish-pond/fish5.png" },
      { alias: "overlay", src: "https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png" },
      {
        alias: "displacement",
        src: "https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png",
      },
    ];
    await Assets.load(assets);
  }

  fishes = [];

  async game3() {
    const app = new Application();
    await app.init({ background: "#1099bb", resizeTo: window });
    document.body.appendChild(app.canvas);
    await this.game3Preload();
    Game3.addBackground(app);
    Game3.addFishes(app, this.fishes);
    Game3.addWaterOverlay(app);
    Game3.addDisplacementEffect(app);

    app.ticker.add((time) => {
      Game3.animateFishes(app, this.fishes, time);
      Game3.animateWaterOverlay(app, time);
    });
  }

  async game4() {
    const app = new Application();

    await app.init({ background: "#1099bb", resizeTo: window });

    document.body.appendChild(app.canvas);

    await Assets.load([
      {
        alias: "spineSkeleton",
        src: "https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pro.skel",
      },
      {
        alias: "spineAtlas",
        src: "https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pma.atlas",
      },
      {
        alias: "sky",
        src: "https://pixijs.com/assets/tutorials/spineboy-adventure/sky.png",
      },
      {
        alias: "background",
        src: "https://pixijs.com/assets/tutorials/spineboy-adventure/background.png",
      },
      {
        alias: "midground",
        src: "https://pixijs.com/assets/tutorials/spineboy-adventure/midground.png",
      },
      {
        alias: "platform",
        src: "https://pixijs.com/assets/tutorials/spineboy-adventure/platform.png",
      },
    ]);

    const controller = new Controller();

    const scene = new Scene(app.screen.width, app.screen.height);

    const spineBoy = new SpineBoy();

    scene.view.y = app.screen.height;
    spineBoy.view.x = app.screen.width / 2;
    spineBoy.view.y = app.screen.height - scene.floorHeight;
    spineBoy.spine.scale.set(scene.scale * 0.32);

    app.stage.addChild(scene.view, spineBoy.view);

    spineBoy.spawn();

    app.ticker.add(() => {
      if (spineBoy.isSpawning()) return;

      spineBoy.state.walk = controller.keys.left.pressed || controller.keys.right.pressed;
      if (spineBoy.state.run && spineBoy.state.walk) spineBoy.state.run = true;
      else spineBoy.state.run = controller.keys.left.doubleTap || controller.keys.right.doubleTap;
      spineBoy.state.hover = controller.keys.down.pressed;
      if (controller.keys.left.pressed) spineBoy.direction = -1;
      else if (controller.keys.right.pressed) spineBoy.direction = 1;
      spineBoy.state.jump = controller.keys.space.pressed;

      spineBoy.update();

      let speed = 1.25;

      if (spineBoy.state.hover) speed = 7.5;
      else if (spineBoy.state.run) speed = 3.75;

      if (spineBoy.state.walk) scene.positionX -= speed * scene.scale * spineBoy.direction;
    });
  }
}
