
//Variaveis do jogo

var canvas, ctx, img,                           // Variaveis usadas para desenhar os itens

altura = 0,                                     // Variaveis usadas para pegar o tamanho da janela do navegador
largura = 0,

frames = 0,                                     // VARIAVEL USADA NO CONTROLE DA ANIMAÇÃO DO JOGO
maxPulos = 3,                                   // QUANTIDADE MAXIMA DE PULOS
velocidade = 10,                                // VARIAVEL PARA A VELOCIDADE DOS OBSTACULOS
estadoAtual,                                    // Variavel que gerencia o estado atual do jogo
record,                                         // Variavel que armazena os recordes

estados = {                                     // Variavel recebe um array que contem os possiveis estados do jogo
    jogar: 0,                                   // Jogo prestes a iniciar
    jogando: 1,                                 // Jogo em execução
    perdeu: 2                                   // O jogo acabou
}

pontosParaNovaFase = [5, 10, 15, 20],           // Array que vai carregar as pontuacoes para mudar de fase
faseAtual = 0;                                  // Variavel que indica a fase atual baseado no array pontosParaNovaFase

labelNovaFase = {                               // Objeto para estilizar a nova fase
    texto: "",                                  // Texo a ser exibino na mudanca de fase
    opacidade: 0.0,                             // gerencia a opacidade do elemento

    fadeIn: function(dt){                       // Mostra o texto
        var fadeInId = setInterval(function(){

            if(labelNovaFase.opacidade < 1.0)
                labelNovaFase.opacidade += 0.01;

            else
                clearInterval(fadeInId);

        }, 10 * dt);

    },

    fadeOut: function(dt){                      // O texto some da tela
        var fadeOutId = setInterval(function(){

            if(labelNovaFase.opacidade > 0.0)
                labelNovaFase.opacidade -= 0.01;

            else
                clearInterval(fadeOutId);

        }, 10 * dt);

    }

}

chao = {                                        // DECLARANDO AS PROPRIEDADES DO CHAO
    y: 550,                                     // COORDENADA (y) ONDE O CHAO COMEÇA
    x: 0,                                       // Coordenada (x) (necessario para o chao 'andar' no eixo X)
    altura: 50,                                 // DEFININDO A ALTURA DO chao
    
    atualiza: function(){                       // Metodo para atualizar a posicao do chao (ilusao de movimento)
        this.x -= velocidade;                   // Decrementa o X de acordo com a velocidade
        
        if(this.x <= -600)                      // Se o chao sair todo da canvas ele é resetado na pos x = 0
            this.x = 0;

        
    },

    desenha: function(){                        // FUNCAO PARA DESENHAR O CHAO
        spriteChao.desenha(this.x, this.y);     // Desenha o chao na posicao x,y
        spriteChao.desenha(this.x + spriteChao.largura, this.y);    // Desenha o chao novamente
    },

},


bloco = {                                       // DECLARANDO AS PROPRIEDADES DO BLOCO
    x: 50,                                      // COORDENADA x INICIAL DO BLOCO (LADO ESQUERDO)
    y: 0,                                       // COORDENADA y INICIAL DO BLOCO (LADO DE CIMA)
    altura: spriteBoneco.altura,                // ALTURA DO BLOCO
    largura: spriteBoneco.largura,              // LARGURA DO BLOCO
    gravidade: 1.6,                             // ATRIBUTO QUE REPRESENTA O VALOR DA GRAVIDADE
    velocidade: 0,                              // VELOCIDADE DE QUEDA DO BLOCO
    forcaDoPulo: 23.6,                          // FORÇA DO PULO DO BLOCO
    qntPulos: 0,                                // QUANTIDADE DE PULOS QUE O BLOCO FEZ
    score: 0,                                   // Variavel para contagem do placar do jogador
    rotacao: 0,                                 // Vsriavel que ajuda na rotacao do personagem

    vidas: 3,                                   // Variavel que armazena as vidas 
    colidindo: false,                           // Metodo para gerenciar a dinamica das colisoes

    atualiza: function(){                       // ATUALIZA A VELOCIDADE E A COORDENADA y DO BLOCO (QUEDA)
        this.velocidade += this.gravidade;      // INCREMENTANDO A VELOCIDADE DE QUEDA COM O VALOR DA GRAVIDADE
        this.y += this.velocidade;              // MUDANDO O y COM O VALOR DA VELOCIDADE DE QUEDA
        this.rotacao += Math.PI / 180 * velocidade; // o personagem sera rotacionado em um grau porporcionalmente a velocidade
                                
        /* MANTENDO O BLOCO NO CHAO */
        if(this.y > chao.y - this.altura        // Condicional caso o bloco chegue ao chao
        && estadoAtual!=estados.perdeu){        // ... e caso o usuario nao tenha perdido o jogo
            this.y = chao.y - this.altura;      // FORÇANDO O BLOCO A 'FICAR' EM CIMA DO CHAO
            this.qntPulos = 0;                  // RESETANDO A COTA MAXIMA DE PULOS DO BLOCO
            this.velocidade = 0;                // Reseta a velocidade do bloco apos tocar o chao
        }

    },

    pula: function(){                           // METODO PARA FAZER O BLOCO PULAR

        if(this.qntPulos < maxPulos){           // VERIFICANDO SE O BLOCO JA ATINGIU A COTA MAXIMA DE PULOS
            this.velocidade = -this.forcaDoPulo;// MUDANDO A VELOCIDADE DO BLOCO (RELATIVO A FORÇA DO PULO)
            this.qntPulos++;                    // AUMENTANDO A QUANTIDADE CADA VEZ QUE O BLOCO PULA
        }

    },
    

    reset: function(){                          // Metodo para resetar os atributos (y, velocidade, score) do bloco
        this.y = 0;                             // O bloco é colocado em cima
        this.velocidade = 0;                    // reseta a velocidade do bloco apos o clique inicial

        if(this.score > record){                // Caso o usuario tenha batido o record
            localStorage.setItem("record", this.score); // Guardando no LocalStorage o novo recorde
            record = this.score;                // variavel 'record' recebe a nova pontuação
        }

        this.score = 0;                         // Reseta o placar
        this.vidas = 3;                         // Reseta a quantidade de vidas
        velocidade = 10;                         // Reseta a velocidade do bloco
        faseAtual = 0;                          // Reseta as fases do jogo
        this.gravidade = 1.6;                   // Reseta a gravidade
    },


    desenha: function(){                        // METODO PARA DESENHAR O BLOCO
        ctx.save();                             // Salva o contexto
        ctx.translate(this.x + this.largura / 2, this.y + this.altura / 2); // Desloca o contexto para a posicao indicada
        ctx.rotate(this.rotacao);               // Rotaciona o contexto
        spriteBoneco.desenha(-this.largura / 2, -this.altura / 2);  // Desenha o boneco
        ctx.restore();                          // Restaura o contexto a posicao original
    }

},


obstaculos = {                                  // DECLARANDO AS PROPRIEDADES DOS OBSTACULOS
    _obs: [],                                   // ARRAY DE OBSTACULOS
    _scored: false,                             // Flag que indica se o jogador pontuou em cima dele
    sprites: [                                  // ARRAY QUE POSSUI AS CORES A  SEREM UTILIZADAS NOS OBSTACULOS
        redObstacle,
        pinkObstacle,
        blueObstacle,
        greenObstacle,
        yellowObstacle
    ], 
    
    tempoInsere:0,                              // Variavel que ajuda no tempo inserção dos obstaculos


    insere: function(){                         // METODO PARA INSERIR UM ELEMENTO NO ARRAY DE OBSTACULOS

        this._obs.push({                        // INSERINDO O OBSTACULO NO ARRAY
            x: largura,                         // POSICAO X INICIAL
            largura: 50,                        // LARGURA DO OBSTACULO
            altura: 30 + Math.floor(120 * Math.random()),   // ALTURA DO OBSTACULO
            sprite: this.sprites[Math.floor(this.sprite.length * Math.random())]  // COR DO OBSTACULO
        });

        this.tempoInsere = 30 + Math.floor(20 * Math.random()); // Inicializando o temporizador dos obstaculos
    },


    atualiza: function(){                       // METODO PARA ATUALIZAR O ARRAY DE OBSTACULOS

        if(this.tempoInsere == 0)               // Se o temporizador chegar a zero
            this.insere();                      // Inserindo um bloco
                                    
        else                                    // Se O temporizador ainda não é zero
            this.tempoInsere--;                 // Decrementando o temporizador

        for(var i = 0, tam = this._obs.length; i < tam; i++){   // Rodando o array de obstaculos
            var obs = this._obs[i];             // SELECIONANDO O ELEMENTO(OBSTACULO) ATUAL
            obs.x -= velocidade;                // DECREMENTANDO O VALOR DE X EM RELAÇÃO A VELOCIDADE DO OBSTACULO

            if(!bloco.colidindo                 // Se nao houver colisao  
            && bloco.x < obs.x + obs.largura    // e houver colisao do bloco com um obstaculo?
            && bloco.x + bloco.largura >= obs.x
            && bloco.y + bloco.altura >= chao.y - obs.largura){
                bloco.colidindo = true;         // Flag de colisao é ativada

                setTimeout(function(){          // Flag de colisao volta para false 500 ms depois
                    bloco.colidindo = false;
                }, 500);

                if(bloco.vidas>=1)              // O jogador tem pelo menos uma vida?
                    bloco.vidas--;              // 1 vida é subtraida

                else                            // O jogador nao tem vida nenhuma
                    estadoAtual = estados.perdeu;   // O usuario perde o jogo
            }
            
            // Varificando se o bloco pulou o obstaculo
            else if(obs.x <= 0                  // Se o obstaculo estiver saindo da tela
            && !obs._scored){                   // ... e o jogador não pontuou em cima do obstaculo
                bloco.score++;                  // O usuario marcou um ponto
                obs._scored = true;             // O obstaculo foi superado

                if(faseAtual < pontosParaNovaFase.length    // Verificia se foi atingido a pontuacao para passar de fase
                && bloco.score == pontosParaNovaFase[faseAtual])
                    passarDeFase();
            }
                                        
            else if(obs.x <= -obs.largura){     /** O obstaculo saiu da area de visao na tela? **/
                this._obs.splice(i,1);          // Removendo o obstaculo do array
                i--;                            // Atualizando o indice atual após a esclusão
                tam--;                          // Atualizando o tamanho do array após a esclusão
            }
        }
    },

    
    limpa: function(){                          // Metodo para limpar o array de obstaculos apos o usuario perder uma partida
        this._obs = [];                         // Limpando o array de obstaculos
    },

    desenha: function(){                        // METODO PARA DESENHAR O OBSTACULO NA TELA

        for(var i = 0, tam = this._obs.length; i < tam; i++){   // PERCORRENDO O ARRAY PARA DESENHAR OS BLOCOS QUE ESTAO NO MESMO
            var obs = this._obs[i];
            ctx.fillStyle = obs.cor;            // MUDANDO A COR DO CONTEXTO DO BLOCO
            ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura);  // DESENHANDO O BLOCO
        }

    }

};


function clique(evt){                           // FUNCAO QUE IDENTIFICA SE HOUVE CLIQUE

    if(estadoAtual == estados.jogando)          // O jogo esteja sendo executado?
        bloco.pula();                           // O bloco pula

    else if(estadoAtual == estados.jogar)       // O jogo esta pronto para ser executado?
        estadoAtual = estados.jogando;          // Agora o jogo esta sendo executado

    else if(estadoAtual == estados.perdeu       // O usuario perdeu o jogo ??
    && bloco.y >= 2*altura){                    // Travando o usuario para jogar novamente
        obstaculos.limpa();                     // Limpa o array de obstaculos
        bloco.reset();                          // Resetando os atributo do bloco
        estadoAtual = estados.jogar;            // Agora o jogo esta pronto para ser iniciado
    }
}



function atualiza(){                            // FUNCAO PARA ATUALIZAR O STATUS DO PERSONAGEM E DOS BLOCOS

    if(estadoAtual == estados.jogando)          // O jogo está executando?
        obstaculos.atualiza();                  // ATUALIZANDO O ESTADO DOS OBSTACULOS (VELOCIDADE)
    
    chao.atualiza();                            // Atualiza o chao a cada frame;
    bloco.atualiza();                           // ATUALIZANDO A VELOCIDADE E COORDENADA y DO BLOCO (QUEDA ou CLIQUE)
    
}



function desenha(){                             // FUNCAO USADA PARA DESENHAR (PERSONAGEM, BLOCOS, CHAO, ETC...) DEPOIS DE ATUALIZAR
    bg.desenha(0,0);                            // Desenha o fundo do jogo

    // Desenhando o score
    ctx.fillStyle = "#000";                     // Cor do placar
    ctx.font = "50px Oxanium";                  // Fonte do placar
    ctx.fillText(bloco.score, 30, 68);          // Desenha o placar na tela
    ctx.fillStyle = "#000";                     // Cor do contador de vidas                     
    ctx.fillText(bloco.vidas, 540, 68);         // Exibe a quantidade de vidas
    ctx.fillStyle=" rgba(0, 0, 0, " + labelNovaFase.opacidade + ")";

    ctx.fillText(
        labelNovaFase.texto,
        canvas.width / 2 - ctx.measureText(labelNovaFase.texto).width / 2,
        canvas.height / 3
    );
    
    if(estadoAtual == estados.jogando)          // O jogo está em execução?
        obstaculos.desenha();                   // DESENHA OS OBSTACULOS

    chao.desenha();                             // DESENHA O CHAO
    bloco.desenha();                            // DESENHA O BLOCO
    
    if(estadoAtual == estados.jogar)            // O jogo esta pronto para ser executado?
        jogar.desenha(                          // Desenha a tela de inicio do jogo
            largura / 2 - jogar.largura / 2,
            altura / 2 - jogar.altura / 2
        );

    if(estadoAtual == estados.perdeu){          // O jogo acabou?
        perdeu.desenha(                         // Desenha a tela de encerramento (perdeu)
            largura / 2 - perdeu.largura / 2,
            altura / 2 - perdeu.altura / 2 - spriteRecord.altura/2
        );

        spriteRecord.desenha(                   // Desenha o record obtido
            largura / 2 - spriteRecord.largura / 2,
            altura / 2 + perdeu.altura / 2 - spriteRecord.altura / 2 - 62
        );

        ctx.fillStyle = "#fff";
        ctx.font = "70px Oxanium";
        

        if(bloco.score > record){               // O usuario bateu o recorde?
            novo.desenha(largura / 2 - 200, altura / 2-15); // Desenha a palavra NOVO se o usuario bater o recorde
            ctx.fillText(bloco.score, 385, 440);    // Mostra a pontuacao do jogador
        }

        else{                                   // O usuario não bateu o recorde?
            ctx.fillText(record, 385, 440);     // Mostra o recorde atual
            ctx.fillText(bloco.score, 385, 360);// Mostra a pontuacao
        }
    }
    

    
}

function roda(){                                // FUNCAO PARA RODAR O JOGO. ONDE VAI FICAR O LOOP, DESENHADO NA CANVAS
    atualiza();                                 // ATUALIZANDO O STATUS DO PERSONAGEM E BLOCOS
    desenha();                                  // DESENHANDO PERSONAGEM, BLOCOS, CHAO, ETC...
    window.requestAnimationFrame(roda);         // CHAMANDO A FUNÇÃO RODA DIRETO (LOOP)
}

function passarDeFase(){                        // Metodo que faz o jogo mudar de fase
    velocidade++;                               // Aumenta a velocidade
    faseAtual++;                                // Aumenta a fase atual
    bloco.vidas++;                              // Aumenta a quantidade de vidas do bloco

    if(faseAtual == 4)
        bloco.gravidade *= 0.6;

    labelNovaFase.texto = "Level " + faseAtual;
    labelNovaFase.fadeIn(0.4);

    setTimeout(function(){
        labelNovaFase.fadeOut(0.4)
    }, 800);
    
}

function main(){                                // FUNÇÃO PRINCIPAL DO JOGO
    altura = window.innerHeight;                // RECEBENDO A ALTURA DA JANELA DO USUARIO
    largura = window.innerWidth;                // RECEBENDO A LARGURA DA JANELA DO USUARIO

    if(largura>=500){                           // VERIFICANDO O TAMANHO DA JANELA DO USUARIO
        largura = 600;                          // FORÇANDO O TAMANHO DA JANELA PARA UM TAMANHO FIXO
        altura = 600;
    }

    canvas = document.createElement("canvas");  // CRIANDO UM ELEMENTO DO TIPO CANVAS
    canvas.width = largura;                     // ATRIBUINDO A CANVAS A LARGURA CONFIGURADA ANTERIORMENTE
    canvas.height = altura;                     // ATRIBUINDO A CANVAS A ALTURA CONFIGURADA ANTERIORMENTE
    canvas.style.border = "1px solid #000";     // CRIANDO UMA BORDA PRETA PARA A CANVAS
    ctx = canvas.getContext("2d");              // TUDO O QUE FOR DESENHADO SERÁ 2D
    document.body.appendChild(canvas);          // ADICIONANDO A VARIAVEL CANVAS NO CORPO DO HTML
    document.addEventListener("mousedown", clique); // CONFIGURANDO O EVENTO "clique"
    estadoAtual = estados.jogar;                // O jogo esta pronto para ser iniciado (tela de inicio)
    record = localStorage.getItem("record");    // Acessando LOCALSTORAGE localStorage procurando pelo item RECORD e o atribui a variavel

    if(record == null)                          // Houve algum registro de recorde anterior?
        record = 0;                             // Resetando o recorde

    img = new Image();                      // Instanciando uma nova imagem
    img.src = "imagens/sheet.png";              // Setando um caminho(src) para a imagem
    roda();                                     // RODANDO O JOGO
}

// INICIALIZA O JOGO
main();