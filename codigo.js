// estados do jogo
let cena = 0; // 0: Menu, 1: Jogo, 2: Game Over
let nivelAtual = 1;
const totalNiveis = 5;

let p1, p2;
let plataformas = [];
let perigos = [];
let plataformasMoveis = [];
let objetivo;
let vitoriasP1 = 0;
let vitoriasP2 = 0;

function setup() {
  createCanvas(800, 600);
  carregarNivel(nivelAtual);
}

function draw() {
  background(30, 30, 50); // "céu"

  if (cena === 0) {
    telaMenu();
  } else if (cena === 1) {
    executarJogo();
  } else if (cena === 2) {
    telaGameOver();
  }
}

// Configuração de cada fase
function carregarNivel(n) {
  plataformas = [];
  perigos = [];
  plataformasMoveis = [];

  // NÍVEL 1: O Aquecimento
  if (n === 1) {
    plataformas.push({x: 0, y: 550, w: 300, h: 50}, {x: 500, y: 550, w: 300, h: 50});
    perigos.push({x: 300, y: 580, w: 200, h: 20}); // Poça no meio
    plataformas.push({x: 350, y: 400, w: 100, h: 20});
    objetivo = {x: 720, y: 500, w: 40, h: 50};
  } 
  // NÍVEL 2: Saltos de Precisão
  else if (n === 2) {
    plataformas.push({x: 0, y: 550, w: 100, h: 50});
    plataformas.push({x: 200, y: 450, w: 80, h: 20}, {x: 400, y: 350, w: 80, h: 20}, {x: 600, y: 250, w: 80, h: 20});
    perigos.push({x: 0, y: 590, w: width, h: 10}); // Chão de espinhos
    objetivo = {x: 620, y: 200, w: 40, h: 50};
  }
  // NÍVEL 3: O Elevador
  else if (n === 3) {
    plataformas.push({x: 0, y: 550, w: 150, h: 50});
    // Plataforma móvel para alcançar o topo
    plataformasMoveis.push({x: 200, y: 500, w: 100, h: 20, range: 200, vel: 2, inicialX: 200});
    plataformas.push({x: 450, y: 350, w: 200, h: 20}); 
    perigos.push({x: 150, y: 580, w: 650, h: 20});
    objetivo = {x: 550, y: 300, w: 40, h: 50};
  }
  // NÍVEL 4: Labirinto de Perigo
  else if (n === 4) {
    plataformas.push({x: 0, y: 200, w: 100, h: 20}, {x: 200, y: 300, w: 100, h: 20}, {x: 400, y: 400, w: 100, h: 20});
    plataformas.push({x: 600, y: 300, w: 100, h: 20}, {x: 700, y: 150, w: 100, h: 20});
    perigos.push({x: 0, y: 580, w: width, h: 20}, {x: 300, y: 0, w: 50, h: 350}); // Obstáculo vertical
    objetivo = {x: 730, y: 100, w: 40, h: 50};
  }
  // NÍVEL 5: A Cabana do Mistério (Final)
  else {
    plataformas.push({x: 0, y: 550, w: 800, h: 50});
    plataformasMoveis.push({x: 100, y: 400, w: 150, h: 20, range: 400, vel: 4, inicialX: 100});
    perigos.push({x: 200, y: 530, w: 400, h: 20});
    objetivo = {x: 400, y: 480, w: 80, h: 70}; // Tio Stan espera aqui
  }

  p1 = new Jogador(30, 450, 87, 65, 68, color(255, 100, 150)); 
  p2 = new Jogador(80, 450, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, color(100, 200, 255));
}

function executarJogo() {
  // desenhar plataformas e móveis
  fill(150, 150, 150);
  for (let pm of plataformasMoveis) {
    pm.x = pm.inicialX + sin(frameCount * 0.05 * pm.vel) * pm.range/2;
    rect(pm.x, pm.y, pm.w, pm.h);
  }

  // desenhar plataformas fixas
  fill(80, 50, 30);
  for (let plat of plataformas) rect(plat.x, plat.y, plat.w, plat.h);

  // desenhar "perigos"
  fill(0, 255, 100); // verde tóxico
  for (let p of perigos) rect(p.x, p.y, p.w, p.h);

  // desenhar objetivo
  fill(255, 215, 0);
  rect(objetivo.x, objetivo.y, objetivo.w, objetivo.h);

  p1.atualizar(plataformas, perigos, plataformasMoveis);
  p2.atualizar(plataformas, perigos, plataformasMoveis);
  p1.desenhar();
  p2.desenhar();

  if (p1.colide(objetivo)) { vitoriasP1++; proxNivel(); }
  if (p2.colide(objetivo)) { vitoriasP2++; proxNivel(); }
}

function proxNivel() {
  if (nivelAtual < totalNiveis) {
    nivelAtual++;
    carregarNivel(nivelAtual);
  } else {
    cena = 2;
  }
}

class Jogador {
  constructor(x, y, up, left, right, cor) {
    this.x = x; this.y = y;
    this.w = 30; this.h = 40;
    this.vy = 0;
    // física de gravidade!!!!
    this.gravidade = 0.7;
    this.pulo = -13;
    this.noChao = false;
    this.cor = cor;
    this.controles = { up, left, right };
  }

  atualizar(plats, pers, pmovs) {
    if (keyIsDown(this.controles.left)) this.x -= 6;
    if (keyIsDown(this.controles.right)) this.x += 6;

    this.vy += this.gravidade;
    this.y += this.vy;
    this.noChao = false;

    // colisão com plataformas fixas
    for (let plat of plats) {
      if (this.x < plat.x + plat.w && this.x + this.w > plat.x &&
          this.y + this.h > plat.y && this.y + this.h < plat.y + plat.h + this.vy) {
        this.y = plat.y - this.h;
        this.vy = 0;
        this.noChao = true;
      }
    }

    // colisão plataformas móveis
    for (let pm of pmovs) {
      if (this.x < pm.x + pm.w && this.x + this.w > pm.x &&
          this.y + this.h > pm.y && this.y + this.h < pm.y + pm.h + this.vy) {
        this.y = pm.y - this.h;
        this.vy = 0;
        this.noChao = true;
        // o jogador "pega carona" no movimento da plataforma
        this.x += (sin(frameCount * 0.05 * pm.vel) * pm.range/2) - (sin((frameCount-1) * 0.05 * pm.vel) * pm.range/2);
      }
    }

    if (this.noChao && keyIsDown(this.controles.up)) this.vy = this.pulo;

    // FORMAS DE MORRER:
    // 1. tocar no perigo (lava/veneno)
    for (let p of pers) { if (this.colide(p)) cena = 2; }
    // 2. cair da tela (buracos)
    if (this.y > height) cena = 2;

    this.x = constrain(this.x, 0, width - this.w);
  }

  desenhar() {
    fill(this.cor);
    rect(this.x, this.y, this.w, this.h);
  }

  colide(obj) {
    return (this.x < obj.x + obj.w && this.x + this.w > obj.x &&
            this.y < obj.y + obj.h && this.y + this.h > obj.y);
  }
}

function telaMenu() {
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("GRAVITY FALLS: ESCAPE\n[ESPAÇO] PARA COMEÇAR", width/2, height/2);
}

function telaGameOver() {
  background(20, 0, 0);
  fill(255, 0, 0);
  textAlign(CENTER);
  textSize(40);
  text("VOCÊS FORAM DERROTADOS!", width/2, height/2 - 40);
  fill(255);
  textSize(20);
  text(`Placar Final: Mabel ${vitoriasP1} x ${vitoriasP2} Dipper`, width/2, height/2 + 20);
  text("Pressione 'R' para tentar novamente", width/2, height/2 + 60);
}

function keyPressed() {
  if (cena === 0 && key === ' ') cena = 1;
  if (cena === 2 && (key === 'r' || key === 'R')) {
    nivelAtual = 1; vitoriasP1 = 0; vitoriasP2 = 0;
    carregarNivel(1); cena = 0;
  }
}