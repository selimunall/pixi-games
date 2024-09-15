import { Application, Container, Graphics, Renderer } from "pixi.js";

export function addStars(app: Application<Renderer>) {
  const starCount = 20;
  const graphics = new Graphics();
  for (let index = 0; index < starCount; index++) {
    const x = (index * 0.78695 * app.screen.width) % app.screen.width;
    const y = (index * 0.9382 * app.screen.height) % app.screen.height;
    const radius = 2 + Math.random() * 3;
    const rotation = Math.random() * Math.PI * 2;

    graphics.star(x, y, 5, radius, 0, rotation).fill({ color: 0xffdf00, alpha: radius / 5 });
  }
  app.stage.addChild(graphics);
}

export function addMoon(app: Application<Renderer>) {
  {
    const graphics = new Graphics().svg(moonSvg);
    graphics.x = app.screen.width / 2 + 100;
    graphics.y = app.screen.height / 8;
    app.stage.addChild(graphics);
  }
}

export function addMountain(app: Application<Renderer>) {
  const group1 = createMountainGroup(app);
  const group2 = createMountainGroup(app);

  group2.x = app.screen.width;

  app.stage.addChild(group1, group2);

  app.ticker.add((time) => {
    const dx = time.deltaTime * 0.5;

    group1.x -= dx;
    group2.x -= dx;

    if (group1.x <= -app.screen.width) {
      group1.x += app.screen.width * 2;
    }
    if (group2.x <= -app.screen.width) {
      group2.x += app.screen.width * 2;
    }
  });
}

export function createMountainGroup(app: Application<Renderer>) {
  const graphics = new Graphics();

  const width = app.screen.width / 2;

  const startY = app.screen.height;

  const startXLeft = 0;
  const startXMiddle = Number(app.screen.width) / 4;
  const startXRight = app.screen.width / 2;

  const heightLeft = app.screen.height / 2;
  const heightMiddle = (app.screen.height * 4) / 5;
  const heightRight = (app.screen.height * 2) / 3;

  const colorLeft = 0xc1c0c2;
  const colorMiddle = 0x7e818f;
  const colorRight = 0x8c919f;

  graphics
    .moveTo(startXMiddle, startY)
    .bezierCurveTo(
      startXMiddle + width / 2,
      startY - heightMiddle,
      startXMiddle + width / 2,
      startY - heightMiddle,
      startXMiddle + width,
      startY
    )
    .fill({ color: colorMiddle })

    .moveTo(startXLeft, startY)
    .bezierCurveTo(
      startXLeft + width / 2,
      startY - heightLeft,
      startXLeft + width / 2,
      startY - heightLeft,
      startXLeft + width,
      startY
    )
    .fill({ color: colorLeft })

    .moveTo(startXRight, startY)
    .bezierCurveTo(
      startXRight + width / 2,
      startY - heightRight,
      startXRight + width / 2,
      startY - heightRight,
      startXRight + width,
      startY
    )
    .fill({ color: colorRight });

  return graphics;
}

export function addTrees(app: Application<Renderer>) {
  const treeWidth = 200;
  const y = app.screen.height - 20;
  const spacing = 15;
  const count = app.screen.width / (treeWidth + spacing) + 1;
  const trees: any = [];

  for (let index = 0; index < count; index++) {
    const treeHeight = 225 + Math.random() * 50;
    const tree = createTree(treeWidth, treeHeight);
    tree.x = index * (treeWidth + spacing);
    tree.y = y;
    app.stage.addChild(tree);
    trees.push(tree);
  }

  app.ticker.add((time) => {
    const dx = time.deltaTime * 3;

    trees.forEach((tree: any) => {
      tree.x -= dx;
      if (tree.x <= -(treeWidth / 2 + spacing)) {
        tree.x += count * (treeWidth + spacing) + spacing * 3;
      }
    });
  });
}

export function createTree(width: number, height: number) {
  const trunkWidth = 30;
  const trunkHeight = height / 4;
  const crownHeight = height - trunkHeight;
  const crownLevels = 4;
  const crownLevelHeight = crownHeight / crownLevels;
  const crownWidthIncrement = width / crownLevels;
  const crownColor = 0x264d3d;
  const trunkColor = 0x563929;

  const graphics = new Graphics()
    .rect(-trunkWidth / 2, -trunkHeight, trunkWidth, trunkHeight)
    .fill({ color: trunkColor });

  for (let index = 0; index < crownLevels; index++) {
    const y = -trunkHeight - crownLevelHeight * index;
    const levelWidth = width - crownWidthIncrement * index;
    const offset = index < crownLevels - 1 ? crownLevelHeight / 2 : 0;

    graphics
      .moveTo(-levelWidth / 2, y)
      .lineTo(0, y - crownLevelHeight - offset)
      .lineTo(levelWidth / 2, y)
      .fill({ color: crownColor });
  }

  return graphics;
}

export function addGroud(app: Application<Renderer>) {
  const width = app.screen.width;
  const groundHeight = 20;
  const groundY = app.screen.height;
  const ground = new Graphics()
    .rect(0, groundY - groundHeight, width, groundHeight)
    .fill({ color: 0xdddddd });
  app.stage.addChild(ground);
  const trackHeight = 15;
  const plankWidth = 50;
  const plankHeight = trackHeight / 2;
  const plankGap = 20;
  const plankCount = width / (plankWidth + plankGap) + 1;
  const plankY = groundY - groundHeight;

  const planks: any = [];

  for (let index = 0; index < plankCount; index++) {
    const plank = new Graphics()
      .rect(0, plankY - plankHeight, plankWidth, plankHeight)
      .fill({ color: 0x241811 });
    plank.x = index * (plankWidth + plankGap);
    app.stage.addChild(plank);
    planks.push(plank);
  }

  const railHeight = trackHeight / 2;
  const railY = plankY - plankHeight;
  const rail = new Graphics()
    .rect(0, railY - railHeight, width, railHeight)
    .fill({ color: 0x5c5c5c });

  app.stage.addChild(rail);
  app.ticker.add((time) => {
    const dx = time.deltaTime * 6;

    planks.forEach((plank: any) => {
      plank.x -= dx;
      if (plank.x <= -(plankWidth + plankGap)) {
        plank.x += plankCount * (plankWidth + plankGap) + plankGap * 1.5;
      }
    });
  });
}

export function addTrain(app: Application<Renderer>, container: any) {
  const head = createTrainHead(app);
  const carriage = createTrainCarriage(app);
  carriage.x = -carriage.width;
  container.addChild(head, carriage);
  app.stage.addChild(container);
  const scale = 0.75;
  container.scale.set(scale);

  container.x = app.screen.width / 2 - head.width / 2;
  let elapsed = 0;
  const shakeDistance = 3;
  const baseY = app.screen.height - 35 - 55 * scale;
  const speed = 0.5;

  container.y = baseY;

  app.ticker.add((time) => {
    elapsed += time.deltaTime;
    const offset = (Math.sin(elapsed * 0.5 * speed) * 0.5 + 0.5) * shakeDistance;

    container.y = baseY + offset;
  });
}

export function createTrainHead(app: Application<Renderer>) {
  const container = new Container();
  const frontHeight = 100;
  const frontWidth = 140;
  const frontRadius = frontHeight / 2;
  const cabinHeight = 200;
  const cabinWidth = 150;
  const cabinRadius = 15;
  const chimneyBaseWidth = 30;
  const chimneyTopWidth = 50;
  const chimneyHeight = 70;
  const chimneyDomeHeight = 25;
  const chimneyTopOffset = (chimneyTopWidth - chimneyBaseWidth) / 2;
  const chimneyStartX = cabinWidth + frontWidth - frontRadius - chimneyBaseWidth;
  const chimneyStartY = -frontHeight;
  const roofHeight = 25;
  const roofExcess = 20;
  const doorWidth = cabinWidth * 0.7;
  const doorHeight = cabinHeight * 0.7;
  const doorStartX = (cabinWidth - doorWidth) * 0.5;
  const doorStartY = -(cabinHeight - doorHeight) * 0.5 - doorHeight;
  const windowWidth = doorWidth * 0.8;
  const windowHeight = doorHeight * 0.4;
  const offset = (doorWidth - windowWidth) / 2;

  const graphics = new Graphics()
    .moveTo(chimneyStartX, chimneyStartY)
    .lineTo(chimneyStartX - chimneyTopOffset, chimneyStartY - chimneyHeight + chimneyDomeHeight)
    .quadraticCurveTo(
      chimneyStartX + chimneyBaseWidth / 2,
      chimneyStartY - chimneyHeight - chimneyDomeHeight,
      chimneyStartX + chimneyBaseWidth + chimneyTopOffset,
      chimneyStartY - chimneyHeight + chimneyDomeHeight
    )
    .lineTo(chimneyStartX + chimneyBaseWidth, chimneyStartY)
    .fill({ color: 0x121212 })
    .roundRect(
      cabinWidth - frontRadius - cabinRadius,
      -frontHeight,
      frontWidth + frontRadius + cabinRadius,
      frontHeight,
      frontRadius
    )
    .fill({ color: 0x7f3333 })
    .roundRect(0, -cabinHeight, cabinWidth, cabinHeight, cabinRadius)
    .fill({ color: 0x725f19 })
    .rect(
      -roofExcess / 2,
      cabinRadius - cabinHeight - roofHeight,
      cabinWidth + roofExcess,
      roofHeight
    )
    .fill({ color: 0x52431c })
    .roundRect(doorStartX, doorStartY, doorWidth, doorHeight, cabinRadius)
    .stroke({ color: 0x52431c, width: 3 })
    .roundRect(doorStartX + offset, doorStartY + offset, windowWidth, windowHeight, 10)
    .fill({ color: 0x848484 });

  const bigWheelRadius = 55;
  const smallWheelRadius = 35;
  const wheelGap = 5;
  const wheelOffsetY = 5;

  const backWheel = createTrainWheel(bigWheelRadius);
  const midWheel = createTrainWheel(smallWheelRadius);
  const frontWheel = createTrainWheel(smallWheelRadius);

  backWheel.x = bigWheelRadius;
  backWheel.y = wheelOffsetY;
  midWheel.x = backWheel.x + bigWheelRadius + smallWheelRadius + wheelGap;
  midWheel.y = backWheel.y + bigWheelRadius - smallWheelRadius;
  frontWheel.x = midWheel.x + smallWheelRadius * 2 + wheelGap;
  frontWheel.y = midWheel.y;

  container.addChild(graphics, backWheel, midWheel, frontWheel);
  app.ticker.add((time: any) => {
    const dr = time.deltaTime * 0.15;

    backWheel.rotation += dr * (smallWheelRadius / bigWheelRadius);
    midWheel.rotation += dr;
    frontWheel.rotation += dr;
  });

  return container;
}

export function createTrainCarriage(app: Application<Renderer>) {
  const container = new Container();
  const containerHeight = 125;
  const containerWidth = 200;
  const containerRadius = 15;
  const edgeHeight = 25;
  const edgeExcess = 20;
  const connectorWidth = 30;
  const connectorHeight = 10;
  const connectorGap = 10;
  const connectorOffsetY = 20;
  const graphics = new Graphics()
    .roundRect(edgeExcess / 2, -containerHeight, containerWidth, containerHeight, containerRadius)
    .fill({ color: 0x725f19 })

    .rect(
      0,
      containerRadius - containerHeight - edgeHeight,
      containerWidth + edgeExcess,
      edgeHeight
    )
    .fill({ color: 0x52431c })

    .rect(
      containerWidth + edgeExcess / 2,
      -connectorOffsetY - connectorHeight,
      connectorWidth,
      connectorHeight
    )
    .rect(
      containerWidth + edgeExcess / 2,
      -connectorOffsetY - connectorHeight * 2 - connectorGap,
      connectorWidth,
      connectorHeight
    )
    .fill({ color: 0x121212 });

  const wheelRadius = 35;
  const wheelGap = 40;
  const centerX = (containerWidth + edgeExcess) / 2;
  const offsetX = wheelRadius + wheelGap / 2;

  const backWheel = createTrainWheel(wheelRadius);
  const frontWheel = createTrainWheel(wheelRadius);
  backWheel.x = centerX - offsetX;
  frontWheel.x = centerX + offsetX;
  frontWheel.y = backWheel.y = 25;

  container.addChild(graphics, backWheel, frontWheel);

  app.ticker.add((time) => {
    const dr = time.deltaTime * 0.15;

    backWheel.rotation += dr;
    frontWheel.rotation += dr;
  });

  return container;
}

export function createTrainWheel(radius: number) {
  const strokeThickness = radius / 3;
  const innerRadius = radius - strokeThickness;

  return new Graphics()
    .circle(0, 0, radius)
    .fill({ color: 0x848484 })
    .stroke({ color: 0x121212, width: strokeThickness, alignment: 1 })
    .rect(-strokeThickness / 2, -innerRadius, strokeThickness, innerRadius * 2)
    .rect(-innerRadius, -strokeThickness / 2, innerRadius * 2, strokeThickness)
    .fill({ color: 0x4f4f4f });
}

export function addSmoke(app: Application<Renderer>, train: any) {
  const groupCount = 5;
  const particleCount = 7;
  const groups: any = [];
  const baseX = train.x + 170;
  const baseY = train.y - 120;

  for (let index = 0; index < groupCount; index++) {
    const smokeGroup = new Graphics() as any;

    for (let i = 0; i < particleCount; i++) {
      const radius = 20 + Math.random() * 20;
      const x = (Math.random() * 2 - 1) * 40;
      const y = (Math.random() * 2 - 1) * 40;
      smokeGroup.circle(x, y, radius);
    }
    smokeGroup.fill({ color: 0xc9c9c9 });
    smokeGroup.x = baseX;
    smokeGroup.y = baseY;
    smokeGroup.tick = index * (1 / groupCount);

    app.stage.addChild(smokeGroup);
    groups.push(smokeGroup);
  }

  app.ticker.add((time) => {
    const dt = time.deltaTime * 0.01;
    groups.forEach((group: any) => {
      group.tick = (group.tick + dt) % 1;
      group.x = baseX - Math.pow(group.tick, 2) * 400;
      group.y = baseY - group.tick * 200;
      group.scale.set(Math.pow(group.tick, 0.75));
      group.alpha = 1 - Math.pow(group.tick, 0.5);
    });
  });
}

const moonSvg = `
<svg width="111" height="126" viewBox="0 0 111 126" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd"
        d="M9.99794 104.751C44.7207 104.751 72.869 76.6028 72.869 41.8801C72.869 25.9516 66.9455
        11.4065 57.1812 0.327637C87.3034 4.98731 110.363 31.0291 110.363 62.4566C110.363 97.1793
        82.2144 125.328 47.4917 125.328C28.6975 125.328 11.8294 117.081 0.308472 104.009C3.46679
        104.498 6.70276 104.751 9.99794 104.751Z" fill="#FFDF00"/>
    <path fill-rule="evenodd" clip-rule="evenodd"
        d="M57.4922 0.682129C75.7709 10.9731 88 29.7256 88 51.1529C88 83.6533 59.8656 110 25.16
        110C16.9934 110 9.19067 108.541 2.03273 105.887C1.44552 105.272 0.870627 104.646 0.308472
        104.008C3.46679 104.497 6.70276 104.75 9.99794 104.75C44.7207 104.75 72.869 76.6018 72.869
        41.8791C72.869 26.1203 67.0711 11.7158 57.4922 0.682129Z" fill="#DEC61A"/>
</svg>
`;
