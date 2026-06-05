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

// imagens originais mantidas
let imgDipper, imgMabel;
let imgMenu, imgGameOver, imgYouWin;
let imgPlataforma;

// música e fonte
let musicaFundo;
let fontePixel;

function preload() {
  try {
    musicaFundo = loadSound('musica.mp3');
    fontePixel = loadFont('pixel.ttf');
    imgDipper = loadImage('dipper.png');
    imgMabel = loadImage('mabel.png');
    imgMenu = loadImage('menu.png');
    imgGameOver = loadImage('gameover.png');
    imgYouWin = loadImage('youwin.png');
    imgPlataforma = loadImage('plataforma.png');
  } catch (e) {
    console.log("Arquivos de mídia não encontrados. Usando fallbacks.");
  }
}

function setup() {
  createCanvas(800, 600);
  carregarNivel(nivelAtual);
}

function draw() {
  background(20, 20, 40);

  if (cena === 0) telaMenu();
  else if (cena === 1) executarJogo();
  else if (cena === 2) telaGameOver();
  else if (cena === 3) telaVitoriaFinal();
  else if (cena === 4) telaSobre();
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
    plataformas.push({x: 0, y: 450, w: 200, h: 20}, {x: 250, y: 400, w: 550, h: 20}); 
    plataformas.push({x: 0, y: 300, w: 600, h: 20}); 
    plataformas.push({x: 650, y: 230, w: 150, h: 20}); 
    
    perigos.push({x: 300, y: 580, w: 100, h: 20}); 
    perigos.push({x: 400, y: 380, w: 20, h: 20}); 
    perigos.push({x: 150, y: 530, w: 20, h: 20});

    portaP1 = {x: 680, y: 160, w: 40, h: 70};
    portaP2 = {x: 740, y: 160, w: 40, h: 70};

    let posItens = [[100,500],[500,500],[700,500], [150,400],[300,350],[600,350], [100,250],[400,250],[550,250], [50,150]];
    for (let p of posItens) itens.push({x: p[0], y: p[1], w: 15, h: 15, coletado: false});
  } 
  
  else if (n === 2) {
    spawnP1 = {x: 50, y: 500};
    spawnP2 = {x: 700, y: 500};

    plataformas.push({x: 0, y: 550, w: 300, h: 50}, {x: 500, y: 550, w: 300, h: 50});
    plataformas.push({x: 350, y: 480, w: 100, h: 20}); 
    
    plataformas.push({x: 100, y: 420, w: 200, h: 20}, {x: 500, y: 420, w: 200, h: 20}); 
    
    plataformas.push({x: 350, y: 310, w: 100, h: 50}); 
    
    plataformas.push({x: 150, y: 230, w: 200, h: 20}); 
    plataformas.push({x: 450, y: 230, w: 200, h: 20}); 

    perigos.push({x: 300, y: 580, w: 200, h: 20}); 
    perigos.push({x: 390, y: 290, w: 20, h: 20});

    portaP1 = {x: 150, y: 350, w: 40, h: 70};
    portaP2 = {x: 600, y: 350, w: 40, h: 70};

    let posItens = [[150,500],[650,500],[400,430], [50,300],[750,300], [300,200],[480,200], [200,100],[400,100],[600,100]];
    for (let p of posItens) itens.push({x: p[0], y: p[1], w: 15, h: 15, coletado: false});
  }

  else if (n === 3) {
    spawnP1 = {x: 50, y: 50};
    spawnP2 = {x: 700, y: 50};

    plataformas.push({x: 0, y: 120, w: 200, h: 20}, {x: 600, y: 120, w: 200, h: 20});
    plataformas.push({x: 150, y: 250, w: 500, h: 20});
    plataformas.push({x: 0, y: 400, w: 300, h: 20}, {x: 450, y: 400, w: 350, h: 20});
    plataformas.push({x: 0, y: 550, w: 800, h: 50});

    perigos.push({x: 200, y: 230, w: 100, h: 20});
    perigos.push({x: 100, y: 530, w: 100, h: 20}, {x: 350, y: 530, w: 100, h: 20});
    perigos.push({x: 500, y: 230, w: 40, h: 20}); 

    portaP1 = {x: 650, y: 480, w: 40, h: 70};
    portaP2 = {x: 720, y: 480, w: 40, h: 70};

    let posItens = [[100,80],[700,80], [250,200],[400,200],[600,200], [50,350],[200,350],[550,350], [300,500],[500,500]];
    for (let p of posItens) itens.push({x: p[0], y: p[1], w: 15, h: 15, coletado: false});
  }

  else if (n === 4) {
    spawnP1 = {x: 50, y: 500};
    spawnP2 = {x: 120, y: 500};

    plataformas.push({x: 0, y: 550, w: 800, h: 50});
    plataformas.push({x: 100, y: 450, w: 600, h: 20});
    plataformas.push({x: 0, y: 350, w: 700, h: 20});   
    plataformas.push({x: 100, y: 250, w: 700, h: 20}); 

    perigos.push({x: 250, y: 530, w: 300, h: 20});
    perigos.push({x: 400, y: 430, w: 20, h: 20}); 
    perigos.push({x: 550, y: 230, w: 40, h: 20});
    
    portaP1 = {x: 150, y: 180, w: 40, h: 70};
    portaP2 = {x: 220, y: 180, w: 40, h: 70};

    let posItens = [
      [50, 520], [700, 520], 
      [150, 420], [350, 420], [650, 420], 
      [250, 320], [450, 320], 
      [200, 220], [400, 220], [650, 220]  
    ];
    for (let p of posItens) itens.push({x: p[0], y: p[1], w: 15, h: 15, coletado: false});
  }

  else {
    spawnP1 = {x: 50, y: 300};
    spawnP2 = {x: 720, y: 100};

    plataformas.push({x: 0, y: 550, w: 800, h: 50});
    plataformas.push({x: 0, y: 350, w: 150, h: 20}, {x: 250, y: 350, w: 300, h: 20}, {x: 650, y: 350, w: 150, h: 20});
    plataformas.push({x: 150, y: 200, w: 500, h: 20});
    plataformas.push({x: 650, y: 150, w: 150, h: 20});

    perigos.push({x: 200, y: 530, w: 150, h: 20}, {x: 450, y: 530, w: 150, h: 20});
    perigos.push({x: 350, y: 330, w: 40, h: 20}); // NOVO PERIGO

    inimigos.push(new Inimigo(350, 170, 200, 2)); 

    portaP1 = {x: 150, y: 480, w: 40, h: 70};
    portaP2 = {x: 650, y: 280, w: 40, h: 70};

    let posItens = [[50,500],[400,500],[700,500], [100,300],[350,300],[500,300], [200,150],[400,150],[600,150], [700,50]];
    for (let p of posItens) itens.push({x: p[0], y: p[1], w: 15, h: 15, coletado: false});
  }

  p1 = new Jogador(spawnP1.x, spawnP1.y, 87, 65, 68, color(255, 100, 150), imgMabel, 1); 
  p2 = new Jogador(spawnP2.x, spawnP2.y, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, color(100, 200, 255), imgDipper, 2);
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

  fill(0, 255, 0); 
  for (let p of perigos) rect(p.x, p.y, p.w, p.h);

  fill(255, 100, 150, 150); 
  rect(portaP1.x, portaP1.y, portaP1.w, portaP1.h);
  fill(100, 200, 255, 150); 
  rect(portaP2.x, portaP2.y, portaP2.w, portaP2.h);

  fill(255, 215, 0);
  let floatOffset = sin(frameCount * 0.1) * 5;
  for (let i = 0; i < itens.length; i++) {
    let item = itens[i];
    if (!item.coletado) {
      ellipse(item.x + item.w/2, item.y + item.h/2 + floatOffset, item.w, item.h);
      if (p1.colide(item)) { item.coletado = true; pontosNivelP1 += 100; }
      if (p2.colide(item)) { item.coletado = true; pontosNivelP2 += 100; }
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
  if (imgPlataforma) {
    for (let x = 0; x < p.w; x += 32) {
      for (let y = 0; y < p.h; y += 32) {
        let drawW = min(32, p.w - x);
        let drawH = min(32, p.h - y);
        image(imgPlataforma, p.x + x, p.y + y, drawW, drawH);
      }
    }
  } else {
    rect(p.x, p.y, p.w, p.h);
  }
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
  constructor(x, y, up, left, right, cor, sprite, id) {
    this.x = x; this.y = y;
    this.w = 30; this.h = 40;
    this.vy = 0;
    this.gravidade = 0.7;
    this.pulo = -13;
    this.noChao = false;
    this.cor = cor;
    this.sprite = sprite;
    this.controles = { up, left, right };
    this.id = id;
    this.chegouNoDestino = false; 
  }

  atualizar(plats, pers, pmovs) {
    if (this.chegouNoDestino) return; 

    // === MOVIMENTO HORIZONTAL ===
    let oldX = this.x;
    if (keyIsDown(this.controles.left)) this.x -= 6;
    if (keyIsDown(this.controles.right)) this.x += 6;

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
    if (this.sprite) {
      image(this.sprite, this.x, this.y, this.w, this.h);
    } else {
      fill(this.cor);
      rect(this.x, this.y, this.w, this.h);
    }
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