
//Variaveis do jogo

var canvas, ctx,    // Variaveis usadas para desenhar os itens

// Variaveis usadas para pegar o tamanho da janela do navegador
altura = 0, 
largura = 0,

frames = 0, // VARIAVEL USADA NO CONTROLE DA ANIMAÇÃO DO JOGO
maxPulos = 3,   // QUANTIDADE MAXIMA DE PULOS
velocidade = 10,    // VARIAVEL PARA A VELOCIDADE DOS OBSTACULOS
estadoAtual,    // Variavel que gerencia o estado atual do jogo
record, // Variavel que armazena os recordes

// Variavel recebe um array que contem os possiveis estados do jogo
estados =   {
                jogar: 0,   // Jogo prestes a iniciar
                jogando: 1, // Jogo em execução
                perdeu: 2   // O jogo acabou
}


// DECLARANDO AS PROPRIEDADES DO CHAO
chao =  {
            
            y: 550, // COORDENADA (y) ONDE O CHAO COMEÇA
            altura: 50, // DEFININDO A ALTURA DO chao
            cor: "#e8da78", // DEFININDO A COR DO CHAO

            
            // FUNCAO PARA DESENHAR O CHAO
            desenha:    function(){
                            ctx.fillStyle = this.cor;   // MUDANDO A COR DO CONTEXTO NO CHAO
                            ctx.fillRect(0, this.y, largura, this.altura);  // DESENHANDO O RETANGULO QUE REPRESENTA O CHAO
            },
},


// DECLARANDO AS PROPRIEDADES DO BLOCO        
bloco =     {
                x: 50,  // COORDENADA x INICIAL DO BLOCO (LADO ESQUERDO)
                y: 0,   // COORDENADA y INICIAL DO BLOCO (LADO DE CIMA)
                altura: 50, // ALTURA DO BLOCO
                largura: 50,    // LARGURA DO BLOCO
                cor: "#ff9239", // COR DO BLOCO
                gravidade: 1.6, // ATRIBUTO QUE REPRESENTA O VALOR DA GRAVIDADE
                velocidade: 0,  // VELOCIDADE DE QUEDA DO BLOCO
                forcaDoPulo: 23.6,  // FORÇA DO PULO DO BLOCO
                qntPulos: 0,    // QUANTIDADE DE PULOS QUE O BLOCO FEZ
                score: 0,   // Variavel para contagem do placar do jogador


                // ATUALIZA A VELOCIDADE E A COORDENADA y DO BLOCO (QUEDA)
                atualiza:   function(){
                                this.velocidade += this.gravidade;  // INCREMENTANDO A VELOCIDADE DE QUEDA COM O VALOR DA GRAVIDADE
                                this.y += this.velocidade;  // MUDANDO O y COM O VALOR DA VELOCIDADE DE QUEDA
                                
                                /* MANTENDO O BLOCO NO CHAO */
                                // Condicional... 
                                if(this.y > chao.y - this.altura    // ... caso o bloco chegue ao chao
                                && estadoAtual!=estados.perdeu){ // ... e caso o usuario nao tenha perdido o jogo
                                    this.y = chao.y - this.altura;  // FORÇANDO O BLOCO A 'FICAR' EM CIMA DO CHAO
                                    this.qntPulos = 0;  // RESETANDO A COTA MAXIMA DE PULOS DO BLOCO
                                    this.velocidade = 0;    // Reseta a velocidade do bloco apos tocar o chao
                                }
                },


                // METODO PARA FAZER O BLOCO PULAR
                pula:   function(){
                            // VERIFICANDO SE O BLOCO JA ATINGIU A COTA MAXIMA DE PULOS
                            if(this.qntPulos < maxPulos){
                                this.velocidade = -this.forcaDoPulo;    // MUDANDO A VELOCIDADE DO BLOCO (RELATIVO A FORÇA DO PULO)
                                this.qntPulos++;    // AUMENTANDO A QUANTIDADE CADA VEZ QUE O BLOCO PULA
                            }
                },

                // Metodo para resetar os atributos (y, velocidade, score) do bloco
                reset: function(){
                    this.y = 0;    // O bloco é colocado em cima
                    this.velocidade = 0;   // reseta a velocidade do bloco apos o clique inicial

                    // Caso o usuario tenha batido o record
                    if(this.score > record){
                        localStorage.setItem("record", this.score); // Guardando no LocalStorage o novo recorde
                        record = this.score;    // variavel 'record' recebe a nova pontuação
                    }

                    this.score = 0; // O placar é zerado para o reinicio do jogo
                },


                // METODO PARA DESENHAR O BLOCO
                desenha:    function(){
                                ctx.fillStyle = this.cor;   // MUDANDO A COR DO CONTEXTO DO BLOCO
                                ctx.fillRect(this.x, this.y, this.largura, this.altura);    // DESENHANDO O RETANGULO QUE REPRESENTA O BLOCO
                }

},


// DECLARANDO AS PROPRIEDADES DOS OBSTACULOS
obstaculos =    {
                    _obs: [],   // ARRAY DE OBSTACULOS
                    cores: ["#ffbc1c","#ff1c1c","#ff85e1","#52a7ff","#78ff5d"], // ARRAY QUE POSSUI AS CORES A  SEREM UTILIZADAS NOS OBSTACULOS
                    tempoInsere:0,  // Variavel que ajuda no tempo inserção dos obstaculos

                    // METODO PARA INSERIR UM ELEMENTO NO ARRAY DE OBSTACULOS
                    insere: function(){
                                // INSERINDO O OBSTACULO NO ARRAY
                                this._obs.push( {
                                                    x: largura, // POSICAO X INICIAL
                                                    largura: 50,    // LARGURA DO OBSTACULO
                                                    altura: 30 + Math.floor(120 * Math.random()),   // ALTURA DO OBSTACULO
                                                    cor: this.cores[Math.floor(5 * Math.random())]  // COR DO OBSTACULO
                                });
                                
                                this.tempoInsere = 30 + Math.floor(20 * Math.random()); // Inicializando o temporizador dos obstaculos
                    },

                    // METODO PARA ATUALIZAR O ARRAY DE OBSTACULOS
                    atualiza:   function(){
                                    // Se o temporizador chegar a zero
                                    if(this.tempoInsere == 0) this.insere();  // Inserindo um bloco
                                    
                                    // O temporizador ainda não é zero
                                    else this.tempoInsere--; // Decrementando o temporizador

                                    // Rodando o array de obstaculos
                                    for(var i = 0, tam = this._obs.length; i < tam; i++){
                                        var obs = this._obs[i]; // SELECIONANDO O ELEMENTO(OBSTACULO) ATUAL
                                        obs.x -= velocidade;    // DECREMENTANDO O VALOR DE X EM RELAÇÃO A VELOCIDADE DO OBSTACULO

                                        // Houve colisao do bloco com um obstaculo?
                                        if(bloco.x < obs.x + obs.largura &&
                                            bloco.x + bloco.largura >= obs.x &&
                                            bloco.y + bloco.altura >= chao.y - obs.largura)
                                                estadoAtual = estados.perdeu;   // O usuario perde o jogo

                                        // O bloco pulou o obstaculo?
                                        else if(obs.x == 0) bloco.score++;  // O usuario marcou um ponto
                                        
                                        /** O obstaculo saiu da area de visao na tela? **/
                                        else if(obs.x <= -obs.largura){
                                            this._obs.splice(i,1);  // Removendo o obstaculo do array
                                            i--;    // Atualizando o indice atual após a esclusão
                                            tam--;  // Atualizando o tamanho do array após a esclusão
                                        }
                                    }
                    },

                    // Metodo para limpar o array de obstaculos apos o usuario perder uma partida
                    limpa:  function(){
                                this._obs = []; // Limpando o array de obstaculos
                    },

                    // METODO PARA DESENHAR O OBSTACULO NA TELA
                    desenha:    function(){
                                    // PERCORRENDO O ARRAY PARA DESENHAR OS BLOCOS QUE ESTAO NO MESMO
                                    for(var i = 0, tam = this._obs.length; i < tam; i++){
                                        var obs = this._obs[i]; 
                                        ctx.fillStyle = obs.cor;    // MUDANDO A COR DO CONTEXTO DO BLOCO
                                        ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura);  // DESENHANDO O BLOCO
                                    }
                    }
};


// FUNCAO QUE IDENTIFICA SE HOUVE CLIQUE
function clique(evt){
    // O jogo esteja sendo executado?
    if(estadoAtual == estados.jogando)
        bloco.pula();   // O bloco pula

    // O jogo esta pronto para ser executado?
    else if(estadoAtual == estados.jogar)
        estadoAtual = estados.jogando;  // Agora o jogo esta sendo executado

    // O usuario perdeu o jogo ??
    else if(estadoAtual == estados.perdeu
    && bloco.y >= 2*altura){   // Travando o usuario para jogar novamente
        obstaculos.limpa(); // Limpa o array de obstaculos
        bloco.reset();  // Resetando os atributo do bloco
        estadoAtual = estados.jogar;    // Agora o jogo esta pronto para ser iniciado
    }
}



// FUNCAO PARA ATUALIZAR O STATUS DO PERSONAGEM E DOS BLOCOS
function atualiza(){
    frames++;   // INCREMENTANDO O FRAMES DO JOGO
    bloco.atualiza();   // ATUALIZANDO A VELOCIDADE E COORDENADA y DO BLOCO (QUEDA ou CLIQUE)

    // O jogo está executando
    if(estadoAtual == estados.jogando)
        obstaculos.atualiza();  // ATUALIZANDO O ESTADO DOS OBSTACULOS (VELOCIDADE)
}


// FUNCAO USADA PARA DESENHAR (PERSONAGEM, BLOCOS, CHAO, ETC...) DEPOIS DE ATUALIZAR
function desenha(){

    //Desenhando o fundo do jogo
    ctx.fillStyle = "#80daff";  // PINTANDO O FUNDO DA CANVAS DE AZUL
    ctx.fillRect(0, 0, largura, altura);    // TAMANHO DA AREA DE PINTURA

    // Desenhando o score
    ctx.fillStyle = "#fff"; // Cor do placar
    ctx.font = "50px Arial";    // Fonte do placar
    ctx.fillText(bloco.score, 30, 68);  // Desenhando o placar na tela
    
    // O jogo está pronto para rodar?
    if(estadoAtual == estados.jogar){
        ctx.fillStyle = "green";    // Preenche o contexto de verde
        ctx.fillRect(largura/2 - 50, altura/2 - 50, 100, 100);  // Desenha o quadrado
    }

    // O jogador perdeu o jogo?
    else if(estadoAtual == estados.perdeu){
        ctx.fillStyle = "red";  // Preenche o contexto de vermelho
        ctx.fillRect(largura/2 - 50, altura/2 - 50, 100, 100);  // Desenha o quadrado

        /** DESENHANDO O SCORE NO QUADRADO VERMELHO */
        ctx.save(); // Salvando a imagem
        ctx.translate(largura/2, altura/2); // Transladando para o meio da canvas
        ctx.fillStyle = "#ffffff";  // 

        /** EXIBINDO O PLACAR DO JOGADOR */

        // O plcar do jogador tem um digito?
        if(bloco.score < 10)
            ctx.fillText(bloco.score, -13, 19);

        // O placar do jogador tem 2 digitos?
        else if(bloco.score >= 10 && bloco.score < 100)
            ctx.fillText(bloco.score, -26, 19)

        // O placar do jogador tem 3 digitos
        else
            ctx.fillText(bloco.score, -39, 19);


        /** EXIBINDO O RECORDE */

        // O jogador bateu o recorde?
        if(bloco.score > record)
            ctx.fillText("Novo Record", -150, -65); 

        // O recorde atual tem um digito?
        else if(record < 10)
            ctx.fillText("Record " + record, -99, -65);

        // O recorde atual tem 2 digitos?
        else if(record >= 10 && record < 100)
            ctx.fillText("Record " + record, -112, -65);

        // O recorde atual tem 3 digitos
        else
            ctx.fillText("Record " + record, -125, -65);

        ctx.restore(); // Restaura as configurações
    }

    // Condicional no caso do jogo estar em execucao
    else if(estadoAtual == estados.jogando)
        obstaculos.desenha();   // DESENHANDO OS OBSTACULOS

    chao.desenha(); // DESENHANDO O CHAO
    bloco.desenha();    // DESENHANDO O BLOCO
}


// FUNCAO PARA RODAR O JOGO. ONDE VAI FICAR O LOOP, DESENHADO NA CANVAS
function roda(){
    atualiza(); // ATUALIZANDO O STATUS DO PERSONAGEM E BLOCOS
    desenha();  // DESENHANDO PERSONAGEM, BLOCOS, CHAO, ETC...
    window.requestAnimationFrame(roda); // CHAMANDO A FUNÇÃO RODA DIRETO (LOOP)
}


// FUNÇÃO PRINCIPAL DO JOGO
function main(){
    altura = window.innerHeight;    // RECEBENDO A ALTURA DA JANELA DO USUARIO
    largura = window.innerWidth;    // RECEBENDO A LARGURA DA JANELA DO USUARIO

    // VERIFICANDO O TAMANHO DA JANELA DO USUARIO
    if(largura>=500){        
        // FORÇANDO O TAMANHO DA JANELA PARA UM TAMANHO FIXO
        largura = 600;
        altura = 600;
    }

    canvas = document.createElement("canvas");  // CRIANDO UM ELEMENTO DO TIPO CANVAS
    canvas.width = largura; // ATRIBUINDO A CANVAS A LARGURA CONFIGURADA ANTERIORMENTE
    canvas.height = altura; // ATRIBUINDO A CANVAS A ALTURA CONFIGURADA ANTERIORMENTE
    canvas.style.border = "1px solid #000"; // CRIANDO UMA BORDA PRETA PARA A CANVAS
    ctx = canvas.getContext("2d");  // TUDO O QUE FOR DESENHADO SERÁ 2D
    document.body.appendChild(canvas);  // ADICIONANDO A VARIAVEL CANVAS NO CORPO DO HTML
    document.addEventListener("mousedown", clique); // CONFIGURANDO O EVENTO "clique"
    estadoAtual = estados.jogar;    // O jogo esta pronto para ser iniciado (tela de inicio)
    record = localStorage.getItem("record");    // Acessando LOCALSTORAGE localStorage procurando pelo item RECORD e o atribui a variavel

    // Houve algum registro de recorde anterior?
    if(record == null)
        record = 0; // Resetando o recorde

    roda(); // RODANDO O JOGO
}

// INICIALIZA O JOGO
main();