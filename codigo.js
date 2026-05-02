let nivel = 1;
let pontosP1 = 0;
let pontosP2 = 0;
let vitoriasP1 = 0;
let vitoriasP2 = 0;

// Objetos dos personagens
let p1, p2;
let objetivo;

function setup() {
  createCanvas(800, 600);
  resetNivel();
}

function draw() {
  background(220);

  if (nivel <= 5) {
    telaJogo();
  } else {
    telaFinal();
  }
}

function telaJogo() {
  // Instruções visuais
  textAlign(CENTER);
  textSize(16);
  text(`Nível ${nivel} - Chegue ao objetivo!`, width / 2, 30);
  
  // Desenha objetivo
  fill(255, 204, 0);
  rect(objetivo.x, objetivo.y, 40, 40);
  fill(0);
  text(nivel === 5 ? "Tio Stan" : "Item", objetivo.x + 20, objetivo.y - 10);

  // Movimentação P1 (WASD) - Mabel
  if (keyIsDown(65)) p1.x -= 5; // A
  if (keyIsDown(68)) p1.x += 5; // D
  if (keyIsDown(87)) p1.y -= 5; // W
  if (keyIsDown(83)) p1.y += 5; // S

  // Movimentação P2 (Setas) - Dipper
  if (keyIsDown(LEFT_ARROW)) p2.x -= 5;
  if (keyIsDown(RIGHT_ARROW)) p2.x += 5;
  if (keyIsDown(UP_ARROW)) p2.y -= 5;
  if (keyIsDown(DOWN_ARROW)) p2.y += 5;

  // Desenha Personagens (Temporário enquanto não temos sprites)
  fill(255, 100, 150); // Rosa - Mabel
  ellipse(p1.x, p1.y, 30, 30);
  
  fill(100, 150, 255); // Azul - Dipper
  ellipse(p2.x, p2.y, 30, 30);

  // Verificação de Colisão com Objetivo
  checarVitoria(p1, "P1");
  checarVitoria(p2, "P2");
}

function checarVitoria(player, nome) {
  if (dist(player.x, player.y, objetivo.x + 20, objetivo.y + 20) < 25) {
    if (nome === "P1") vitoriasP1++;
    else vitoriasP2++;
    
    pontosP1 += 100;
    pontosP2 += 100;
    
    nivel++;
    if (nivel <= 5) resetNivel();
  }
}

function resetNivel() {
  // Posições iniciais
  p1 = { x: 50, y: height / 2 };
  p2 = { x: 50, y: height / 2 + 50 };
  
  // Objetivo em posição aleatória (ou fixa por nível)
  objetivo = { x: width - 100, y: random(100, height - 100) };
}

function telaFinal() {
  textAlign(CENTER);
  textSize(32);
  fill(0);
  text("FIM DE JOGO!", width / 2, height / 2 - 50);
  
  textSize(20);
  text(`Mabel (P1) Vitórias: ${vitoriasP1} | Pontos: ${pontosP1}`, width / 2, height / 2);
  text(`Dipper (P2) Vitórias: ${vitoriasP2} | Pontos: ${pontosP2}`, width / 2, height / 2 + 30);
  
  let vencedor = vitoriasP1 > vitoriasP2 ? "Mabel" : (vitoriasP2 > vitoriasP1 ? "Dipper" : "Empate");
  textSize(24);
  fill(0, 150, 0);
  text(`Vencedor: ${vencedor}!`, width / 2, height / 2 + 80);
}