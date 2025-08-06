        document.addEventListener('DOMContentLoaded', function() {
            // --- VARIAVEIS GLOBAIS DA FICHA ---
            var periciasTabelaBody, equipamentoTabela;

            // --- ESTRUTURA DE DADOS ---
            const PERICIAS = {
                'acrobacia': { nome: 'Acrobacia ✠', attr: 'des', penalidade: true }, 'adestramento': { nome: 'Adestramento ✯', attr: 'car' },
                'atletismo': { nome: 'Atletismo', attr: 'for' }, 'atuacao': { nome: 'Atuação ✯', attr: 'car' },
                'cavalgar': { nome: 'Cavalgar', attr: 'des' }, 'conhecimento': { nome: 'Conhecimento ✯', attr: 'int' },
                'cura': { nome: 'Cura', attr: 'sab' }, 'diplomacia': { nome: 'Diplomacia', attr: 'car' },
                'enganacao': { nome: 'Enganação', attr: 'car' }, 'fortitude': { nome: 'Fortitude', attr: 'con' },
                'furtividade': { nome: 'Furtividade ✠', attr: 'des', penalidade: true }, 'guerra': { nome: 'Guerra ✯', attr: 'int' },
                'iniciativa': { nome: 'Iniciativa', attr: 'des' }, 'intimidacao': { nome: 'Intimidação', attr: 'car' },
                'intuicao': { nome: 'Intuição', attr: 'sab' }, 'investigacao': { nome: 'Investigação', attr: 'int' },
                'jogatina': { nome: 'Jogatina ✯', attr: 'car' }, 'ladinagem': { nome: 'Ladinagem ✯✠', attr: 'des', penalidade: true },
                'luta': { nome: 'Luta', attr: 'for' }, 'misticismo': { nome: 'Misticismo ✯', attr: 'int' },
                'nobreza': { nome: 'Nobreza ✯', attr: 'int' }, 'oficio': { nome: 'Ofício (____) ✯', attr: 'int' },
                'percepcao': { nome: 'Percepção', attr: 'sab' }, 'pilotagem': { nome: 'Pilotagem ✯', attr: 'des' },
                'pontaria': { nome: 'Pontaria', attr: 'des' }, 'reflexos': { nome: 'Reflexos', attr: 'des' },
                'religiao': { nome: 'Religião ✯', attr: 'sab' }, 'sobrevivencia': { nome: 'Sobrevivência', attr: 'sab' },
                'vontade': { nome: 'Vontade', attr: 'sab' }
            };
            const ARMADURAS = { 'Nenhuma': {def: 0, pen: 0}, 'Acolchoada': {def: 1, pen: 0}, 'Couro': {def: 2, pen: 0}, 'Couro Batido': {def: 3, pen: -1}, 'Gibão de Peles': {def: 4, pen: -3}, 'Couraça': {def: 5, pen: -4}, 'Brunea': {def: 5, pen: -2}, 'Cota de Malha': {def: 6, pen: -2}, 'Loriga Segmentada': {def: 7, pen: -3}, 'Meia Armadura': {def: 8, pen: -4}, 'Armadura Completa': {def: 10, pen: -5} };
            const ESCUDOS = { 'Nenhum': {def: 0, pen: 0}, 'Escudo Leve': {def: 1, pen: -1}, 'Escudo Pesado': {def: 2, pen: -2} };
            const CIRCULOS_MAGIA = { 1: '1 PM', 2: '3 PM', 3: '6 PM', 4: '10 PM', 5: '15 PM' };

            // --- INICIALIZAÇÃO DOS ELEMENTOS DO DOM ---
            periciasTabelaBody = document.getElementById('pericias-tabela-body');
            equipamentoTabela = document.getElementById('equipamento-tabela');

            // --- FUNÇÕES DE CÁLCULO ---
            const calcularDefesa = () => {
                const armaduraKey = document.getElementById('select-armadura').value;
                const escudoKey = document.getElementById('select-escudo').value;
                const armadura = ARMADURAS[armaduraKey] || {def: 0, pen: 0};
                const escudo = ESCUDOS[escudoKey] || {def: 0, pen: 0};

                document.getElementById('armadura-defesa-display').value = armadura.def;
                document.getElementById('armadura-penalidade-display').value = armadura.pen;
                document.getElementById('escudo-defesa-display').value = escudo.def;
                document.getElementById('escudo-penalidade-display').value = escudo.pen;
                
                const destreza = parseInt(document.getElementById('des').value) || 0;
                const outros = parseInt(document.getElementById('defesa-outros').value) || 0;
                
                document.getElementById('defesa-des').value = destreza;
                document.getElementById('bonus-armadura').value = armadura.def;
                document.getElementById('bonus-escudo').value = escudo.def;
                document.getElementById('defesa-total').value = 10 + destreza + armadura.def + escudo.def + outros;
            };

            const calcularCarga = () => {
                const forca = parseInt(document.getElementById('for').value) || 0;
                if (forca >= 1) {
                    forca_peso = forca * 2;
                } else {
                    forca_peso = forca;
                }
                document.getElementById('carga-max').value = 10 + forca_peso;
                let cargaAtual = 0;
                document.querySelectorAll('#equipamento-tabela tr').forEach(row => {
                    const espacoInput = row.querySelector('input[name*="-espaco"]');
                    if (espacoInput) cargaAtual += parseFloat(espacoInput.value) || 0;
                });
                document.getElementById('carga-atual').value = cargaAtual;
            };

            const calcularCDMagia = () => {
                const attrKey = document.getElementById('magia-cd-attr').value;
                const modAttr = parseInt(document.getElementById(attrKey).value) || 0;
                const equip = parseInt(document.getElementById('magia-cd-equip').value) || 0;
                const poder = parseInt(document.getElementById('magia-cd-poder').value) || 0;
                const outros = parseInt(document.getElementById('magia-cd-outros').value) || 0;
                document.getElementById('magia-cd-total').value = 10 + modAttr + equip + poder + outros;
            };

            const calcularTodasPericias = () => {
                const nivelEl = document.getElementById('nivel');
                if (!nivelEl) return;
                const nivel = parseInt(nivelEl.value) || 0;
                const meioNivel = Math.floor(nivel / 2);
                
                const armaduraKey = document.getElementById('select-armadura').value;
                const escudoKey = document.getElementById('select-escudo').value;
                const penalidadeArmadura = (ARMADURAS[armaduraKey] || {pen: 0}).pen;
                const penalidadeEscudo = (ESCUDOS[escudoKey] || {pen: 0}).pen;
                const penalidadeTotal = penalidadeArmadura + penalidadeEscudo;

                Object.keys(PERICIAS).forEach(id => {
                    const pericia = PERICIAS[id];
                    const modAtributoEl = document.getElementById(pericia.attr);
                    const treinoCheckbox = document.getElementById(`treino-${id}`);
                    const outrosEl = document.getElementById(`outros-${id}`);
                    if(!modAtributoEl || !treinoCheckbox || !outrosEl) return;

                    const modAtributo = parseInt(modAtributoEl.value) || 0;
                    const outros = parseInt(outrosEl.value) || 0;
                    let bonusTreino = 0;
                    if (treinoCheckbox && treinoCheckbox.checked) {
                        if (nivel >= 15) bonusTreino = 6;
                        else if (nivel >= 7) bonusTreino = 4;
                        else bonusTreino = 2;
                    }
                    const penalidadeAplicada = pericia.penalidade ? penalidadeTotal : 0;
                    const total = modAtributo + meioNivel + bonusTreino + outros + penalidadeAplicada; // Penalidade é negativa
                    document.getElementById(`total-${id}`).value = total;
                    document.getElementById(`meio-nivel-${id}`).value = meioNivel;
                    document.getElementById(`mod-attr-${id}`).value = modAtributo;
                    document.getElementById(`treino-val-${id}`).value = bonusTreino;
                });
            };

            const recalcularTudo = () => {
                calcularDefesa();
                calcularCarga();
                calcularTodasPericias();
                calcularCDMagia();
            };

            // --- FUNÇÕES DE MANIPULAÇÃO DE DADOS (JSON/LocalStorage) ---
            const getFichaData = () => {
                const dados = {};
                document.querySelectorAll('[id]').forEach(el => {
                    if (el.id && !el.closest('#pericias-tabela-body')) {
                        if (el.type === 'checkbox') dados[el.id] = el.checked;
                        else if (el.type !== 'file') dados[el.id] = el.value;
                    }
                });
                document.querySelectorAll('#pericias-tabela-body input').forEach(input => {
                    if (input.id.startsWith('treino-') || input.id.startsWith('outros-')) {
                        dados[input.id] = input.type === 'checkbox' ? input.checked : input.value;
                    }
                });
                dados.ataques = [];
                document.querySelectorAll('#ataques-tabela tr').forEach(row => {
                    dados.ataques.push({
                        nome: row.querySelector('[name*="-nome"]').value, bonus: row.querySelector('[name*="-bonus"]').value,
                        dano: row.querySelector('[name*="-dano"]').value, critico: row.querySelector('[name*="-critico"]').value,
                        tipo: row.querySelector('[name*="-tipo"]').value, alcance: row.querySelector('[name*="-alcance"]').value,
                    });
                });
                dados.habilidades = Array.from(document.querySelectorAll('#habilidades-lista input')).map(input => input.value);
                dados.magias = {};
                Object.keys(CIRCULOS_MAGIA).forEach(circulo => {
                    dados.magias[circulo] = Array.from(document.querySelectorAll(`#magias-circulo-${circulo}-lista input`)).map(input => input.value);
                });
                dados.equipamento = [];
                document.querySelectorAll('#equipamento-tabela tr').forEach(row => {
                    dados.equipamento.push({
                        nome: row.querySelector('[name*="-nome"]').value, espaco: row.querySelector('[name*="-espaco"]').value,
                        valor: row.querySelector('[name*="-valor"]').value,
                    });
                });
                return dados;
            };
            
            const salvarFormulario = () => {
                const dados = getFichaData();
                localStorage.setItem('fichaTormenta20_v10', JSON.stringify(dados));
            };

            const carregarFormulario = (dados) => {
                if (!dados) return;
                Object.keys(dados).forEach(key => {
                    const el = document.getElementById(key);
                    if (el) {
                         if (el.type === 'checkbox') el.checked = dados[key];
                        else el.value = dados[key];
                    }
                });
                if (dados.ataques && Array.isArray(dados.ataques)) {
                    document.getElementById('ataques-tabela').innerHTML = '';
                    dados.ataques.forEach(ataque => adicionarLinhaAtaque(ataque.nome, ataque.bonus, ataque.dano, ataque.critico, ataque.tipo, ataque.alcance));
                }
                if (dados.habilidades && Array.isArray(dados.habilidades)) {
                    document.getElementById('habilidades-lista').innerHTML = '';
                    dados.habilidades.forEach(habilidade => adicionarLinhaHabilidade(habilidade));
                }
                if (dados.magias && typeof dados.magias === 'object') {
                    Object.keys(dados.magias).forEach(circulo => {
                        const lista = document.getElementById(`magias-circulo-${circulo}-lista`);
                        if(lista) {
                            lista.innerHTML = '';
                            dados.magias[circulo].forEach(magia => adicionarLinhaMagia(circulo, magia));
                        }
                    });
                }
                if (dados.equipamento && Array.isArray(dados.equipamento)) {
                    document.getElementById('equipamento-tabela').innerHTML = '';
                    dados.equipamento.forEach(item => adicionarLinhaEquipamento(item.nome, item.espaco, item.valor));
                }
                recalcularTudo();
                salvarFormulario();
            };

            const limparFormulario = () => {
                const modal = document.getElementById('confirm-modal');
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.remove('opacity-0'), 10);
                document.getElementById('modal-confirm-btn').onclick = () => {
                    localStorage.removeItem('fichaTormenta20_v10');
                    window.location.reload();
                };
                document.getElementById('modal-cancel-btn').onclick = () => {
                     modal.classList.add('opacity-0');
                     setTimeout(() => modal.classList.add('hidden'), 300);
                };
            };

            const downloadFicha = () => {
                const dados = getFichaData();
                const jsonData = JSON.stringify(dados, null, 2);
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const personagemNome = document.getElementById('personagem').value.trim().replace(/\s+/g, '_') || 'personagem';
                a.href = url;
                a.download = `${personagemNome}_t20.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };

            const handleFileUpload = (event) => {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const dados = JSON.parse(e.target.result);
                        carregarFormulario(dados);
                    } catch (error) {
                        console.error("Erro ao ler o arquivo JSON:", error);
                        alert("Arquivo inválido. Por favor, selecione um arquivo de ficha JSON válido.");
                    }
                };
                reader.readAsText(file);
                event.target.value = '';
            };
            
            const gerarPdfMestre = () => {
                const app = document.getElementById('app-container');
                const ficha = document.getElementById('ficha-container');
                const personagemNome = document.getElementById('personagem').value.trim().replace(/\s+/g, '_') || 'personagem';
                
                app.classList.add('print-mode');

                html2pdf().from(ficha).set({
                    margin: 0, filename: `${personagemNome}_t20.pdf`, image: { type: 'jpeg', quality: 2 },
                    html2canvas: { scale: 1, useCORS: true }, jsPDF: { unit: 'mm', format: 'a2', orientation: 'portrait' }
                }).save().finally(() => {
                    app.classList.remove('print-mode');
                });
            };
            
            // --- FUNÇÕES DE INICIALIZAÇÃO E EVENTOS ---
            const inicializarPericias = () => {
                periciasTabelaBody.innerHTML = '';
                Object.keys(PERICIAS).forEach(id => {
                    const pericia = PERICIAS[id];
                    const row = document.createElement('tr');
                    row.className = 'border-b border-red-800/20';
                    row.innerHTML = `
                        <td class="py-1 px-1">${pericia.nome}</td>
                        <td class="py-1 px-1"><input type="number" id="total-${id}" readonly class="w-10 text-center font-bold bg-stone-200 rounded-sm"></td>
                        <td class="py-1 px-1 text-center hidden sm:table-cell"><input type="number" id="meio-nivel-${id}" readonly class="w-10 text-center bg-transparent"></td>
                        <td class="py-1 px-1 text-center hidden sm:table-cell"><input type="number" id="mod-attr-${id}" readonly class="w-10 text-center bg-transparent"></td>
                        <td class="py-1 px-1 text-center hidden sm:table-cell">
                           <input type="checkbox" id="treino-${id}" class="form-checkbox h-4 w-4 text-red-800 bg-transparent border-red-800 rounded focus:ring-red-700 cursor-pointer">
                           <input type="number" id="treino-val-${id}" readonly class="w-10 text-center bg-transparent hidden">
                        </td>
                        <td class="py-1 px-1 text-center hidden sm:table-cell"><input type="number" id="outros-${id}" value="0" class="w-10 text-center bg-transparent border-b border-red-800/50"></td>
                    `;
                    periciasTabelaBody.appendChild(row);
                });
            };

            const inicializarEquipamentos = () => {
                const selectArmadura = document.getElementById('select-armadura');
                const selectEscudo = document.getElementById('select-escudo');
                Object.keys(ARMADURAS).forEach(key => {
                    selectArmadura.add(new Option(key, key));
                });
                Object.keys(ESCUDOS).forEach(key => {
                    selectEscudo.add(new Option(key, key));
                });
            };
            
            const adicionarLinhaEquipamento = (nome = '', espaco = '', valor = '') => {
                const row = document.createElement('tr');
                row.className = 'border-b border-red-800/20';
                row.innerHTML = `
                    <td><input type="text" name="equip-nome" value="${nome}" class="w-full bg-transparent p-1 focus:outline-none"></td>
                    <td class="text-center"><input type="number" name="equip-espaco" value="${espaco}" class="w-12 bg-transparent p-1 text-center focus:outline-none"></td>
                    <td class="text-center"><input type="text" name="equip-valor" value="${valor}" class="w-12 bg-transparent p-1 text-center focus:outline-none"></td>
                `;
                document.getElementById('equipamento-tabela').appendChild(row);
                row.querySelectorAll('input').forEach(input => {
                    input.addEventListener('input', () => {
                        calcularCarga();
                        salvarFormulario();
                    });
                });
            };

            const adicionarLinhaAtaque = (nome = '', bonus = '', dano = '', critico = '', tipo = '', alcance = '') => {
                const tbody = document.getElementById('ataques-tabela');
                const row = document.createElement('tr');
                row.className = 'border-b border-red-800/20';
                row.innerHTML = `
                    <td><input type="text" value="${nome}" class="w-full bg-transparent p-1 focus:outline-none" name="ataque-nome"></td>
                    <td><input type="text" value="${bonus}" class="w-full bg-transparent p-1 focus:outline-none" name="ataque-bonus"></td>
                    <td><input type="text" value="${dano}" class="w-full bg-transparent p-1 focus:outline-none" name="ataque-dano"></td>
                    <td><input type="text" value="${critico}" class="w-full bg-transparent p-1 focus:outline-none" name="ataque-critico"></td>
                    <td><input type="text" value="${tipo}" class="w-full bg-transparent p-1 focus:outline-none" name="ataque-tipo"></td>
                    <td><input type="text" value="${alcance}" class="w-full bg-transparent p-1 focus:outline-none" name="ataque-alcance"></td>
                `;
                tbody.appendChild(row);
            };

            const adicionarLinhaHabilidade = (texto = '') => {
                const container = document.getElementById('habilidades-lista');
                const input = document.createElement('input');
                input.type = 'text';
                input.value = texto;
                input.className = 'w-full bg-transparent p-1 border-b-2 border-red-800/50 focus:outline-none focus:border-red-700';
                container.appendChild(input);
            };

            const adicionarLinhaMagia = (circulo, texto = '') => {
                const container = document.getElementById(`magias-circulo-${circulo}-lista`);
                const input = document.createElement('input');
                input.type = 'text';
                input.value = texto;
                input.className = 'w-full bg-transparent p-1 border-b-2 border-red-800/50 focus:outline-none focus:border-red-700';
                container.appendChild(input);
            };

            const inicializarMagias = () => {
                const container = document.getElementById('magias-circulos');
                Object.keys(CIRCULOS_MAGIA).forEach(circulo => {
                    const div = document.createElement('div');
                    div.className = 'p-2 border-2 border-red-800 rounded-lg';
                    div.innerHTML = `
                        <div class="flex justify-between items-center bg-stone-200 p-1 rounded-md">
                            <h4 class="font-medieval text-red-900">${circulo}º Círculo</h4>
                            <span class="text-xs font-bold">${CIRCULOS_MAGIA[circulo]}</span>
                            <button class="add-magia-btn bg-red-800 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-lg" data-circulo="${circulo}">+</button>
                        </div>
                        <div id="magias-circulo-${circulo}-lista" class="mt-2 space-y-1"></div>
                    `;
                    container.appendChild(div);
                });
            };

            const setupEventListeners = () => {
                document.getElementById('app-container').addEventListener('input', salvarFormulario);
                document.getElementById('app-container').addEventListener('change', salvarFormulario);
                const inputsToRecalculate = ['nivel', 'for', 'des', 'con', 'int', 'sab', 'car', 'defesa-outros', 'magia-cd-attr', 'magia-cd-outros', 'divindade', 'magia-cd-equip', 'magia-cd-poder'];
                inputsToRecalculate.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        const eventType = element.tagName === 'SELECT' ? 'change' : 'input';
                        element.addEventListener(eventType, recalcularTudo);
                    } else {
                        console.error(`Elemento com ID '${id}' não encontrado durante a configuração dos listeners.`);
                    }
                });
                document.querySelectorAll('.atributo-seta').forEach(button => {
                    button.addEventListener('click', function() {
                        const attr = this.closest('.atributo-container').dataset.attr;
                        const input = document.getElementById(attr);
                        input.value = parseInt(input.value) + (this.dataset.action === 'increment' ? 1 : -1);
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    });
                });
                periciasTabelaBody.addEventListener('change', (e) => { if (e.target.type === 'checkbox') recalcularTudo(); });
                periciasTabelaBody.addEventListener('input', (e) => { if (e.target.id.startsWith('outros-')) recalcularTudo(); });
                
                document.getElementById('select-armadura').addEventListener('change', recalcularTudo);
                document.getElementById('select-escudo').addEventListener('change', recalcularTudo);

                document.getElementById('btn-download').addEventListener('click', downloadFicha);
                document.getElementById('btn-upload').addEventListener('click', () => document.getElementById('upload-input').click());
                document.getElementById('upload-input').addEventListener('change', handleFileUpload);
                document.getElementById('btn-pdf').addEventListener('click', gerarPdfMestre);
                document.getElementById('btn-limpar').addEventListener('click', limparFormulario);
                document.getElementById('add-equip-row').addEventListener('click', () => adicionarLinhaEquipamento());
                document.getElementById('add-habilidade-row').addEventListener('click', () => adicionarLinhaHabilidade());
                document.getElementById('add-ataque-row').addEventListener('click', () => adicionarLinhaAtaque());
                document.getElementById('magias-circulos').addEventListener('click', (e) => {
                    if (e.target.classList.contains('add-magia-btn')) {
                        adicionarLinhaMagia(e.target.dataset.circulo);
                    }
                });

            };

            const carregarDadosIniciais = () => {
                const dadosSalvos = localStorage.getItem('fichaTormenta20_v10');
                if (dadosSalvos) {
                    try { carregarFormulario(JSON.parse(dadosSalvos)); } catch (e) {
                        console.error("Falha ao carregar dados salvos.", e);
                        localStorage.removeItem('fichaTormenta20_v10');
                    }
                } else {
                    for(let i=0; i<3; i++) adicionarLinhaAtaque();
                    for(let i=0; i<5; i++) adicionarLinhaEquipamento();
                    adicionarLinhaHabilidade();
                }
            };
            
            inicializarPericias();
            inicializarEquipamentos();
            inicializarMagias();
            carregarDadosIniciais();
            recalcularTudo();
            setupEventListeners();
            inicializarBonusRaca();
        });