// Script do portfólio do Arthur

// ---------- tema claro / escuro ----------
var botaoTema = document.getElementById('btnTema');
var html = document.documentElement;

// vê se a pessoa já escolheu um tema antes
try {
  var temaSalvo = localStorage.getItem('tema');
  if (temaSalvo) {
    html.setAttribute('data-tema', temaSalvo);
  }
} catch (erro) {
  // se o navegador bloquear o localStorage, segue sem salvar
}

botaoTema.addEventListener('click', function () {
  var atual = html.getAttribute('data-tema');

  // se não tem tema escolhido, olha o do sistema
  if (!atual) {
    var sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    atual = sistemaEscuro ? 'escuro' : 'claro';
  }

  var novo = atual === 'escuro' ? 'claro' : 'escuro';
  html.setAttribute('data-tema', novo);

  try {
    localStorage.setItem('tema', novo);
  } catch (erro) {}
});


// ---------- efeito de digitação ----------
var frases = [
  'Desenvolvedor de Software Júnior',
  'Delphi + Firebird + SQL',
  'Sistemas ERP',
  'IA aplicada ao desenvolvimento',
  'Qualidade com testes'
];

var campoDigitando = document.getElementById('digitando');
var indiceFrase = 0;
var indiceLetra = 0;
var apagando = false;

function digitar() {
  var frase = frases[indiceFrase];

  if (apagando) {
    indiceLetra--;
  } else {
    indiceLetra++;
  }

  campoDigitando.textContent = frase.substring(0, indiceLetra);

  var espera = apagando ? 40 : 80;

  // terminou de escrever a frase, espera um pouco e começa a apagar
  if (!apagando && indiceLetra === frase.length) {
    apagando = true;
    espera = 1600;
  }
  // terminou de apagar, passa pra próxima frase
  else if (apagando && indiceLetra === 0) {
    apagando = false;
    indiceFrase = (indiceFrase + 1) % frases.length;
    espera = 400;
  }

  setTimeout(digitar, espera);
}

// quem prefere menos movimento vê só a primeira frase parada
var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (menosMovimento) {
  campoDigitando.textContent = frases[0];
} else {
  digitar();
}


// ---------- barra de progresso e menu ativo ----------
var barra = document.getElementById('progresso');
var linksMenu = document.querySelectorAll('.links a');
var secoes = document.querySelectorAll('main section[id]');

window.addEventListener('scroll', function () {
  // quanto da página já foi rolado (em %)
  var rolado = window.scrollY;
  var total = document.documentElement.scrollHeight - window.innerHeight;
  barra.style.width = (rolado / total) * 100 + '%';

  // descobre qual seção está na tela pra marcar no menu
  var secaoAtual = '';
  secoes.forEach(function (secao) {
    if (rolado >= secao.offsetTop - 140) {
      secaoAtual = secao.id;
    }
  });

  linksMenu.forEach(function (link) {
    if (link.getAttribute('href') === '#' + secaoAtual) {
      link.classList.add('ativo');
    } else {
      link.classList.remove('ativo');
    }
  });
});


// ---------- brilho que segue o mouse ----------
var brilho = document.getElementById('brilho');

document.addEventListener('mousemove', function (evento) {
  brilho.style.left = evento.clientX + 'px';
  brilho.style.top = evento.clientY + 'px';
});


// ---------- animação ao rolar a página ----------
var elementos = document.querySelectorAll('.aparecer');

if ('IntersectionObserver' in window) {
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target); // só anima uma vez
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(function (el, i) {
    // um pequeno atraso pros itens do mesmo grupo não aparecerem todos juntos
    el.style.transitionDelay = (i % 3) * 0.1 + 's';
    observador.observe(el);
  });
} else {
  // navegador antigo: mostra tudo de uma vez
  elementos.forEach(function (el) {
    el.classList.add('visivel');
  });
}


// ---------- cards que inclinam com o mouse ----------
var cardsInclinar = document.querySelectorAll('.area');

cardsInclinar.forEach(function (card) {
  card.addEventListener('mousemove', function (evento) {
    var caixa = card.getBoundingClientRect();

    // posição do mouse dentro do card, de -0.5 a 0.5
    var x = (evento.clientX - caixa.left) / caixa.width - 0.5;
    var y = (evento.clientY - caixa.top) / caixa.height - 0.5;

    card.style.transform =
      'perspective(700px) rotateX(' + (y * -10) + 'deg) rotateY(' + (x * 10) + 'deg) translateY(-4px)';
  });

  card.addEventListener('mouseleave', function () {
    card.style.transform = '';
  });
});


// ---------- botões de copiar ----------
var aviso = document.getElementById('avisoCopiado');
var botoesCopiar = document.querySelectorAll('.copiar');

function mostrarAviso() {
  aviso.classList.add('mostrar');
  setTimeout(function () {
    aviso.classList.remove('mostrar');
  }, 1800);
}

botoesCopiar.forEach(function (botao) {
  botao.addEventListener('click', function () {
    var elemento = document.getElementById(botao.dataset.alvo);
    var texto = elemento.textContent;

    // tenta copiar; se não deixar, só seleciona o texto pra pessoa copiar na mão
    try {
      navigator.clipboard.writeText(texto).then(mostrarAviso, function () {
        selecionar(elemento);
      });
    } catch (erro) {
      selecionar(elemento);
    }
  });
});

function selecionar(elemento) {
  var intervalo = document.createRange();
  intervalo.selectNodeContents(elemento);
  var selecao = window.getSelection();
  selecao.removeAllRanges();
  selecao.addRange(intervalo);
}
