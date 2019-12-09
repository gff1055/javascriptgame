
//VARIAVEIS DO JOGO

// USADAS PARA DESENHAR OS ITENS
var canvas, ctx;

// USADAS PARA PEGAR O TAMANHO DA JANELA DO NAVEGADOR
var altura, largura;

// USADO NO CONTROLE DA ANIMAÇÃO DO JOGO
frames = 0;



// FUNCAO QUE IDENTIFICA SE HOUVE CLIQUE
function clique(evt)
{
    alert("clicou");
}



// FUNCAO PARA RODAR O JOGO. ONDE VAI FICAR O LOOP, DESENHADO NA CANVAS
function roda()
{
    // ATUALIZANDO O STATUS DO PERSONAGEM E BLOCOS
    atualiza();

    // DESENHANDO PERSONAGEM, BLOCOS, CHAO, ETC...
    desenha();

    // CHAMANDO A FUNÇÃO RODA DIRETO (LOOP)
    window.requestAnimationFrame(roda);
}



// FUNCAO PARA ATUALIZAR O STATUS DO PERSONAGEM E DOS BLOCOS
function atualiza()
{
    // INCREMENTANDO O FRAMES DO JOGO
    frames++;
}



// FUNCAO USADA PARA DESENHAR (PERSONAGEM, BLOCOS, CHAO, ETC...) DEPOIS DE ATUALIZAR
function desenha()
{
    // PINTANDO O FUNDO DA CANVAS DE AZUL
    ctx.fillStyle = "#50beff";

    // TAMANHO DA AREA DE PINTURA
    ctx.fillRect(0, 0, largura, altura);
}



// FUNÇÃO PRINCIPAL DO JOGO
function main()
{
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