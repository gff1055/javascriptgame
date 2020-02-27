
function Sprite(x, y, largura, altura){			// Classe para gerenciar as sprites
	this.x = x;
	this.y = y;
	this.largura = largura;						// Largura da imagem
	this.altura = altura;						// Altura da imagem

	
	this.desenha =  function(xCanvas, yCanvas){	// Metodo para desenhar a area selecionada

		// Desenhar uma imagem na tela
		ctx.drawImage(
			img,								// Imagem a ser desenhada
			this.x, this.y,						// Coordenadas iniciais da imagem
			this.largura, this.altura,			// Coordenadas finais da imagem
			xCanvas, yCanvas,					// Coordenadas na canvas
			this.largura, this.altura			// Escala da imagem
		);			
	}
}

var bg = new Sprite(0, 0, 600, 600),			// Instanciando a sprite para o fundo do jogo
spriteBoneco = new Sprite(610, 0, 87, 87);		// Instanciando a sprite para o boneco