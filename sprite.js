
function Sprite(x, y, largura, altura){			// CLASSE PARA GERENCIAR AS SPRITES
	this.x = x;									// Coordenada inicial X
	this.y = y;									// Coordenada inicial Y
	this.largura = largura;						// Largura da imagem
	this.altura = altura;						// Altura da imagem

	
	this.desenha =  function(xCanvas, yCanvas){	// METODO PARA DESENHAR NA AREA INDICADA NO CANVAS

		ctx.drawImage(							// DESENHA A IMAGEM NA TELA
			img,								// Imagem a ser desenhada
			this.x, this.y,						// Coordenadas iniciais da imagem
			this.largura, this.altura,			// largura e altura da imagem
			xCanvas, yCanvas,					// Coordenadas na canvas
			this.largura, this.altura			// Escala da imagem
		);			
	}
}

var bg = new Sprite(0, 0, 600, 600),			// Instanciando a sprite para o fundo do jogo
spriteBoneco = new Sprite(610, 0, 87, 87),		// Instanciando a sprite para o boneco

spriteChao = new Sprite(0, 610, 600, 54),		// Instancia a sprite para o chao
novo = new Sprite(0, 670, 287, 93),				// Instancia a sprite quando exibe um novo recorde
spriteRecord = new Sprite(0, 770, 441, 95),		// Instancia a sprite para o recorde do jogador
perdeu = new Sprite(610, 490, 397, 358),		// Instancia a sprite para a tela quando o usuario perde
jogar = new Sprite(610, 100, 397, 347),			// Instancia a sprite para a tela de inicio de jogo


redObstacle = new Sprite(500, 825, 50, 125),	// instancia a sprite para o obstaculo vermelho
pinkObstacle = new Sprite(600, 825, 50, 125),	// instancia a sprite para o obstaculo rosa
blueObstacle = new Sprite(700, 825, 50, 125),	// instancia a sprite para o obstaculo azul
greenObstacle = new Sprite(800, 825, 50, 125),	// instancia a sprite para o obstaculo verde
yellowObstacle = new Sprite(900, 825, 50, 125);	// instancia a sprite para o obstaculo amarelo