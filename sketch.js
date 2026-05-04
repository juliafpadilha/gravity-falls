// estados do jogo
let cena = 0;
let nivelAtual = 1;
const totalNiveis = 5;

let p1, p2;
let plataformas = [];
let perigos = [];
let plataformasMoveis = [];
let inimigos = [];
let objetivo;
let vitoriasP1 = 0;
let vitoriasP2 = 0;

// imagens
let imgDipper, imgMabel;
let imgMenu;
let imgGameOver;
let imgYouWin;
let imgPlataforma;

// objetivos
let imgBone, imgDiario, imgGnomo, imgWaddles, imgBill;

// música
let musicaFundo;

//fonte
let fontePixel;

//preload
function preload() {
  musicaFundo = loadSound('musica.mp3');
  fontePixel = loadFont('pixel.ttf');
}


function setup() {
  createCanvas(800, 600);

  imgDipper = loadImage('/assets/dipper.png');
  imgMabel = loadImage('/assets/mabel.png');
  imgMenu = loadImage('/assets/menu.png');
  imgGameOver = loadImage('/assets/gameover.png');
  imgYouWin = loadImage('/assets/youwin.png');

  imgBone = loadImage('/assets/bone.png');
  imgDiario = loadImage('/assets/diario.png');
  imgGnomo = loadImage('/assets/gnomo.png');
  imgWaddles = loadImage('/assets/waddles.png');
  imgBill = loadImage('/assets/bill.png');
  

  imgPlataforma = loadImage('/assets/plataforma.png');

  carregarNivel(nivelAtual);
}

function draw() {
  background(20, 20, 40);

  if (cena === 0) telaMenu();
  else if (cena === 1) executarJogo();
  else if (cena === 2) telaGameOver();
  else if (cena === 3) telaVitoriaFinal();
}

// níveis
function carregarNivel(n) {
  plataformas = [];
  perigos = [];
  plataformasMoveis = [];
  inimigos = [];

  if (n === 1) {
    plataformas.push({x: 0, y: 550, w: 250, h: 50}, {x: 550, y: 550, w: 250, h: 50});
    plataformas.push({x: 300, y: 450, w: 200, h: 20});
    perigos.push({x: 256, y: 580, w: 295, h: 20}); 
    objetivo = {x: 720, y: 500, w: 60, h: 50, sprite: imgBone};
  } 
  else if (n === 2) {
    plataformas.push({x: 0, y: 550, w: 100, h: 50}, {x: 150, y: 450, w: 100, h: 20});
    plataformas.push({x: 300, y: 350, w: 200, h: 20}, {x: 550, y: 250, w: 100, h: 20});
    perigos.push({x: 0, y: 590, w: width, h: 10}); 
    inimigos.push(new Inimigo(400, 320, 120, 2)); 
    objetivo = {x: 580, y: 200, w: 50, h: 40, sprite: imgDiario};
  }
  else if (n === 3) {
    plataformas.push({x: 0, y: 550, w: 150, h: 50});
    plataformasMoveis.push({x: 200, y: 480, w: 100, h: 20, range: 150, vel: 2, inicialX: 200});
    plataformas.push({x: 400, y: 380, w: 150, h: 20}, {x: 600, y: 280, w: 150, h: 20}); 
    perigos.push({x: 160, y: 580, w: 650, h: 20});
    objetivo = {x: 650, y: 230, w: 40, h: 50, sprite: imgGnomo};
  }
  else if (n === 4) {
    plataformas.push({x: 0, y: 550, w: 800, h: 50});
    inimigos.push(new Inimigo(450, 520, 300, 2.5)); 
    objetivo = {x: 730, y: 500, w: 40, h: 50, sprite: imgWaddles};
  }
  else {
    plataformas.push({x: 0, y: 550, w: 200, h: 50}, {x: 600, y: 550, w: 200, h: 50});
    plataformasMoveis.push({x: 250, y: 450, w: 300, h: 20, range: 300, vel: 1.5, inicialX: 250});
    inimigos.push(new Inimigo(385, 420, 300, 1.5)); 
    perigos.push({x: 225, y: 580, w: 375, h: 20});
    objetivo = {x: 400, y: 500, w: 80, h: 70, sprite: imgBill};
  }

  p1 = new Jogador(30, 450, 87, 65, 68, color(255, 100, 150), imgMabel); 
  p2 = new Jogador(80, 450, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, color(100, 200, 255), imgDipper);
}

function executarJogo() {
  for (let ini of inimigos) {
    ini.atualizar();
    ini.desenhar();
    if (p1.colide(ini) || p2.colide(ini)) cena = 2;
  }

  fill(150);
  for (let pm of plataformasMoveis) {
    pm.x = pm.inicialX + sin(frameCount * 0.05 * pm.vel) * pm.range/2;

    for (let x = 0; x < pm.w; x += 32) {
      for (let y = 0; y < pm.h; y += 32) {
        image(imgPlataforma, pm.x + x, pm.y + y, 32, 32);
      }
    }
  }

  for (let plat of plataformas) {
    for (let x = 0; x < plat.w; x += 32) {
      for (let y = 0; y < plat.h; y += 32) {
        image(imgPlataforma, plat.x + x, plat.y + y, 32, 32);
      }
    }
  }

  fill(255, 120, 0);
  for (let p of perigos) rect(p.x, p.y, p.w, p.h);

  let floatOffset = sin(frameCount * 0.05) * 10;
  image(objetivo.sprite, objetivo.x, objetivo.y + floatOffset, objetivo.w, objetivo.h);

  p1.atualizar(plataformas, perigos, plataformasMoveis);
  p2.atualizar(plataformas, perigos, plataformasMoveis);
  p1.desenhar();
  p2.desenhar();

  if (p1.colide(objetivo)) { vitoriasP1++; proxNivel(); }
  if (p2.colide(objetivo)) { vitoriasP2++; proxNivel(); }

  desenharPlacar(); // 🔹 AQUI
}

function desenharPlacar() {
  fill(255);
  textFont(fontePixel);
  textSize(18);
  textAlign(LEFT);
  text(`Mabel: ${vitoriasP1}`, 20, 30);
  textAlign(RIGHT);
  text(`Dipper: ${vitoriasP2}`, width - 20, 30);
}

function proxNivel() {
  if (nivelAtual < totalNiveis) {
    nivelAtual++;
    carregarNivel(nivelAtual);
  } else {
    cena = 3;
  }
}

class Inimigo {
  constructor(x, y, range, vel) {
    this.x = x; this.y = y;
    this.w = 30; this.h = 30;
    this.inicialX = x;
    this.range = range;
    this.vel = vel;
  }
  atualizar() {
    this.x = this.inicialX + sin(frameCount * 0.05 * this.vel) * this.range/2;
  }
  desenhar() {
    fill(255, 0, 0);
    triangle(this.x, this.y + this.h, this.x + this.w/2, this.y, this.x + this.w, this.y + this.h);
  }
}

class Jogador {
  constructor(x, y, up, left, right, cor, sprite) {
    this.x = x; this.y = y;
    this.w = 30; this.h = 40;
    this.vy = 0;
    this.gravidade = 0.7;
    this.pulo = -13;
    this.noChao = false;
    this.cor = cor;
    this.sprite = sprite;
    this.controles = { up, left, right };
  }

  atualizar(plats, pers, pmovs) {
    if (keyIsDown(this.controles.left)) this.x -= 6;
    if (keyIsDown(this.controles.right)) this.x += 6;

    this.vy += this.gravidade;
    this.y += this.vy;
    this.noChao = false;

    for (let plat of plats) {
      if (this.x < plat.x + plat.w && this.x + this.w > plat.x &&
          this.y + this.h > plat.y && this.y + this.h < plat.y + plat.h + this.vy) {
        this.y = plat.y - this.h;
        this.vy = 0;
        this.noChao = true;
      }
    }

    for (let pm of pmovs) {
      if (this.x < pm.x + pm.w && this.x + this.w > pm.x &&
          this.y + this.h > pm.y && this.y + this.h < pm.y + pm.h + this.vy) {
        this.y = pm.y - this.h;
        this.vy = 0;
        this.noChao = true;

        this.x += (sin(frameCount * 0.05 * pm.vel) * pm.range/2) -
                  (sin((frameCount-1) * 0.05 * pm.vel) * pm.range/2);
      }
    }

    if (this.noChao && keyIsDown(this.controles.up)) this.vy = this.pulo;

    for (let p of pers) { if (this.colide(p)) cena = 2; }
    if (this.y > height) cena = 2;

    this.x = constrain(this.x, 0, width - this.w);
  }

  desenhar() {
    image(this.sprite, this.x, this.y, this.w, this.h);
  }

  colide(obj) {
    return (this.x < obj.x + obj.w &&
            this.x + this.w > obj.x &&
            this.y < obj.y + obj.h &&
            this.y + this.h > obj.y);
  }
}

function telaMenu() {
  background(0);
  imageMode(CENTER);
  image(imgMenu, width/2, height/2 - 50, 500, 300);
  imageMode(CORNER);

  if (frameCount % 60 < 30) {
    fill(255);
    textFont(fontePixel);
    textAlign(CENTER);
    textSize(24);
    text("Aperte espaço para começar", width/2, height/2 + 180);
  }
}

function telaGameOver() {
  background(0);
  imageMode(CENTER);
  image(imgGameOver, width / 2, height / 2, 600, 400);
  imageMode(CORNER);

  desenharPlacar(); // 🔹 AQUI
}

function telaVitoriaFinal() {
  background(0);
  imageMode(CENTER);
  image(imgYouWin, width / 2, height / 2, 600, 400);
  imageMode(CORNER);

  desenharPlacar(); // 🔹 AQUI
}

//controle com áudio liberado
function keyPressed() {
  if (cena === 0 && key === ' ') {
    userStartAudio();
    cena = 1;

    if (!musicaFundo.isPlaying()) {
      musicaFundo.setLoop(true);
      musicaFundo.setVolume(0.5);
      musicaFundo.play();
    }
  }

  if (cena === 2 && (key === 'r' || key === 'R')) {
    nivelAtual = 1;
    vitoriasP1 = 0;
    vitoriasP2 = 0;
    carregarNivel(1);
    cena = 0;
  }
}