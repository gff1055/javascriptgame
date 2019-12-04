
//VARIAVEIS DO JOGO

// USADAS PARA DESENHAR OS ITENS
var canvas, ctx,

// USADAS PARA PEGAR O TAMANHO DA JANELA DO NAVEGADOR
var altura, largura,

// USADO NO CONTROLE DA ANIMAÇÃO DO JOGO
frames = 0;


// FUNCAO QUE IDENTIFICA SE HOUVE CLIQUE
function clique()
{

}


// FUNCAO PARA RODAR O JOGO. ONDE VAI FICAR O LOOP, DESENHANDO NA CANVAS
function roda()
{

}

// FUNCAO PARA ATUALIZAR O STATUS DO PERSONAGEM E DOS BLOCOS
function atualiza()
{

}

// FUNCAO USADA PARA DESENHAR O PERSONAGEM, OS BLOCOS, O CHAO, ETC...
function desenha()
{

}


// FUNÇÃO PRINCIPAL DO JOGO
function main()
{
    // RECEBENDO A ALTURA DA JANELA DO USUARIO
    altura = window.innerHeight

    // RECEBENDO A LARGURA DA JANEKA DO USUARIO
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
}



// INICIALIZA O JOGO
main();