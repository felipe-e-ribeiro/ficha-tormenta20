document.addEventListener("DOMContentLoaded", () => {
    carregarFichaAtual();
    listarFichas();
    document.querySelectorAll("input, textarea, select").forEach(el => {
        el.addEventListener("input", salvarAuto);
    });
});

function getFichaData() {
    const inputs = document.querySelectorAll("input, textarea, select");
    let data = {};
    inputs.forEach(input => {
        if (input.name) {
            data[input.name] = input.value;
        }
    });
    return data;
}

function setFichaData(data) {
    const inputs = document.querySelectorAll("input, textarea, select");
    inputs.forEach(input => {
        if (input.name && data[input.name] !== undefined) {
            input.value = data[input.name];
        }
    });
}

function salvarAuto() {
    const data = getFichaData();
    localStorage.setItem("fichaAtual", JSON.stringify(data));
    listarFichas();
}

function carregarFichaAtual() {
    const data = JSON.parse(localStorage.getItem("fichaAtual"));
    if (data) setFichaData(data);
}

function gravarFicha() {
    const data = getFichaData();
    const nome = data.attr_character_name || "Ficha sem nome";
    localStorage.setItem(nome, JSON.stringify(data));
    listarFichas();
}

function listarFichas() {
    const container = document.getElementById("fichasSalvas");

    // Se já estiver visível, esconde e sai
    if (!container.classList.contains("hidden")) {
        container.classList.add("hidden");
        return;
    }

    // Senão, mostra e popula a lista
    container.innerHTML = "";
    container.classList.remove("hidden");

    Object.keys(localStorage).forEach(key => {
        if (key === "fichaAtual") return;

        const data = JSON.parse(localStorage.getItem(key));
        const btn = document.createElement("button");
        btn.textContent = `${data.attr_character_name || "?"} | ${data.attr_trace || "?"} | ${data.attr_class || "?"} | ${data.attr_torigin || "?"}`;
        btn.className = "px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 transition text-sm";
        btn.onclick = () => setFichaData(data);

        container.appendChild(btn);
    });
}


function exportarFicha() {
    const ficha = document.getElementById("ficha");

    const printWindow = window.open("", "", "width=800,height=1000");

    // Copia todos os estilos do documento original
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map(style => style.outerHTML)
        .join("");

    printWindow.document.write(`
        <html>
            <head>
                <title>Exportar Ficha</title>
                ${styles}
            </head>
            <body class="bg-white text-black p-4">
                ${ficha.outerHTML}
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Espera os estilos carregarem antes de imprimir
    printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
    };
}

document.addEventListener("DOMContentLoaded", () => {
    carregarFichaAtual();
    listarFichas();
    document.querySelectorAll("input, textarea, select").forEach(el => {
        el.addEventListener("input", salvarAuto);
    });
});


//

        document.addEventListener('DOMContentLoaded', function() {
            const modifiers = { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 };

            function calculateModifier(value) {
                const numValue = parseInt(value, 0);
                return isNaN(numValue) ? 0 : Math.floor((numValue - 0));
            }

            function getTrainingBonus(level) {
                if (level >= 15) return 6;
                if (level >= 7) return 4;
                if (level >= 1) return 2;
                return 0;
            }

            function updateAllSkills() {
                const level = parseInt(document.getElementById('char-level').value, 10) || 1;
                const trainingBonusValue = getTrainingBonus(level);

                document.querySelectorAll('.sheet-skill-list').forEach(skillRow => {
                    const selectedAttr = skillRow.querySelector('.skill-attr').value;
                    const attrMod = modifiers[selectedAttr];
                    
                    const trainingCheckbox = skillRow.querySelector('.skill-training');
                    const trainingBonusInput = skillRow.querySelector('.skill-training-bonus');
                    let trainingBonus = 0;
                    if (trainingCheckbox.checked) {
                        trainingBonus = trainingBonusValue;
                    }
                    trainingBonusInput.value = trainingBonus;

                    const othersBonus = parseInt(skillRow.querySelector('.skill-others').value, 10) || 0;
                    const level_plus = parseInt(level / 2);
                    
                    const total = attrMod + trainingBonus + othersBonus + level_plus;
                    skillRow.querySelector('.sheet-total').value = total;
                });
            }

            function updateDefense() {
                let total = 10;
                const dexMod = modifiers['des'];
                const useDex = document.getElementById('defense-dex-mod').value === 'sim';
                const armor = parseInt(document.getElementById('defense-armor-bonus').value, 10) || 0;
                const shield = parseInt(document.getElementById('defense-shield-bonus').value, 10) || 0;
                const others = parseInt(document.getElementById('defense-others').value, 10) || 0;

                if (useDex) {
                    total += dexMod;
                }
                total += armor;
                total += shield;
                total += others;

                document.getElementById('defense-total').value = total;
            }

            function updateModifier(inputElement) {
                const container = inputElement.closest('.sheet-outer-container-negative-corner');
                const attrName = container.dataset.attr;
                const modField = container.querySelector('.sheet-fake-mod');
                
                const modifier = calculateModifier(inputElement.value);
                modifiers[attrName] = modifier;
                modField.value = modifier >= 0 ? `+${modifier}` : modifier;
                
                updateAllSkills();
                updateDefense(); 
            }
            
            function updateLoad() {
                let totalLoad = 0;
                document.querySelectorAll('#equipment-list .sheet-grid-equipment').forEach(itemRow => {
                    const quantity = parseFloat(itemRow.querySelector('.item-quantity').value) || 0;
                    const weight = parseFloat(itemRow.querySelector('.item-weight').value) || 0;
                    totalLoad += quantity * weight;
                });
                document.getElementById('total-load').value = totalLoad.toFixed(2);
            }

            document.querySelectorAll('.attr-input').forEach(input => {
                updateModifier(input);
                input.addEventListener('input', () => updateModifier(input));
            });

            document.getElementById('char-level').addEventListener('input', updateAllSkills);
            
            document.querySelectorAll('.skill-attr, .skill-training, .skill-others').forEach(element => {
                element.addEventListener('change', updateAllSkills);
                if(element.classList.contains('skill-others')) {
                    element.addEventListener('input', updateAllSkills);
                }
            });

            document.querySelectorAll('#defense-dex-mod, #defense-others').forEach(element => {
                element.addEventListener('input', updateDefense);
            });

            // Sincronizar Defesa da Armadura e Escudo
            const armorDefInput = document.getElementById('armor-defense-value');
            const shieldDefInput = document.getElementById('shield-defense-value');
            const armorBonusInput = document.getElementById('defense-armor-bonus');
            const shieldBonusInput = document.getElementById('defense-shield-bonus');

            armorDefInput.addEventListener('input', () => {
                armorBonusInput.value = armorDefInput.value;
                updateDefense();
            });
            shieldDefInput.addEventListener('input', () => {
                shieldBonusInput.value = shieldDefInput.value;
                updateDefense();
            });


            // Sincronizar Vida e Mana
            const hpMax = document.getElementById('hp-max');
            const hpCurrent = document.getElementById('hp-current');
            const hpTemp = document.getElementById('hp-temp');
            const manaMax = document.getElementById('mana-max');
            const manaCurrent = document.getElementById('mana-current');
            const manaTemp = document.getElementById('mana-temp');

            function updateCurrentHP() {
                const max = parseInt(hpMax.value, 10) || 0;
                const temp = parseInt(hpTemp.value, 10) || 0;
                hpCurrent.value = max + temp;
            }

            function updateCurrentMana() {
                const max = parseInt(manaMax.value, 10) || 0;
                const temp = parseInt(manaTemp.value, 10) || 0;
                manaCurrent.value = max + temp;
            }
            
            hpMax.addEventListener('input', updateCurrentHP);
            hpTemp.addEventListener('input', updateCurrentHP);
            manaMax.addEventListener('input', updateCurrentMana);
            manaTemp.addEventListener('input', updateCurrentMana);

            
            // --- Adicionar/Remover Elementos Dinâmicos ---

            function createRemoveButton(elementToRemove) {
                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.classList.add('remove-button');
                removeButton.textContent = 'X';
                removeButton.addEventListener('click', () => {
                    elementToRemove.remove();
                    updateLoad(); // Recalcula a carga ao remover um item
                });
                return removeButton;
            }

            // Magias
            document.querySelectorAll('.add-spell-button').forEach(button => {
                button.addEventListener('click', function() {
                    const targetListId = this.getAttribute('data-target-list');
                    const spellListContainer = document.querySelector(`#spell-column-${targetListId} .sheet-containerspelllist`);

                    const newSpell = document.createElement('div');
                    newSpell.classList.add('sheet-container-single-spell');

                    const spellInput = document.createElement('input');
                    spellInput.type = 'text';
                    spellInput.placeholder = 'Nome da Magia';
                    
                    newSpell.appendChild(spellInput);
                    newSpell.appendChild(createRemoveButton(newSpell));
                    spellListContainer.appendChild(newSpell);
                });
            });

            // Ataques
            document.getElementById('add-attack').addEventListener('click', function() {
                const attacksList = document.getElementById('attacks-list');
                const newAttack = document.createElement('div');
                newAttack.classList.add('sheet-attacksgrid');
                newAttack.innerHTML = `
                    <input type="text" placeholder="Nome do Ataque">
                    <input type="text" value="0">
                    <input type="text" value="0">
                    <input type="text" value="0">
                    <div class="sheet-containercritico">
                        <input type="text" class="sheet-margem" value="20">
                        <span class="sheet-divisor"><b>/</b>x</span>
                        <input type="text" class="sheet-multiplicador" value="2">
                    </div>
                `;
                newAttack.appendChild(createRemoveButton(newAttack));
                attacksList.appendChild(newAttack);
            });

            // Proficiências
            document.getElementById('add-proficiency').addEventListener('click', function() {
                const proficienciesList = document.getElementById('proficiencies-list');
                const newProficiency = document.createElement('div');
                newProficiency.classList.add('proficiency-item');
                
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = 'Nova proficiência';

                newProficiency.appendChild(input);
                newProficiency.appendChild(createRemoveButton(newProficiency));
                proficienciesList.appendChild(newProficiency);
            });

            // Equipamentos
            document.getElementById('add-equipment').addEventListener('click', function() {
                const equipmentList = document.getElementById('equipment-list');
                const newEquipment = document.createElement('div');
                newEquipment.classList.add('sheet-grid-equipment');
                newEquipment.innerHTML = `
                    <input type="number" class="item-quantity" value="1" step="1" min="0">
                    <input type="text" placeholder="Nome do item">
                    <input type="number" class="item-weight" value="0" step="0.1" min="0">
                `;
                newEquipment.appendChild(createRemoveButton(newEquipment));
                equipmentList.appendChild(newEquipment);
                updateLoad(); // Atualiza a carga ao adicionar
            });
            
            // Adiciona listener para a lista de equipamentos para recalcular a carga
            document.getElementById('equipment-list').addEventListener('input', updateLoad);


            // Initial calculation on load
            updateAllSkills();
            updateDefense();
        });