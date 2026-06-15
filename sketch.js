// estados do jogo
let cena = 0; // 0: Menu, 1: Jogo, 2: Game Over, 3: Vitória, 4: Sobre
let nivelAtual = 1;
const totalNiveis = 5;

// controle do menu
let opcaoMenu = 0; // 0: Começar, 1: Sobre

// sistema de pontuação
let pontosTotaisP1 = 0; // Mabel
let pontosTotaisP2 = 0; // Dipper
let pontosNivelP1 = 0;
let pontosNivelP2 = 0;

let p1, p2;
let plataformas = [];
let perigos = [];
let plataformasMoveis = [];
let inimigos = [];
let itens = [];
let portaP1, portaP2; // Portas individuais

// sprites dos jogadores
let spritesDipper = [];
let spritesMabel = [];
let imgMenu, imgGameOver, imgYouWin;
const ALTURA_JOGADOR = 52;
const TAMANHO_MOEDA = 20;
const OSCILACAO_MOEDA = 4;

// música e fonte
let musicaFundo;
let fontePixel;

function preload() {
  try {
    musicaFundo = loadSound('musica.mp3');
    fontePixel = loadFont('pixel.ttf');
    spritesDipper = carregarSpritesJogador('dipper', 'dipper.png');
    spritesMabel = carregarSpritesJogador('mabel', 'mabel.png');
    carregarImagem('menu.png', (img) => imgMenu = img);
    carregarImagem('gameover.png', (img) => imgGameOver = img);
    carregarImagem('youwin.png', (img) => imgYouWin = img);
  } catch (e) {
    console.log("Arquivos de mídia não encontrados. Usando fallbacks.");
  }
}

function carregarImagem(arquivo, aoCarregar) {
  loadImage(`assets/${arquivo}`, aoCarregar, () => {
    loadImage(arquivo, aoCarregar, () => {});
  });
}

function carregarImagemOpcional(arquivo, aoCarregar) {
  loadImage(`assets/${arquivo}`, aoCarregar, () => {
    loadImage(arquivo, aoCarregar, () => {});
  });
}

function carregarSpritesJogador(nome, fallbackArquivo) {
  let sprites = {
    fallback: null,
    frames: [null, null, null]
  };

  carregarImagem(fallbackArquivo, (img) => sprites.fallback = criarFrameSprite(img));

  for (let i = 0; i < 3; i++) {
    let numero = i + 1;
    carregarImagemOpcional(`${nome}${numero}.png`, (img) => sprites.frames[i] = criarFrameSprite(img));
  }

  return sprites;
}

function criarFrameSprite(img) {
  return {
    img,
    corte: calcularCorteSprite(img)
  };
}

function calcularCorteSprite(img) {
  img.loadPixels();

  let minX = img.width;
  let minY = img.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let alpha = img.pixels[(y * img.width + x) * 4 + 3];

      if (alpha > 10) {
        minX = min(minX, x);
        minY = min(minY, y);
        maxX = max(maxX, x);
        maxY = max(maxY, y);
      }
    }
  }

  if (maxX < 0 || maxY < 0) {
    return {x: 0, y: 0, w: img.width, h: img.height};
  }

  return {
    x: minX,
    y: minY,
    w: maxX - minX + 1,
    h: maxY - minY + 1
  };
}

function setup() {
  createCanvas(800, 600);
  carregarNivel(nivelAtual);
}

function draw() {
  if (cena === 1) desenharPaisagemEscura();
  else background(20, 20, 40);

  if (cena === 0) telaMenu();
  else if (cena === 1) executarJogo();
  else if (cena === 2) telaGameOver();
  else if (cena === 3) telaVitoriaFinal();
  else if (cena === 4) telaSobre();
}

// ==========================================
// FUNDO DO JOGO
// ==========================================
function desenharPaisagemEscura() {
  push();
  noStroke();

  for (let y = 0; y < height; y++) {
    let t = y / height;
    let topo = color(5, 7, 18);
    let base = color(22, 18, 38);
    stroke(lerpColor(topo, base, t));
    line(0, y, width, y);
  }

  noStroke();
  fill(225, 220, 180, 210);
  ellipse(690, 90, 56, 56);
  fill(8, 9, 24, 225);
  ellipse(708, 78, 46, 46);

  fill(255, 242, 180, 160);
  for (let i = 0; i < 34; i++) {
    let x = (i * 73 + 31) % width;
    let y = 45 + ((i * 47) % 210);
    let brilho = 1 + (i % 3);
    ellipse(x, y, brilho, brilho);
  }

  fill(16, 20, 38);
  beginShape();
  vertex(0, 370);
  vertex(90, 265);
  vertex(175, 350);
  vertex(270, 235);
  vertex(390, 365);
  vertex(520, 245);
  vertex(650, 360);
  vertex(800, 260);
  vertex(800, 600);
  vertex(0, 600);
  endShape(CLOSE);

  fill(10, 14, 28);
  beginShape();
  vertex(0, 430);
  vertex(110, 335);
  vertex(230, 425);
  vertex(350, 315);
  vertex(500, 430);
  vertex(650, 325);
  vertex(800, 420);
  vertex(800, 600);
  vertex(0, 600);
  endShape(CLOSE);

  fill(4, 8, 16);
  rect(0, 470, width, 130);
  for (let x = -20; x < width + 40; x += 38) {
    let h = 70 + ((x * 13) % 45);
    triangle(x, 470, x + 20, 470 - h, x + 40, 470);
    rect(x + 16, 462, 8, 78);
  }

  fill(120, 135, 165, 22);
  ellipse(185, 430 + sin(frameCount * 0.01) * 3, 260, 34);
  ellipse(520, 390 + sin(frameCount * 0.012) * 3, 310, 38);
  ellipse(700, 465 + sin(frameCount * 0.009) * 3, 230, 30);

  pop();
}

// ==========================================
// CARREGAMENTO DOS NÍVEIS (LAYOUTS)
// ==========================================
function carregarNivel(n) {
  plataformas = [];
  perigos = [];
  plataformasMoveis = [];
  inimigos = [];
  itens = [];
  
  pontosNivelP1 = 0;
  pontosNivelP2 = 0;

  let spawnP1, spawnP2;

  if (n === 1) {
    spawnP1 = {x: 30, y: 500};
    spawnP2 = {x: 30, y: 400};
    
    plataformas.push({x: 0, y: 550, w: 300, h: 50}, {x: 400, y: 550, w: 400, h: 50}); 
    plataformas.push({x: 0, y: 450, w: 200, h: 20}, {x: 250, y: 360, w: 550, h: 20}); 
    plataformas.push({x: 0, y: 230, w: 350, h: 20}, {x: 470, y: 260, w: 130, h: 20}); 
    plataformas.push({x: 650, y: 230, w: 150, h: 20}); 
    
    perigos.push({x: 300, y: 580, w: 100, h: 20}); 
    perigos.push({x: 400, y: 340, w: 20, h: 20}); 
    perigos.push({x: 520, y: 530, w: 20, h: 20});

    portaP1 = {x: 680, y: 160, w: 40, h: 70};
    portaP2 = {x: 740, y: 160, w: 40, h: 70};

    let posItens = [[100,500],[480,500],[700,500], [150,400],[300,320],[600,320], [100,280],[300,280],[540,225], [50,150]];
    adicionarItens(posItens);
  } 
  
  else if (n === 2) {
    spawnP1 = {x: 50, y: 500};
    spawnP2 = {x: 700, y: 500};

    plataformas.push({x: 0, y: 550, w: 320, h: 50}, {x: 480, y: 550, w: 320, h: 50});
    plataformas.push({x: 310, y: 480, w: 170, h: 20}); 
    
    plataformas.push({x: 80, y: 420, w: 180, h: 20}, {x: 540, y: 420, w: 180, h: 20}); 
    
    plataformas.push({x: 350, y: 350, w: 100, h: 50}); 
    
    plataformas.push({x: 150, y: 230, w: 200, h: 20}); 
    plataformas.push({x: 450, y: 230, w: 200, h: 20}); 

    perigos.push({x: 320, y: 580, w: 160, h: 20}); 
    perigos.push({x: 390, y: 330, w: 20, h: 20});

    portaP1 = {x: 150, y: 350, w: 40, h: 70};
    portaP2 = {x: 600, y: 350, w: 40, h: 70};

    let posItens = [[150,500],[650,500],[520,430], [50,300],[750,300], [300,200],[480,200], [200,100],[400,100],[600,100]];
    adicionarItens(posItens);
  }

  else if (n === 3) {
    spawnP1 = {x: 50, y: 50};
    spawnP2 = {x: 700, y: 50};

    plataformas.push({x: 0, y: 120, w: 200, h: 20}, {x: 600, y: 120, w: 200, h: 20});
    plataformas.push({x: 150, y: 250, w: 500, h: 20});
    plataformas.push({x: 0, y: 400, w: 300, h: 20}, {x: 450, y: 400, w: 350, h: 20});
    plataformas.push({x: 0, y: 550, w: 800, h: 50});

    perigos.push({x: 260, y: 230, w: 70, h: 20});
    perigos.push({x: 340, y: 530, w: 70, h: 20});
    perigos.push({x: 500, y: 230, w: 40, h: 20}); 

    portaP1 = {x: 650, y: 480, w: 40, h: 70};
    portaP2 = {x: 720, y: 480, w: 40, h: 70};

    let posItens = [[100,80],[700,80], [250,200],[400,200],[600,200], [50,350],[200,350],[550,350], [300,500],[500,500]];
    adicionarItens(posItens);
  }

  else if (n === 4) {
    spawnP1 = {x: 50, y: 500};
    spawnP2 = {x: 120, y: 500};

    plataformas.push({x: 0, y: 550, w: 800, h: 50});
    plataformas.push({x: 100, y: 450, w: 120, h: 20}, {x: 390, y: 450, w: 110, h: 20}, {x: 660, y: 450, w: 120, h: 20});
    plataformas.push({x: 0, y: 350, w: 350, h: 20}, {x: 520, y: 350, w: 240, h: 20});   
    plataformas.push({x: 100, y: 250, w: 700, h: 20}); 

    perigos.push({x: 270, y: 530, w: 70, h: 20}, {x: 540, y: 530, w: 70, h: 20});
    perigos.push({x: 430, y: 430, w: 20, h: 20}); 
    perigos.push({x: 550, y: 230, w: 40, h: 20});
    
    portaP1 = {x: 150, y: 180, w: 40, h: 70};
    portaP2 = {x: 220, y: 180, w: 40, h: 70};

    let posItens = [
      [50, 520], [700, 520], 
      [150, 420], [430, 420], [700, 420], 
      [250, 320], [600, 320], 
      [200, 220], [400, 220], [650, 220]  
    ];
    adicionarItens(posItens);
  }

  else {
    spawnP1 = {x: 50, y: 300};
    spawnP2 = {x: 720, y: 100};

    plataformas.push({x: 0, y: 550, w: 800, h: 50});
    plataformas.push({x: 0, y: 350, w: 150, h: 20}, {x: 250, y: 350, w: 300, h: 20}, {x: 650, y: 350, w: 150, h: 20});
    plataformas.push({x: 180, y: 200, w: 800, h: 20});
    

    perigos.push({x: 200, y: 530, w: 100, h: 20}, {x: 450, y: 530, w: 100, h: 20});
    perigos.push({x: 350, y: 330, w: 40, h: 20});

    inimigos.push(new Inimigo(350, 170, 200, 2)); 

    portaP1 = {x: 150, y: 480, w: 40, h: 70};
    portaP2 = {x: 650, y: 280, w: 40, h: 70};

    let posItens = [[50,500],[400,500],[700,500], [100,300],[350,300],[500,300], [200,150],[500,150],[600,150], [700,50]];
    adicionarItens(posItens);
  }

  p1 = new Jogador(spawnP1.x, spawnP1.y, 87, 65, 68, color(255, 100, 150), spritesMabel, 1); 
  p2 = new Jogador(spawnP2.x, spawnP2.y, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, color(100, 200, 255), spritesDipper, 2);
}

function adicionarItens(posItens) {
  for (let p of posItens) {
    itens.push({
      x: p[0],
      y: p[1],
      w: TAMANHO_MOEDA,
      h: TAMANHO_MOEDA,
      coletado: false
    });
  }
}

// ==========================================
// LOOP PRINCIPAL DO JOGO
// ==========================================
function executarJogo() {
  for (let ini of inimigos) {
    ini.atualizar();
    ini.desenhar();
    if (p1.colide(ini) || p2.colide(ini)) morrer();
  }

  fill(150);
  for (let pm of plataformasMoveis) {
    pm.x = pm.inicialX + sin(frameCount * 0.05 * pm.vel) * pm.range/2;
    desenharPlataforma(pm);
  }
  for (let plat of plataformas) desenharPlataforma(plat);

  for (let p of perigos) desenharPocaMagica(p);

  fill(255, 100, 150, 150); 
  rect(portaP1.x, portaP1.y, portaP1.w, portaP1.h);
  fill(100, 200, 255, 150); 
  rect(portaP2.x, portaP2.y, portaP2.w, portaP2.h);

  let floatOffset = sin(frameCount * 0.1) * OSCILACAO_MOEDA;
  for (let i = 0; i < itens.length; i++) {
    let item = itens[i];
    if (!item.coletado) {
      desenharMoeda(item, floatOffset);

      let areaMoeda = {x: item.x, y: item.y + floatOffset, w: item.w, h: item.h};
      if (p1.colide(areaMoeda)) { item.coletado = true; pontosNivelP1 += 100; }
      if (p2.colide(areaMoeda)) { item.coletado = true; pontosNivelP2 += 100; }
    }
  }

  p1.atualizar(plataformas, perigos, plataformasMoveis);
  p2.atualizar(plataformas, perigos, plataformasMoveis);
  p1.desenhar();
  p2.desenhar();

  // Verifica as condições de porta
  if (!p1.chegouNoDestino && p1.colide(portaP1)) {
    p1.chegouNoDestino = true;
    p1.x = portaP1.x + portaP1.w / 2 - p1.w / 2;
    p1.y = portaP1.y + portaP1.h - p1.h;
    pontosNivelP1 += 300;
  }

  if (!p2.chegouNoDestino && p2.colide(portaP2)) {
    p2.chegouNoDestino = true;
    p2.x = portaP2.x + portaP2.w / 2 - p2.w / 2;
    p2.y = portaP2.y + portaP2.h - p2.h;
    pontosNivelP2 += 300;
  }

  // Avança de fase apenas se os DOIS chegaram na porta
  if (p1.chegouNoDestino && p2.chegouNoDestino) {
    finalizarFase();
  }

  desenharPlacar();
}

function desenharPlataforma(p) {
  push();
  noStroke();

  drawingContext.shadowBlur = 0;
  fill(0, 0, 0, 85);
  rect(p.x + 3, p.y + 5, p.w, p.h, 2);

  fill(39, 34, 33);
  rect(p.x, p.y, p.w, p.h, 3);

  fill(58, 50, 45);
  rect(p.x, p.y, p.w, max(4, p.h * 0.22), 3, 3, 0, 0);

  fill(24, 22, 24, 155);
  rect(p.x, p.y + p.h * 0.66, p.w, p.h * 0.34, 0, 0, 3, 3);

  fill(38, 98, 64);
  rect(p.x, p.y, p.w, 4, 3, 3, 0, 0);

  fill(70, 138, 86, 190);
  for (let x = p.x + 6; x < p.x + p.w - 4; x += 28) {
    let musgoH = 2 + ((x + p.y) % 5);
    rect(x, p.y + 3, 14, musgoH, 0, 0, 3, 3);
  }

  stroke(22, 20, 22, 115);
  strokeWeight(1);
  for (let x = p.x + 18; x < p.x + p.w - 8; x += 34) {
    let yBase = p.y + 8 + ((x + p.y) % max(10, p.h - 8));
    line(x, yBase, min(x + 12, p.x + p.w - 4), min(yBase + 5, p.y + p.h - 4));
  }

  stroke(87, 77, 66, 90);
  for (let y = p.y + 10; y < p.y + p.h - 4; y += 13) {
    line(p.x + 4, y, p.x + p.w - 4, y);
  }

  pop();
}

function desenharPocaMagica(p) {
  let pulso = (sin(frameCount * 0.12 + p.x * 0.03) + 1) / 2;
  let centroX = p.x + p.w / 2;
  let centroY = p.y + p.h / 2;

  push();
  noStroke();

  drawingContext.shadowBlur = 4 + pulso * 5;
  fill(12, 196, 82, 225);
  rect(p.x, p.y + p.h * 0.22, p.w, p.h * 0.7, p.h * 0.35);

  fill(70, 255, 144, 235);
  beginShape();
  for (let i = 0; i <= 8; i++) {
    let x = p.x + (p.w / 8) * i;
    let y = p.y + p.h * 0.28 + sin(frameCount * 0.16 + i * 0.9 + p.x) * 2;
    vertex(x, y);
  }
  vertex(p.x + p.w, p.y + p.h * 0.9);
  vertex(p.x, p.y + p.h * 0.9);
  endShape(CLOSE);

  fill(190, 255, 206, 180);
  ellipse(centroX - p.w * 0.18, p.y + p.h * 0.36, max(6, p.w * 0.2), max(3, p.h * 0.18));
  ellipse(centroX + p.w * 0.23, p.y + p.h * 0.42, max(5, p.w * 0.15), max(3, p.h * 0.15));

  drawingContext.shadowBlur = 0;
  stroke(132, 255, 178, 210);
  strokeWeight(2);
  noFill();
  arc(centroX, centroY + p.h * 0.1, p.w * 0.92, p.h * 0.72, 0, PI);

  noStroke();
  fill(164, 255, 193, 150 + pulso * 70);
  let bolhas = max(1, floor(p.w / 36));
  for (let i = 0; i < bolhas; i++) {
    let bx = p.x + p.w * ((i + 1) / (bolhas + 1));
    let by = p.y + p.h * 0.12 + sin(frameCount * 0.09 + i) * 3;
    let tamanho = 3 + ((i + floor(frameCount / 20)) % 3);
    ellipse(bx, by, tamanho, tamanho);
  }

  pop();
}

function desenharMoeda(item, floatOffset) {
  let centroX = item.x + item.w / 2;
  let centroY = item.y + item.h / 2 + floatOffset;
  let pulso = (sin(frameCount * 0.08 + item.x * 0.02) + 1) / 2;
  let tamanho = item.w * (0.92 + pulso * 0.08);

  push();
  translate(centroX, centroY);

  noStroke();
  fill(0, 0, 0, 45);
  ellipse(0, item.h * 0.62, item.w * 0.76, item.h * 0.18);

  fill(255, 202, 58);
  ellipse(0, 0, tamanho, tamanho);

  stroke(169, 111, 18);
  strokeWeight(2);
  noFill();
  ellipse(0, 0, tamanho * 0.78, tamanho * 0.78);

  noStroke();
  fill(255, 239, 137, 210);
  ellipse(-tamanho * 0.18, -tamanho * 0.22, tamanho * 0.22, tamanho * 0.14);

  pop();
}

// ==========================================
// REGRAS DE PONTUAÇÃO E PROGRESSÃO
// ==========================================
function morrer() {
  cena = 2; 
}

function finalizarFase() {
  pontosTotaisP1 += pontosNivelP1;
  pontosTotaisP2 += pontosNivelP2;

  if (nivelAtual < totalNiveis) {
    nivelAtual++;
    carregarNivel(nivelAtual);
  } else {
    cena = 3;
  }
}

function desenharPlacar() {
  fill(255);
  if (fontePixel) textFont(fontePixel);
  textSize(18);
  
  // Placar Mabel
  textAlign(LEFT);
  text(`Mabel: ${pontosTotaisP1 + pontosNivelP1} pts`, 20, 30);
  
  // Indicador de Fase
  textAlign(CENTER);
  text(`Fase: ${nivelAtual} / ${totalNiveis}`, width / 2, 30);
  
  // Placar Dipper
  textAlign(RIGHT);
  text(`Dipper: ${pontosTotaisP2 + pontosNivelP2} pts`, width - 20, 30);
}

// ==========================================
// CLASSES
// ==========================================
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
  constructor(x, y, up, left, right, cor, sprites, id) {
    this.x = x; this.y = y;
    this.sprites = Array.isArray(sprites) ? { fallback: sprites[0], frames: sprites } : sprites;
    this.h = ALTURA_JOGADOR;
    this.w = this.calcularLarguraHitbox();
    this.vy = 0;
    this.gravidade = 0.7;
    this.pulo = -13;
    this.noChao = false;
    this.cor = cor;
    this.controles = { up, left, right };
    this.id = id;
    this.andando = false;
    this.direcao = 1;
    this.velocidadeAnimacao = 8;
    this.chegouNoDestino = false; 
  }

  atualizar(plats, pers, pmovs) {
    this.atualizarLarguraHitbox();

    if (this.chegouNoDestino) {
      this.andando = false;
      return;
    } 

    // === MOVIMENTO HORIZONTAL ===
    let oldX = this.x;
    let esquerdaPressionada = keyIsDown(this.controles.left);
    let direitaPressionada = keyIsDown(this.controles.right);
    this.andando = esquerdaPressionada || direitaPressionada;

    if (esquerdaPressionada) {
      this.x -= 6;
      this.direcao = -1;
    }
    if (direitaPressionada) {
      this.x += 6;
      this.direcao = 1;
    }

    for (let plat of plats) {
      if (this.colide(plat)) {
        if (this.x > oldX) this.x = plat.x - this.w; 
        else if (this.x < oldX) this.x = plat.x + plat.w; 
      }
    }

    for (let pm of pmovs) {
      if (this.colide(pm)) {
        if (this.x > oldX) this.x = pm.x - this.w;
        else if (this.x < oldX) this.x = pm.x + pm.w;
      }
    }

    this.x = constrain(this.x, 0, width - this.w);

    // === MOVIMENTO VERTICAL ===
    this.vy += this.gravidade;
    this.y += this.vy;
    this.noChao = false;

    for (let plat of plats) {
      if (this.colide(plat)) {
        if (this.vy > 0) { 
          this.y = plat.y - this.h;
          this.vy = 0;
          this.noChao = true;
        } else if (this.vy < 0) { 
          this.y = plat.y + plat.h;
          this.vy = 0;
        }
      }
    }

    for (let pm of pmovs) {
      if (this.colide(pm)) {
        if (this.vy > 0) {
          this.y = pm.y - this.h;
          this.vy = 0;
          this.noChao = true;
          this.x += (sin(frameCount * 0.05 * pm.vel) * pm.range/2) -
                    (sin((frameCount-1) * 0.05 * pm.vel) * pm.range/2);
        } else if (this.vy < 0) {
          this.y = pm.y + pm.h;
          this.vy = 0;
        }
      }
    }

    if (this.noChao && keyIsDown(this.controles.up)) this.vy = this.pulo;

    for (let p of pers) { if (this.colide(p)) morrer(); }
    if (this.y > height) morrer();
  }

  desenhar() {
    this.atualizarLarguraHitbox();
    let frameAtual = this.pegarFrameAtual();

    if (frameAtual && frameAtual.img) {
      let corte = frameAtual.corte;
      let larguraFrame = this.calcularLarguraFrame(frameAtual);
      let xFrame = this.x + (this.w - larguraFrame) / 2;

      push();
      if (this.direcao < 0) {
        translate(xFrame + larguraFrame, this.y);
        scale(-1, 1);
        image(frameAtual.img, 0, 0, larguraFrame, this.h, corte.x, corte.y, corte.w, corte.h);
      } else {
        image(frameAtual.img, xFrame, this.y, larguraFrame, this.h, corte.x, corte.y, corte.w, corte.h);
      }
      pop();
    } else {
      fill(this.cor);
      rect(this.x, this.y, this.w, this.h);
    }
  }

  pegarFrameAtual() {
    if (!this.sprites) return null;

    let frames = this.sprites.frames || [];
    let fallback = this.sprites.fallback || null;
    if (!this.andando) return frames[0] || fallback;

    let indice = floor(frameCount / this.velocidadeAnimacao) % frames.length;
    return frames[indice] || fallback;
  }

  pegarTodosFrames() {
    if (!this.sprites) return [];

    let frames = this.sprites.frames || [];
    return [this.sprites.fallback, ...frames].filter((frame) => frame && frame.corte);
  }

  calcularLarguraFrame(frame) {
    if (!frame || !frame.corte || frame.corte.h <= 0) return 30;
    return ceil(this.h * (frame.corte.w / frame.corte.h));
  }

  calcularLarguraHitbox() {
    let frames = this.pegarTodosFrames();
    let largura = 30;

    for (let frame of frames) {
      largura = max(largura, this.calcularLarguraFrame(frame));
    }

    return largura;
  }

  atualizarLarguraHitbox() {
    let novaLargura = this.calcularLarguraHitbox();
    if (novaLargura === this.w) return;

    let centroX = this.x + this.w / 2;
    this.w = novaLargura;
    this.x = constrain(centroX - this.w / 2, 0, width - this.w);
  }

  colide(obj) {
    return (this.x < obj.x + obj.w &&
            this.x + this.w > obj.x &&
            this.y < obj.y + obj.h &&
            this.y + this.h > obj.y);
  }
}

// ==========================================
// TELAS E CONTROLES
// ==========================================
function telaMenu() {
  background(0);
  imageMode(CENTER);
  if(imgMenu) image(imgMenu, width/2, height/2 - 50, 500, 300);
  imageMode(CORNER);

  fill(255);
  if(fontePixel) textFont(fontePixel);
  textAlign(CENTER);
  textSize(24);
  
  // Textos das opções
  text("Começar", width/2, height/2 + 150);
  text("Sobre", width/2, height/2 + 200);

  // Setinha indicando a opção
  let setaY = (opcaoMenu === 0) ? height/2 + 143 : height/2 + 193;
  // Animação leve na setinha para dar vida ao menu
  let offsetX = sin(frameCount * 0.1) * 5; 
  text(">", width/2 - 90 + offsetX, setaY);
}

function telaSobre() {
  background(20, 20, 40);
  fill(255);
  if(fontePixel) textFont(fontePixel);
  textAlign(CENTER, CENTER);
  
  textSize(24);
  let msg = "Esse jogo foi feito inspirado em\nFireBoy & WaterGirl com o tema\nGravity Falls.\n\nFeito por Bruno e Julia.";
  text(msg, width/2, height/2 - 50);

  // Piscar "Aperte espaço para voltar"
  textSize(16);
  if (frameCount % 60 < 30) {
    fill(200, 200, 200);
    text("Aperte ESPACO para voltar", width/2, height - 100);
  }
}

function telaGameOver() {
  background(0);
  imageMode(CENTER);
  if(imgGameOver) image(imgGameOver, width / 2, height / 2, 600, 400);
  imageMode(CORNER);

  fill(255);
  textAlign(CENTER);
  textSize(20);
  text("Aperte R para tentar novamente", width/2, height - 50);

  desenharPlacar();
}

function telaVitoriaFinal() {
  background(0);
  imageMode(CENTER);
  // Movido levemente para cima para abrir espaço para o placar final
  if(imgYouWin) image(imgYouWin, width / 2, height / 2 - 50, 600, 400);
  imageMode(CORNER);

  fill(255);
  if (fontePixel) textFont(fontePixel);
  
  // Exibição e destaque da pontuação final
  textAlign(CENTER);
  textSize(24);
  text("PONTUAÇÃO FINAL", width / 2, height - 120);

  textSize(22);
  let ptsMabel = pontosTotaisP1;
  let ptsDipper = pontosTotaisP2;

  // Posições base para facilitar o alinhamento
  let posMabel = width / 2 - 140;
  let posDipper = width / 2 + 140;

  // Lógica para destacar o maior pontuador em dourado com a estrela
  if (ptsMabel > ptsDipper) {
    // Vitória da Mabel
    fill(255, 215, 0); // Dourado
    textFont('sans-serif'); // Muda para fonte do sistema que suporta emojis
    text("⭐", posMabel - 110, height - 70); 
    if (fontePixel) textFont(fontePixel); // Volta para a fonte do jogo
    text(`Mabel: ${ptsMabel} pts`, posMabel, height - 70);
    
    fill(255); // Branco
    text(`Dipper: ${ptsDipper} pts`, posDipper, height - 70);

  } else if (ptsDipper > ptsMabel) {
    // Vitória do Dipper
    fill(255); 
    text(`Mabel: ${ptsMabel} pts`, posMabel, height - 70);
    
    fill(255, 215, 0); // Dourado
    textFont('sans-serif'); // Muda para fonte do sistema que suporta emojis
    text("⭐", posDipper - 110, height - 70);
    if (fontePixel) textFont(fontePixel); // Volta para a fonte do jogo
    text(`Dipper: ${ptsDipper} pts`, posDipper, height - 70);

  } else {
    // Empate
    fill(255, 215, 0); // Dourado para os dois
    textFont('sans-serif'); 
    text("⭐", posMabel - 110, height - 70);
    text("⭐", posDipper - 110, height - 70);
    
    if (fontePixel) textFont(fontePixel);
    text(`Mabel: ${ptsMabel} pts`, posMabel, height - 70);
    text(`Dipper: ${ptsDipper} pts`, posDipper, height - 70);
  }
}

function keyPressed() {
  // Lógica da Tela de Menu (Cena 0)
  if (cena === 0) {
    if (keyCode === UP_ARROW || key === 'w' || key === 'W') {
      opcaoMenu = 0;
    } else if (keyCode === DOWN_ARROW || key === 's' || key === 'S') {
      opcaoMenu = 1;
    } else if (key === ' ') {
      if (opcaoMenu === 0) {
        userStartAudio();
        cena = 1; // Inicia o jogo
        if (musicaFundo && !musicaFundo.isPlaying()) {
          musicaFundo.setLoop(true);
          musicaFundo.setVolume(0.5);
          musicaFundo.play();
        }
      } else if (opcaoMenu === 1) {
        cena = 4; // Vai para a tela Sobre
      }
    }
  } 
  
  // Lógica da Tela de Sobre (Cena 4)
  else if (cena === 4 && key === ' ') {
    cena = 0; // Retorna para o Menu
  }

  // Lógica de Game Over (Cena 2)
  else if (cena === 2 && (key === 'r' || key === 'R')) {
    carregarNivel(nivelAtual); 
    cena = 1; 
  }
}
