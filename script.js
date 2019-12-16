
//VARIAVEIS DO JOGO

// VARIAVEIS USADAS PARA DESENHAR OS ITENS
var canvas, ctx,

// VARIAVEIS USADAS PARA PEGAR O TAMANHO DA JANELA DO NAVEGADOR
altura = 0,
largura = 0,

// VARIAVEL USADA NO CONTROLE DA ANIMAÇÃO DO JOGO
frames = 0,

// QUANTIDADE MAXIMA DE PULOS
maxPulos = 3,

// DECLARANDO AS PROPRIEDADES DO CHAO
chao =  {
            // COORDENADA (y) ONDE O CHAO COMEÇA
            y: 550,
            // DEFININDO A ALTURA DO chao
            altura: 50,
            // DEFININDO A COR DO CHAO
            cor: "#ffdf70",
            // FUNCAO PARA DESENHAR O CHAO
            desenha:    function(){
                            // MUDANDO A COR DO CONTEXTO NO CHAO
                            ctx.fillStyle = this.cor;
                            // DESENHANDO O RETANGULO QUE REPRESENTA O CHAO
                            ctx.fillRect(0, this.y, largura, this.altura);    
                        },
        },


// DECLARANDO AS PROPRIEDADES DO BLOCO        
bloco = {
    // COORDENADA x INICIAL DO BLOCO (LADO ESQUERDO)
    x: 50,
    // COORDENADA y INICIAL DO BLOCO (LADO DE CIMA)
    y: 0,
    // ALTURA DO BLOCO
    altura: 50,
    // LARGURA DO BLOCO
    largura: 50,
    // COR DO BLOCO
    cor: "#ff4e4e",
    // ATRIBUTO QUE REPRESENTA O VALOR DA GRAVIDADE
    gravidade: 0.1,
    // VELOCIDADE DE QUEDA DO BLOCO
    velocidade: 0,
    // FORÇA DO PULO DO BLOCO
    forcaDoPulo: 3,
    // QUANTIDADE DE PULOS QUE O BLOCO FEZ
    qntPulos: 0,

    // ATUALIZA A VELOCIDADE E A COORDENADA y DO BLOCO (QUEDA)
    atualiza:   function(){
                    // INCREMENTANDO A VELOCIDADE DE QUEDA COM O VALOR DA GRAVIDADE
                    this.velocidade += this.gravidade;
                    // MUDANDO O y COM O VALOR DA VELOCIDADE DE QUEDA
                    this.y += this.velocidade;

                    // VERIFICANDO SE O BLOCO CHEGOU AO CHAO
                    if(this.y > chao.y - this.altura){
                        // FORÇANDO O BLOCO A 'FICAR' EM CIMA DO CHAO
                        this.y = chao.y - this.altura;
                        // RESETANDO A COTA MAXIMA DE PULOS DO BLOCO
                        this.qntPulos = 0
                    }
                },

    // METODO PARA FAZER O BLOCO PULAR
    pula:   function(){
                // VERIFICANDO SE O BLOCO JA ATINGIU A COTA MAXIMA DE PULOS
                if(this.qntPulos < maxPulos){
                    // MUDANDO A VELOCIDADE DO BLOCO (RELATIVO A FORÇA DO PULO)
                    this.velocidade = -this.forcaDoPulo;
                    // AUMENTANDO A QUANTIDADE CADA VEZ QUE O BLOCO PULA
                    this.qntPulos++;
                }
            },

    // METODO PARA DESENHAR O BLOCO
    desenha:    function(){
                    // MUDANDO A COR DO CONTEXTO DO BLOCO
                    ctx.fillStyle = this.cor;
                    // DESENHANDO O RETANGULO QUE REPRESENTA O BLOCO
                    ctx.fillRect(this.x, this.y, this.largura, this.altura);
                }


}


// FUNCAO QUE IDENTIFICA SE HOUVE CLIQUE
function clique(evt){
    // BLOCO ESTA PULANDO
    bloco.pula();
}



// FUNCAO PARA ATUALIZAR O STATUS DO PERSONAGEM E DOS BLOCOS
function atualiza(){
    // INCREMENTANDO O FRAMES DO JOGO
    //frames++;

    // ATUALIZANDO A VELOCIDADE E COORDENADA y DO BLOCO (QUEDA)
    bloco.atualiza();
}



// FUNCAO USADA PARA DESENHAR (PERSONAGEM, BLOCOS, CHAO, ETC...) DEPOIS DE ATUALIZAR
function desenha(){
    // PINTANDO O FUNDO DA CANVAS DE AZUL
    ctx.fillStyle = "#50beff";

    // TAMANHO DA AREA DE PINTURA
    ctx.fillRect(0, 0, largura, altura);

    // DESENHANDO O CHAO
    chao.desenha();

    // DESENHANDO O BLOCO
    bloco.desenha();
}


// FUNCAO PARA RODAR O JOGO. ONDE VAI FICAR O LOOP, DESENHADO NA CANVAS
function roda(){
    // ATUALIZANDO O STATUS DO PERSONAGEM E BLOCOS
    atualiza();

    // DESENHANDO PERSONAGEM, BLOCOS, CHAO, ETC...
    desenha();

    // CHAMANDO A FUNÇÃO RODA DIRETO (LOOP)
    window.requestAnimationFrame(roda);
}




// FUNÇÃO PRINCIPAL DO JOGO
function main(){
    // RECEBENDO A ALTURA DA JANELA DO USUARIO
    altura = window.innerHeight;

    // RECEBENDO A LARGURA DA JANELA DO USUARIO
    largura = window.innerWidth;

    // VERIFICANDO O TAMANHO DA JANELA DO USUARIO
    if(largura>=500)
    {        
        // FORÇANDO O TAMANHO DA JANELA PARA UM TAMANHO FIXO
        largura = 600;
        altura = 600;
    }

    // CRIANDO UM ELEMENTO DO TIPO CANVAS
    canvas = document.createElement("canvas");

    // ATRIBUINDO A CANVAS A ALTURA E A LARGURA CONFIGURADAS ANTERIORMENTE
    canvas.width = largura;
    canvas.height = altura;

    // CRIANDO UMA BORDA PRETA PARA A CANVAS
    canvas.style.border = "1px solid #000";

    // TUDO O QUE FOR DESENHADO SERÁ 2D
    ctx = canvas.getContext("2d");

    // ADICIONANDO A VARIAVEL CANVAS NO CORPO DO HTML
    document.body.appendChild(canvas);

    // CONFIGURANDO O EVENTO "clique"
    document.addEventListener("mousedown", clique);

    // RODANDO O JOGO
    roda();
}



// INICIALIZA O JOGO
main();