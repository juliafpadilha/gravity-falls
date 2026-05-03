// estados do jogo
let cena = 0; // 0: Menu, 1: Jogo, 2: Game Over
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

function setup() {
  createCanvas(800, 600);
  carregarNivel(nivelAtual);
}

function draw() {
  background(20, 20, 40);

  if (cena === 0) {
    telaMenu();
  } else if (cena === 1) {
    executarJogo();
  } else if (cena === 2) {
    telaGameOver();
  } else if (cena === 3) {
    telaVitoriaFinal();
  }
}

// Configuração de cada fase
function carregarNivel(n) {
  plataformas = [];
  perigos = [];
  plataformasMoveis = [];
  inimigos = [];

  // NÍVEL 1: O Aquecimento
  if (n === 1) {
    plataformas.push({x: 0, y: 550, w: 250, h: 50}, {x: 550, y: 550, w: 250, h: 50});
    plataformas.push({x: 300, y: 450, w: 200, h: 20}, {x: 100, y: 350, w: 100, h: 20});
    perigos.push({x: 250, y: 580, w: 300, h: 20}); 
    objetivo = {x: 720, y: 500, w: 40, h: 50};
  } 
  // NÍVEL 2: Saltos de Precisão
  else if (n === 2) {
    plataformas.push({x: 0, y: 550, w: 100, h: 50}, {x: 150, y: 450, w: 100, h: 20});
    plataformas.push({x: 300, y: 350, w: 200, h: 20}, {x: 550, y: 250, w: 100, h: 20});
    perigos.push({x: 0, y: 590, w: width, h: 10}); 
    inimigos.push(new Inimigo(400, 320, 120, 2)); 
    objetivo = {x: 580, y: 200, w: 40, h: 50};
  }
  // NÍVEL 3: O Elevador
  else if (n === 3) {
    plataformas.push({x: 0, y: 550, w: 150, h: 50});
    // Plataforma móvel para alcançar o topo
    plataformasMoveis.push({x: 200, y: 480, w: 100, h: 20, range: 150, vel: 2, inicialX: 200});
    plataformas.push({x: 400, y: 380, w: 150, h: 20}, {x: 600, y: 280, w: 150, h: 20}); 
    perigos.push({x: 150, y: 580, w: 650, h: 20});
    objetivo = {x: 650, y: 230, w: 40, h: 50};
  }
  // NÍVEL 4: Labirinto de Perigo
  else if (n === 4) {
    plataformas.push({x: 0, y: 550, w: 800, h: 50});
    inimigos.push(new Inimigo(450, 520, 300, 2.5)); 
    perigos.push({x: 200, y: 320, w: 400, h: 20}); 
    plataformas.push({x: 200, y: 340, w: 400, h: 10});
    objetivo = {x: 730, y: 500, w: 40, h: 50};
  }
  // NÍVEL 5: A Cabana do Mistério (Final)
  else {
    plataformas.push({x: 0, y: 550, w: 200, h: 50}, {x: 600, y: 550, w: 200, h: 50});
    plataformasMoveis.push({x: 250, y: 400, w: 300, h: 20, range: 300, vel: 1.5, inicialX: 250});
    inimigos.push(new Inimigo(385, 370, 300, 1.5)); 
    perigos.push({x: 200, y: 580, w: 400, h: 20});
    objetivo = {x: 400, y: 500, w: 80, h: 70}; 
  }

  p1 = new Jogador(30, 450, 87, 65, 68, color(255, 100, 150)); 
  p2 = new Jogador(80, 450, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, color(100, 200, 255));
}

function executarJogo() {
  // fesenhar e atualizar inimigos (bill)
  for (let ini of inimigos) {
    ini.atualizar();
    ini.desenhar();
    if (p1.colide(ini) || p2.colide(ini)) cena = 2;
  }

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
    cena = 3; // vitória
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

function telaVitoriaFinal() {
  background(0, 50, 0);
  textAlign(CENTER);
  fill(255, 215, 0);
  textSize(40);
  text("VOCÊS CHEGARAM AO FINAL!", width/2, height/2 - 60);
  textSize(30);
  fill(255);
  text("PARABÉNS!", width/2, height/2 - 10);
  
  textSize(24);
  text("PONTUAÇÃO FINAL:", width/2, height/2 + 60);
  text(`Mabel: ${vitoriasP1} vitórias`, width/2, height/2 + 90);
  text(`Dipper: ${vitoriasP2} vitórias`, width/2, height/2 + 120);
  
  textSize(18);
  fill(200);
  text("Pressione 'R' para recomeçar a jornada", width/2, height/2 + 180);
}

function keyPressed() {
  if (cena === 0 && key === ' ') cena = 1;
  if (cena === 2 && (key === 'r' || key === 'R')) {
    nivelAtual = 1; vitoriasP1 = 0; vitoriasP2 = 0;
    carregarNivel(1); cena = 0;
  }
}