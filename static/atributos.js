// 1. Definir as raças e seus bônus
const racas = {
    "Humano": {
        bonusFixos: { for: 1, des: 2 },
        extras: 2
    },
    "Golem": {
        bonusFixos: { des: 2, for: 1 },
        extras: 1
    },
    "Elfo": {
        bonusFixos: { des: 2 },
        extras: 1
    }
    // Adicione mais aqui
};

// 2. Variáveis globais
let pontosExtras = 5;
let distribuidos = 0;
let bloqueados = {};
const atributos = ['for', 'des', 'con', 'int', 'sab', 'car'];

// 3. Função para preencher o select com as raças
function preencherRacas() {
    const selectRaca = document.getElementById('raca');
    selectRaca.innerHTML = '<option value="">Selecione</option>';
    Object.keys(racas).forEach(nome => {
        const opt = document.createElement('option');
        opt.value = nome;
        opt.textContent = nome;
        selectRaca.appendChild(opt);
    });
}

// 4. Função chamada ao selecionar uma raça
function aplicarBonusRaca() {
    const raca = document.getElementById('raca').value;
    const nivel = parseInt(document.getElementById('nivel')?.value || 1);

    if (!racas[raca] || nivel !== 1) return;

    const { bonusFixos, extras } = racas[raca];
    pontosExtras = extras;
    distribuidos = 0;
    bloqueados = {};

    atributos.forEach(attr => {
        const input = document.getElementById(attr);
        if (bonusFixos[attr] !== undefined) {
            input.value = bonusFixos[attr];
            bloqueados[attr] = true;
        } else {
            input.value = 0;
        }
    });

    atualizarSetas();
}

// 5. Atualiza visualmente os botões ▲ ▼
function atualizarSetas() {
    document.querySelectorAll('.atributo-container').forEach(container => {
        const attr = container.dataset.attr;
        const input = document.getElementById(attr);
        const valor = parseInt(input.value);
        const up = container.querySelector('[data-action="increment"]');
        const down = container.querySelector('[data-action="decrement"]');

        if (bloqueados[attr]) {
            up.style.opacity = '0.3';
            up.style.pointerEvents = 'none';
            down.style.opacity = '0.3';
            down.style.pointerEvents = 'none';
        } else {
            if (distribuidos >= pontosExtras || valor >= 10) {
                up.style.opacity = '0.3';
                up.style.pointerEvents = 'none';
            } else {
                up.style.opacity = '1';
                up.style.pointerEvents = 'auto';
            }

            if (valor <= -5) {
                down.style.opacity = '0.3';
                down.style.pointerEvents = 'none';
            } else {
                down.style.opacity = '1';
                down.style.pointerEvents = 'auto';
            }
        }
    });
}

// 6. Substitui o trecho de listener das setas
function configurarSetasAtributos() {
    document.querySelectorAll('.atributo-seta').forEach(button => {
        button.addEventListener('click', function () {
            const attr = this.closest('.atributo-container').dataset.attr;
            const input = document.getElementById(attr);
            const action = this.dataset.action;
            const atual = parseInt(input.value);

            if (bloqueados[attr]) return;

            if (action === 'increment') {
                if (distribuidos < pontosExtras && atual < 10) {
                    input.value = atual + 1;
                    distribuidos++;
                }
            } else {
                if (atual > 0) {
                    input.value = atual - 1;
                    distribuidos--;
                }
            }

            input.dispatchEvent(new Event('input', { bubbles: true }));
            atualizarSetas();
        });
    });
}

// 7. Função principal de inicialização
function inicializarBonusRaca() {
    preencherRacas(); // Substitui os <option> fixos
    configurarSetasAtributos(); // Troca os listeners padrões
    document.getElementById('raca').addEventListener('change', aplicarBonusRaca);
}
