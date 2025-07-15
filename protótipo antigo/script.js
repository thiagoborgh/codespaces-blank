document.querySelectorAll('.editable-card .edit-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.editable-card');
        const content = card.querySelector('.card-body');
        const cardContent = card.getAttribute('data-content');

        if (!content.classList.contains('editing')) {
            let originalContent = content.innerHTML;
            content.innerHTML = `
                <textarea class="form-control mb-2" rows="4">${originalContent}</textarea>
                <button class="btn btn-success save-btn">Salvar</button>
                <button class="btn btn-secondary cancel-btn">Cancelar</button>
            `;
            content.classList.add('editing');

            const saveBtn = content.querySelector('.save-btn');
            const cancelBtn = content.querySelector('.cancel-btn');

            saveBtn.addEventListener('click', function() {
                originalContent = content.querySelector('textarea').value;
                content.innerHTML = originalContent;
                content.classList.remove('editing');
                alert('As alterações de dados do município foram atualizadas com sucesso');
            });

            cancelBtn.addEventListener('click', function() {
                content.innerHTML = originalContent;
                content.classList.remove('editing');
            });
        }
    });
});

// Funcionalidade de tela cheia
document.getElementById('fullscreenToggle')?.addEventListener('click', function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Erro ao entrar em tela cheia: ${err.message}`);
        });
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
});

// Alternância de sidebar
document.getElementById('sidebarToggle')?.addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('collapsed');
});

// Gráficos
const ctxMeasurement = document.getElementById('measurementChart')?.getContext('2d');
if (ctxMeasurement) {
    new Chart(ctxMeasurement, {
        type: 'line',
        data: {
            labels: ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39'],
            datasets: [{
                label: 'Peso (kg)',
                data: [150, 140, 145, 148, 150, 148, 145, 142, 140, 138],
                borderColor: 'blue',
                fill: false
            }, {
                label: 'Altura (cm)',
                data: [150, 152, 153, 154, 155, 156, 157, 158, 159, 160],
                borderColor: 'green',
                fill: false
            }, {
                label: 'IMC (kg/m²)',
                data: [null, null, null, null, null, null, null, null, null, null],
                borderColor: 'red',
                fill: false
            }, {
                label: 'Perímetro cefálico (cm)',
                data: [26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5],
                borderColor: 'orange',
                fill: false
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

const ctxVitalSigns = document.getElementById('vitalSignsChart')?.getContext('2d');
if (ctxVitalSigns) {
    new Chart(ctxVitalSigns, {
        type: 'line',
        data: {
            labels: ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39'],
            datasets: [{
                label: 'Pressão arterial média (mmHg)',
                data: [120, 122, 125, 128, 130, 128, 125, 122, 120, 118],
                borderColor: 'blue',
                fill: false
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

const ctxGlycemia = document.getElementById('glycemiaChart')?.getContext('2d');
if (ctxGlycemia) {
    new Chart(ctxGlycemia, {
        type: 'line',
        data: {
            labels: ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39'],
            datasets: [{
                label: 'Glicemia (mg/dL)',
                data: [220, 225, 230, 235, 240, 235, 230, 225, 220, 215],
                borderColor: 'blue',
                fill: false
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

// Edição de células na tabela
document.querySelectorAll('.editable').forEach(cell => {
    cell.addEventListener('input', function() {
        this.addEventListener('blur', function() {
            alert('As alterações de dados do município foram atualizadas com sucesso');
        }, { once: true });
    });
});

// Funcionalidade para expandir/colapsar os formulários SOAP
document.querySelectorAll('.soap-row').forEach(row => {
    row.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-target');
        const targetForm = document.querySelector(targetId);
        if (!targetForm) return;

        const isCollapsed = targetForm.classList.contains('collapse') && !targetForm.classList.contains('show');

        // Fecha todos os formulários abertos
        document.querySelectorAll('.soap-form').forEach(form => {
            const bsCollapse = bootstrap.Collapse.getInstance(form);
            if (bsCollapse) bsCollapse.hide();
        });

        // Alterna o estado do formulário clicado
        if (isCollapsed) {
            const bsCollapse = new bootstrap.Collapse(targetForm, { toggle: true });
            bsCollapse.show();
        }

        // Adiciona funcionalidade de salvar e cancelar
        const saveBtn = targetForm.querySelector('.save-btn');
        const cancelBtn = targetForm.querySelector('.cancel-btn');

        // Intervenções e/ou procedimentos
        const addIntervencaoBtn = targetForm.querySelector('#add-intervencao-btn');
        const intervencoesList = targetForm.querySelector('#intervencoes-list');
        addIntervencaoBtn?.addEventListener('click', function() {
            const ciap2Select = targetForm.querySelector('#ciap2-select');
            if (ciap2Select && ciap2Select.value) {
                const now = new Date();
                const formattedDate = now.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                const item = document.createElement('div');
                item.className = 'card mb-2';
                item.style.backgroundColor = '#f0f0f0';
                item.innerHTML = `
                    <div class="card-body p-2 d-flex justify-content-between align-items-center">
                        <span>${ciap2Select.options[ciap2Select.selectedIndex].text}</span>
                        <div>
                            <span class="text-muted me-2">${formattedDate}</span>
                            <button class="btn btn-link text-danger btn-sm remove-intervencao">X</button>
                        </div>
                    </div>
                `;
                intervencoesList.appendChild(item);
                ciap2Select.value = '';
            }
        });
        intervencoesList?.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-intervencao')) {
                e.target.closest('.card').remove();
            }
        });

        // Prescrição de medicamentos
        const addMedicamentoBtn = targetForm.querySelector('#add-medicamento-btn');
        const medicamentosList = targetForm.querySelector('#medicamentos-list');
        addMedicamentoBtn?.addEventListener('click', function() {
            const medicamentoSearch = targetForm.querySelector('#medicamento-search');
            if (medicamentoSearch && medicamentoSearch.value.trim()) {
                const now = new Date();
                const formattedDate = now.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const row = medicamentosList.insertRow();
                row.innerHTML = `
                    <td>${medicamentoSearch.value}</td>
                    <td>1 cápsula de 50 mg a cada 8h</td>
                    <td>Normal</td>
                    <td>De ${formattedDate} a ${formattedDate}</td>
                    <td>${formattedDate}</td>
                    <td>Maria Assunção - Médica clínica</td>
                    <td>
                        <button class="btn btn-link text-primary btn-sm">Editar</button>
                        <button class="btn btn-link text-danger btn-sm remove-medicamento">X</button>
                    </td>
                `;
                medicamentoSearch.value = '';
            }
        });
        medicamentosList?.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-medicamento')) {
                e.target.closest('tr').remove();
            }
        });

        // Solicitação de exames
        const addExameBtn = targetForm.querySelector('#add-exame-btn');
        const examesList = targetForm.querySelector('#exames-list');
        addExameBtn?.addEventListener('click', function() {
            const exameSearch = targetForm.querySelector('#exame-search');
            if (exameSearch && exameSearch.value.trim()) {
                const now = new Date();
                const formattedDate = now.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const row = examesList.insertRow();
                row.innerHTML = `
                    <td>${exameSearch.value}</td>
                    <td>Alta</td>
                    <td>Comum</td>
                    <td>${formattedDate}</td>
                    <td>Maria Assunção - Médica clínica</td>
                    <td>
                        <button class="btn btn-link text-primary btn-sm">Editar</button>
                        <button class="btn btn-link text-danger btn-sm remove-exame">X</button>
                    </td>
                `;
                exameSearch.value = '';
            }
        });
        examesList?.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-exame')) {
                e.target.closest('tr').remove();
            }
        });

        // Atestados/Declarações
        const addAtestadoBtn = targetForm.querySelector('#add-atestado-btn');
        const addDeclaracaoBtn = targetForm.querySelector('#add-declaracao-btn');
        const atestadosList = targetForm.querySelector('#atestados-list');
        [addAtestadoBtn, addDeclaracaoBtn].forEach(btn => {
            btn?.addEventListener('click', function() {
                const atestadoSearch = targetForm.querySelector('#atestado-search');
                if (atestadoSearch && atestadoSearch.value.trim()) {
                    const now = new Date();
                    const formattedDate = now.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    const row = atestadosList.insertRow();
                    row.innerHTML = `
                        <td>${formattedDate}</td>
                        <td>${atestadoSearch.value}</td>
                        <td>Lorem ipsum</td>
                        <td>${btn.id === 'add-atestado-btn' ? 'Atestado' : 'Declaração'}</td>
                        <td>
                            <button class="btn btn-link text-primary btn-sm">Editar</button>
                            <button class="btn btn-link text-danger btn-sm remove-atestado">X</button>
                        </td>
                    `;
                    atestadoSearch.value = '';
                }
            });
        });
        atestadosList?.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-atestado')) {
                e.target.closest('tr').remove();
            }
        });

        // Orientações
        const addOrientacaoBtn = targetForm.querySelector('#add-orientacao-btn');
        const orientacoesList = targetForm.querySelector('#orientacoes-list');
        addOrientacaoBtn?.addEventListener('click', function() {
            const orientacoesText = targetForm.querySelector('#orientacoes-text');
            if (orientacoesText && orientacoesText.value.trim()) {
                const now = new Date();
                const formattedDate = now.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                const row = orientacoesList.insertRow();
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>Maria Assunção - Médica clínica</td>
                    <td>${orientacoesText.value}</td>
                    <td>
                        <button class="btn btn-link text-primary btn-sm">Editar</button>
                        <button class="btn btn-link text-danger btn-sm remove-orientacao">X</button>
                    </td>
                `;
                orientacoesText.value = '';
            }
        });
        orientacoesList?.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-orientacao')) {
                e.target.closest('tr').remove();
            }
        });

        // Encaminhamentos
        const addEncaminhamentoBtn = targetForm.querySelector('#add-encaminhamento-btn');
        const encaminhamentosList = targetForm.querySelector('#encaminhamentos-list');
        addEncaminhamentoBtn?.addEventListener('click', function() {
            const encaminhamentoSearch = targetForm.querySelector('#encaminhamento-search');
            const especialidadeSearch = targetForm.querySelector('#especialidade-search');
            if ((encaminhamentoSearch && encaminhamentoSearch.value.trim()) || (especialidadeSearch && especialidadeSearch.value.trim())) {
                const now = new Date();
                const formattedDate = now.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const row = encaminhamentosList.insertRow();
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>Emergência</td>
                    <td>Serviço especializado</td>
                    <td>
                        <button class="btn btn-link text-primary btn-sm">Editar</button>
                        <button class="btn btn-link text-danger btn-sm remove-encaminhamento">X</button>
                    </td>
                `;
                encaminhamentoSearch.value = '';
                especialidadeSearch.value = '';
            }
        });
        encaminhamentosList?.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-encaminhamento')) {
                e.target.closest('tr').remove();
            }
        });

        // Compartilhamento de cuidado
        const addCompartilhamentoBtn = targetForm.querySelector('#add-compartilhamento-btn');
        const compartilhamentosList = targetForm.querySelector('#compartilhamentos-list');
        addCompartilhamentoBtn?.addEventListener('click', function() {
            const compartilhamentoSearch = targetForm.querySelector('#compartilhamento-search');
            if (compartilhamentoSearch && compartilhamentoSearch.value.trim()) {
                const now = new Date();
                const formattedDate = now.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const row = compartilhamentosList.insertRow();
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>Alta</td>
                    <td>${compartilhamentoSearch.value}</td>
                    <td>
                        <button class="btn btn-link text-primary btn-sm">Visualizar</button>
                    </td>
                `;
                compartilhamentoSearch.value = '';
            }
        });

        saveBtn?.addEventListener('click', function() {
            alert('As alterações de dados do municipe foram atualizadas com sucesso');
            targetForm.classList.remove('show');
            const inputs = targetForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => input.value = '');
            const lists = [intervencoesList, medicamentosList, examesList, atestadosList, orientacoesList, encaminhamentosList, compartilhamentosList];
            lists.forEach(list => {
                if (list && list.tagName === 'TBODY') list.innerHTML = '';
                else if (list) list.innerHTML = '';
            });
            const checkboxes = targetForm.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = false);
        });

        cancelBtn?.addEventListener('click', function() {
            const bsCollapse = bootstrap.Collapse.getInstance(targetForm);
            if (bsCollapse) bsCollapse.hide();
            const inputs = targetForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => input.value = '');
            const lists = [intervencoesList, medicamentosList, examesList, atestadosList, orientacoesList, encaminhamentosList, compartilhamentosList];
            lists.forEach(list => {
                if (list && list.tagName === 'TBODY') list.innerHTML = '';
                else if (list) list.innerHTML = '';
            });
            const checkboxes = targetForm.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = false);
        });
    });
});

// Funcionalidade para alternar entre abas
document.querySelectorAll('.nav-tabs .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const tabList = this.closest('.nav-tabs');
        if (tabList) {
            tabList.querySelectorAll('.nav-link').forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
        }
        const tabId = this.getAttribute('href').substring(1);
        const tabPane = document.querySelector(`#${tabId}`);
        if (tabPane) {
            tabPane.parentElement.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('show', 'active'));
            tabPane.classList.add('show', 'active');
        }
    });
});
// Funcionalidade para expandir/colapsar os formulários SOAP
document.querySelectorAll('.soap-row').forEach(row => {
    row.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-target');
        const targetForm = document.querySelector(targetId);
        if (!targetForm) return;

        const isCollapsed = targetForm.classList.contains('collapse') && !targetForm.classList.contains('show');

        // Fecha todos os formulários abertos
        document.querySelectorAll('.soap-form').forEach(form => {
            const bsCollapse = bootstrap.Collapse.getInstance(form);
            if (bsCollapse) bsCollapse.hide();
        });

        // Alterna o estado do formulário clicado
        if (isCollapsed) {
            const bsCollapse = new bootstrap.Collapse(targetForm, { toggle: true });
            bsCollapse.show();
        }

        // Adiciona funcionalidade de salvar e cancelar para Finalização
        const saveBtn = targetForm.querySelector('.save-btn');
        const cancelBtn = targetForm.querySelector('.cancel-btn');
        const imprimirBtn = targetForm.querySelector('#imprimir-atendimento');

        saveBtn?.addEventListener('click', function() {
            const observacoes = targetForm.querySelector('#observacoes-finalizacao').value.trim();
            const chaveImpressao = targetForm.querySelector('#chave-impressao').value.trim();
            if (observacoes || chaveImpressao || Array.from(targetForm.querySelectorAll('input[type="checkbox"]:checked')).length > 0) {
                alert('As alterações de finalização foram salvas com sucesso');
                targetForm.classList.remove('show');
                targetForm.querySelector('#observacoes-finalizacao').value = '';
                targetForm.querySelector('#chave-impressao').value = '';
                targetForm.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
            } else {
                alert('Por favor, preencha pelo menos um campo ou marque uma opção.');
            }
        });

        cancelBtn?.addEventListener('click', function() {
            const bsCollapse = bootstrap.Collapse.getInstance(targetForm);
            if (bsCollapse) bsCollapse.hide();
            targetForm.querySelector('#observacoes-finalizacao').value = '';
            targetForm.querySelector('#chave-impressao').value = '';
            targetForm.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
        });

        imprimirBtn?.addEventListener('click', function() {
            const chaveImpressao = targetForm.querySelector('#chave-impressao').value.trim();
            if (chaveImpressao) {
                alert(`Imprimindo atendimento com chave: ${chaveImpressao}`);
                // Placeholder para funcionalidade de impressão (pode ser expandido com window.print() ou API)
            } else {
                alert('Por favor, insira a chave de impressão.');
            }
        });
    });
});
