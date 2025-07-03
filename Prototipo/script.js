document.addEventListener('DOMContentLoaded', () => {
    const addCitizenBtn = document.getElementById('addCitizenBtn');
    const addCitizenSection = document.getElementById('addCitizenSection');
    const clearFields = document.getElementById('clearFields');
    const addCitizenConfirm = document.getElementById('addCitizenConfirm');
    const filterBtn = document.getElementById('filterBtn');
    const filterModal = document.getElementById('filterModal');
    const closeFilter = document.getElementById('closeFilter');
    const resetFilterModal = document.getElementById('resetFilterModal');
    const applyFilter = document.getElementById('applyFilter');
    const searchTerm = document.getElementById('searchTerm');
    const showMyAttendances = document.getElementById('showMyAttendances');
    const sortBy = document.getElementById('sortBy');
    const attendanceTableBody = document.getElementById('attendanceTableBody');
    const initialListeningBtns = document.querySelectorAll('.initial-listening-btn');
    const attendBtns = document.querySelectorAll('.attend-btn');
    const moreOptionsBtns = document.querySelectorAll('.more-options-btn');
    const initialListeningDetails = document.getElementById('initialListeningDetails');
    const finalizeListening = document.getElementById('finalizeListening');
    const cancelListening = document.getElementById('cancelListening');
    const saveListening = document.getElementById('saveListening');
    const backToList = document.getElementById('backToList');

    // Add Citizen Section
    addCitizenBtn?.addEventListener('click', () => {
        const isCollapsed = addCitizenSection.classList.contains('show');
        addCitizenSection.classList.toggle('show');
        addCitizenBtn.textContent = isCollapsed ? 'Adicionar Cidadão' : 'Cancelar Adição';
    });

    clearFields?.addEventListener('click', () => {
        document.getElementById('citizenSearch').value = '';
        document.getElementById('professional').value = '';
        document.getElementById('team').value = '';
        document.querySelectorAll('input[type="checkbox"][id^="service"]').forEach(cb => cb.checked = false);
    });

    addCitizenConfirm?.addEventListener('click', () => {
        if (document.getElementById('citizenSearch').value) {
            const services = Array.from(document.querySelectorAll('input[id^="service"]:checked')).map(cb => cb.value).join(', ');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><span class="badge bg-success" data-status="Aguardando atendimento">Aguardando atendimento</span></td>
                <td>${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                <td>${document.getElementById('citizenSearch').value}</td>
                <td>0a 0m 0d</td>
                <td><span class="badge bg-info" data-service="${services || 'Nenhum'}">${services || 'Nenhum'}</span></td>
                <td></td>
                <td>${document.getElementById('professional').value || ''}</td>
                <td>
                    <button class="btn btn-sm btn-primary initial-listening-btn" data-tooltip="Realizar escuta inicial">Escuta Inicial</button>
                    <button class="btn btn-sm btn-secondary attend-btn" data-tooltip="Atender">Atender</button>
                    <button class="btn btn-sm btn-info more-options-btn" data-tooltip="Mais opções">Mais Opções</button>
                </td>
            `;
            attendanceTableBody.appendChild(newRow);
            addCitizenSection.classList.remove('show');
            addCitizenBtn.textContent = 'Adicionar Cidadão';
            alert('✅ Cidadão foi adicionado com sucesso');
        }
    });

    // Filter Modal
    filterBtn?.addEventListener('click', () => {
        new bootstrap.Modal(filterModal).show();
    });

    closeFilter?.addEventListener('click', () => {
        bootstrap.Modal.getInstance(filterModal).hide();
    });

    resetFilterModal?.addEventListener('click', () => {
        document.getElementById('statusWaiting').checked = true;
        document.getElementById('statusInService').checked = true;
        document.getElementById('statusInitial').checked = true;
        document.getElementById('periodStart').value = '2025-06-25';
        document.getElementById('periodEnd').value = '2025-06-25';
        document.getElementById('onlyUnfinished').checked = false;
        document.querySelectorAll('input[id^="serviceType"], input[id^="team"], input[id^="professional"]').forEach(cb => cb.checked = false);
    });

    applyFilter?.addEventListener('click', () => {
        const selectedStatuses = Array.from(document.querySelectorAll('input[id^="status"]:checked')).map(cb => cb.nextElementSibling.textContent);
        const selectedPeriodStart = document.getElementById('periodStart').value;
        const selectedPeriodEnd = document.getElementById('periodEnd').value;
        const selectedServiceTypes = Array.from(document.querySelectorAll('input[id^="serviceType"]:checked')).map(cb => cb.value);
        const selectedTeams = Array.from(document.querySelectorAll('input[id^="team"]:checked')).map(cb => cb.value);
        const selectedProfessionals = Array.from(document.querySelectorAll('input[id^="professional"]:checked')).map(cb => cb.value);
        const onlyUnfinished = document.getElementById('onlyUnfinished').checked;

        attendanceTableBody.innerHTML = '';
        document.querySelectorAll('table tr').forEach(row => {
            const status = row.querySelector('td span[data-status]')?.getAttribute('data-status');
            const service = row.querySelector('td span[data-service]')?.getAttribute('data-service');
            const professional = row.querySelector('td:nth-child(7)')?.textContent;
            const time = row.querySelector('td:nth-child(2)')?.textContent;
            const matchesStatus = selectedStatuses.includes(status);
            const matchesService = selectedServiceTypes.length === 0 || selectedServiceTypes.includes(service);
            const matchesProfessional = selectedProfessionals.length === 0 || selectedProfessionals.includes(professional);
            const matchesTeam = selectedTeams.length === 0; // Placeholder, adjust if team data is added
            const matchesPeriod = new Date(time) >= new Date(selectedPeriodStart) && new Date(time) <= new Date(selectedPeriodEnd);
            const matchesUnfinished = !onlyUnfinished || !['Atendimento realizado'].includes(status);

            if (matchesStatus && matchesService && matchesProfessional && matchesTeam && matchesPeriod && matchesUnfinished) {
                attendanceTableBody.appendChild(row.cloneNode(true));
            }
        });
        bootstrap.Modal.getInstance(filterModal).hide();
    });

    // Show My Attendances
    showMyAttendances?.addEventListener('change', () => {
        if (showMyAttendances.checked) {
            const currentUser = 'Maria Oliveira'; // Placeholder for current logged-in user
            attendanceTableBody.innerHTML = '';
            document.querySelectorAll('table tr').forEach(row => {
                const professional = row.querySelector('td:nth-child(7)')?.textContent;
                if (professional === currentUser) {
                    attendanceTableBody.appendChild(row.cloneNode(true));
                }
            });
        } else {
            attendanceTableBody.innerHTML = '';
            document.querySelectorAll('table tr').forEach(row => attendanceTableBody.appendChild(row.cloneNode(true)));
        }
    });

    // Sort By
    sortBy?.addEventListener('change', () => {
        const rows = Array.from(attendanceTableBody.querySelectorAll('tr'));
        rows.sort((a, b) => {
            const aTime = a.querySelector('td:nth-child(2)')?.textContent;
            const bTime = b.querySelector('td:nth-child(2)')?.textContent;
            const aRisk = a.querySelector('td span[data-vulnerability]')?.getAttribute('data-vulnerability') || 'Baixa';
            const bRisk = b.querySelector('td span[data-vulnerability]')?.getAttribute('data-vulnerability') || 'Baixa';
            if (sortBy.value === 'arrival') {
                return new Date(`2025-06-25 ${aTime}`) - new Date(`2025-06-25 ${bTime}`);
            } else if (sortBy.value === 'risk') {
                const riskOrder = { Alta: 3, Média: 2, Baixa: 1 };
                return riskOrder[bRisk] - riskOrder[aRisk];
            }
        });
        rows.forEach(row => attendanceTableBody.appendChild(row));
    });

    // Search
    searchTerm?.addEventListener('input', () => {
        const term = searchTerm.value.toLowerCase();
        attendanceTableBody.innerHTML = '';
        document.querySelectorAll('table tr').forEach(row => {
            const name = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase();
            if (name.includes(term)) {
                attendanceTableBody.appendChild(row.cloneNode(true));
            }
        });
    });

    // Initial Listening Buttons
    initialListeningBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const status = btn.closest('tr').querySelector('td span[data-status]')?.getAttribute('data-status');
            if (status === 'Aguardando atendimento') {
                const citizenName = btn.closest('tr').querySelector('td:nth-child(3)')?.textContent;
                const soapRow = document.querySelector('.initial-listening-section .soap-row');
                if (soapRow && citizenName && initialListeningDetails) {
                    soapRow.textContent = `Escuta Inicial - ${citizenName}`;
                    soapRow.appendChild(document.createElement('span')).className = 'bi bi-chevron-down';
                    initialListeningDetails.querySelector('p:nth-child(2)').textContent = citizenName; // Nome
                    initialListeningDetails.querySelector('p:nth-child(6)').textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // Horário
                    initialListeningDetails.classList.add('show');
                    soapRow.click(); // Expand the section
                }
            } else if (status === 'Em atendimento') {
                btn.setAttribute('data-tooltip', 'O cidadão ainda não fez escuta inicial');
            } else {
                btn.setAttribute('data-tooltip', 'Cidadão sem escuta inicial');
            }
        });
    });

    // Attend Buttons
    attendBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const status = btn.closest('tr').querySelector('td span[data-status]')?.getAttribute('data-status');
            if (status === 'Aguardando atendimento') {
                alert('Redirecionando para página de Atendimento');
            } else if (status === 'Em atendimento') {
                btn.setAttribute('data-tooltip', 'Continuar atendimento');
            } else {
                btn.setAttribute('data-tooltip', 'Atendimento realizado');
            }
        });
    });

    // More Options Buttons
    moreOptionsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const status = btn.closest('tr').querySelector('td span[data-status]')?.getAttribute('data-status');
            let options = '';
            if (status === 'Aguardando atendimento') {
                options = 'Cidadão não aguardou\nGerar declaração de comparecimento\nVisualizar prontuário\nEditar';
            } else if (status === 'Em atendimento') {
                options = 'Gerar declaração de comparecimento\nVisualizar prontuário';
            } else if (status === 'Atendimento realizado') {
                options = 'Gerar declaração de comparecimento\nVisualizar prontuário\nVisualizar atendimentos do dia';
            } else if (status === 'Não aguardou') {
                options = 'Cidadão retornou\nGerar declaração de comparecimento\nVisualizar prontuário';
            }
            alert(`Opções disponíveis:\n${options}`);
        });
    });

    // Sidebar toggle for mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Populate patient data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const citizenName = urlParams.get('citizen');
    const arrivalTime = urlParams.get('time');
    if (citizenName && arrivalTime) {
        const cardBody = document.querySelector('.card-body');
        if (cardBody) {
            const nameField = cardBody.querySelector('p:nth-child(2) strong');
            const arrivalField = cardBody.querySelector('p:nth-child(6)');
            const professionalField = cardBody.querySelector('p:nth-child(12)');
            if (nameField) nameField.textContent = citizenName;
            if (arrivalField) arrivalField.textContent = `Horário de Chegada: ${arrivalTime}`;
            if (professionalField) professionalField.textContent = `Profissional Responsável: Maria Oliveira`;
        }
    }

    // Save Listening
    saveListening?.addEventListener('click', () => {
        const ciap = document.getElementById('ciap');
        const vulnerability = document.getElementById('vulnerability');
        if (ciap?.value && vulnerability?.value) {
            const citizenRow = Array.from(document.querySelectorAll('#attendanceTableBody tr')).find(row =>
                row.querySelector('td:nth-child(3)')?.textContent === citizenName
            );
            if (citizenRow) {
                const statusSpan = citizenRow.querySelector('td span[data-status]');
                const vulnerabilitySpan = citizenRow.querySelector('td span[data-vulnerability]');
                if (statusSpan) {
                    statusSpan.setAttribute('data-status', 'Em escuta inicial');
                    statusSpan.className = 'badge bg-pink';
                    statusSpan.textContent = 'Em escuta inicial';
                }
                if (vulnerabilitySpan) {
                    vulnerabilitySpan.setAttribute('data-vulnerability', vulnerability.value);
                    vulnerabilitySpan.textContent = vulnerability.value;
                }
                window.location.href = 'index.html';
                alert('✅ Escuta inicial salva com sucesso');
            }
        } else {
            alert('Por favor, preencha os campos obrigatórios (CIAP e Classificação de Vulnerabilidade).');
        }
    });

    // Back to List
    backToList?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            sidebar.classList.toggle('d-none');
            const mainContent = document.getElementById('mainContent');
            if (mainContent) {
                mainContent.classList.toggle('col-md-12');
                mainContent.classList.toggle('col-lg-12');
            }
        });
    }

    // Toggle sidebar
    document.getElementById('sidebarToggle').addEventListener('click', function() {
        const sidebar = document.querySelector('nav');
        sidebar.classList.toggle('hidden');
        if (!sidebar.classList.contains('hidden')) {
            document.querySelector('div.flex-1').classList.add('ml-64');
        } else {
            document.querySelector('div.flex-1').classList.remove('ml-64');
        }
    });

    // Abrir seção de adicionar cidadão
    document.getElementById('addCitizenBtn').addEventListener('click', function() {
        const addCitizenSection = new bootstrap.Collapse(document.getElementById('addCitizenSection'), { toggle: true });
        document.getElementById('citizenSearch').focus();
    });

    // Simulação de busca de paciente
    document.getElementById('citizenSearch').addEventListener('input', function() {
        const searchResult = document.getElementById('searchResult');
        const addNewCitizenBtn = document.getElementById('addNewCitizenBtn');
        const value = this.value.toLowerCase();
        
        if (value.length > 2) {
            if (value !== 'maria') {
                searchResult.textContent = 'Nenhum resultado encontrado. Clique em "Adicionar Novo" para cadastrar.';
                addNewCitizenBtn.style.display = 'inline-block'; // Exibe o botão quando não encontra
                addNewCitizenBtn.style.visibility = 'visible';
            } else {
                searchResult.textContent = 'Resultado encontrado: Maria Antoinieta.';
                addNewCitizenBtn.style.display = 'none';
            }
        } else {
            searchResult.textContent = 'Digite pelo menos 3 caracteres para buscar.';
            addNewCitizenBtn.style.display = 'inline-block';
            addNewCitizenBtn.style.visibility = 'visible';
        }
    });

    // Abrir formulário de novo cidadão
    document.getElementById('addNewCitizenBtn').addEventListener('click', function() {
        const newCitizenForm = new bootstrap.Collapse(document.getElementById('newCitizenForm'), { toggle: true });
        document.getElementById('citizenSearch').value = '';
        document.getElementById('searchResult').textContent = 'Preencha os dados do novo cidadão.';
        
        // Ocultar campos quando inserir novo cidadão
        const appointmentDateField = document.getElementById('appointmentDate').closest('.mb-3');
        if (appointmentDateField) {
            appointmentDateField.style.display = 'none';
        }
        
        const professionalField = document.getElementById('professional').closest('.mb-3');
        if (professionalField) {
            professionalField.style.display = 'none';
        }
        
        const teamField = document.getElementById('team').closest('.mb-3');
        if (teamField) {
            teamField.style.display = 'none';
        }
        
        // Ocultar toda a seção de Tipo de Serviço
        const serviceTypeSectionElements = document.querySelectorAll('.mb-3');
        serviceTypeSectionElements.forEach(section => {
            const label = section.querySelector('label.form-label');
            if (label && label.textContent.trim() === 'Tipo de Serviço') {
                section.style.display = 'none';
            }
        });
        
        // Ocultar botões padrão e mostrar botões do novo cidadão
        const defaultButtons = document.getElementById('defaultButtons');
        const newCitizenButtons = document.getElementById('newCitizenButtons');
        if (defaultButtons) defaultButtons.style.display = 'none';
        if (newCitizenButtons) newCitizenButtons.style.display = 'flex';
        
        // Garantir que os campos estejam limpos e habilitados
        document.getElementById('newCitizenName').value = '';
        document.getElementById('newCitizenCPF').value = '';
        document.getElementById('newCitizenCNS').value = '';
        document.getElementById('newCitizenRace').value = '';
        document.getElementById('newCitizenBirthDate').value = '';
        document.getElementById('newCitizenSex').value = '';
        document.getElementById('newCitizenMother').value = '';
        document.getElementById('unknownMotherToggle').textContent = 'Desconhecido';
        document.getElementById('newCitizenMother').disabled = true;
        document.getElementById('newCitizenFather').value = '';
        document.getElementById('unknownFatherToggle').textContent = 'Desconhecido';
        document.getElementById('newCitizenFather').disabled = true;
        document.getElementById('newCitizenNationality').value = '';
        document.getElementById('newCitizenBirthState').value = '';
        document.getElementById('newCitizenPhone').value = '';
        document.getElementById('newCitizenContactPhone').value = '';
        document.getElementById('newCitizenCEP').value = '';
        document.getElementById('newCitizenStreetType').value = '';
        document.getElementById('newCitizenStreet').value = '';
        document.getElementById('newCitizenNumber').value = '';
        document.getElementById('newCitizenNeighborhood').value = '';
    });

    // Gerenciar campo Nome da Mãe
    document.getElementById('unknownMotherToggle').addEventListener('click', function() {
        const input = document.getElementById('newCitizenMother');
        const isUnknown = input.disabled;
        input.disabled = !isUnknown;
        if (!isUnknown) {
            input.value = '';
            this.textContent = 'Conhecido';
        } else {
            this.textContent = 'Desconhecido';
        }
    });

    // Gerenciar campo Nome do Pai
    document.getElementById('unknownFatherToggle').addEventListener('click', function() {
        const input = document.getElementById('newCitizenFather');
        const isUnknown = input.disabled;
        input.disabled = !isUnknown;
        if (!isUnknown) {
            input.value = '';
            this.textContent = 'Conhecido';
        } else {
            this.textContent = 'Desconhecido';
        }
    });

    // Limpar campos
    document.getElementById('clearFields').addEventListener('click', function() {
        document.getElementById('citizenSearch').value = '';
        document.getElementById('appointmentDate').value = '2025-06-27';
        document.getElementById('professional').value = '';
        document.getElementById('team').value = '';
        document.querySelectorAll('#addCitizenSection input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
        document.getElementById('newCitizenForm').classList.remove('show');
        
        // Mostrar novamente todos os campos ocultados
        const appointmentDateField = document.getElementById('appointmentDate').closest('.mb-3');
        if (appointmentDateField) {
            appointmentDateField.style.display = 'block';
        }
        
        const professionalField = document.getElementById('professional').closest('.mb-3');
        if (professionalField) {
            professionalField.style.display = 'block';
        }
        
        const teamField = document.getElementById('team').closest('.mb-3');
        if (teamField) {
            teamField.style.display = 'block';
        }
        
        // Mostrar novamente a seção de Tipo de Serviço
        const serviceTypeSectionElementsClear = document.querySelectorAll('.mb-3');
        serviceTypeSectionElementsClear.forEach(section => {
            const label = section.querySelector('label.form-label');
            if (label && label.textContent.trim() === 'Tipo de Serviço') {
                section.style.display = 'block';
            }
        });
        
        // Mostrar botões padrão e ocultar botões do novo cidadão
        const defaultButtons = document.getElementById('defaultButtons');
        const newCitizenButtons = document.getElementById('newCitizenButtons');
        if (defaultButtons) defaultButtons.style.display = 'block';
        if (newCitizenButtons) newCitizenButtons.style.display = 'none';
        
        document.getElementById('newCitizenName').value = '';
        document.getElementById('newCitizenCPF').value = '';
        document.getElementById('newCitizenCNS').value = '';
        document.getElementById('newCitizenRace').value = '';
        document.getElementById('newCitizenBirthDate').value = '';
        document.getElementById('newCitizenSex').value = '';
        document.getElementById('newCitizenMother').value = '';
        document.getElementById('unknownMotherToggle').textContent = 'Desconhecido';
        document.getElementById('newCitizenMother').disabled = true;
        document.getElementById('newCitizenFather').value = '';
        document.getElementById('unknownFatherToggle').textContent = 'Desconhecido';
        document.getElementById('newCitizenFather').disabled = true;
        document.getElementById('newCitizenNationality').value = '';
        document.getElementById('newCitizenBirthState').value = '';
        document.getElementById('newCitizenPhone').value = '';
        document.getElementById('newCitizenContactPhone').value = '';
        document.getElementById('newCitizenCEP').value = '';
        document.getElementById('newCitizenStreetType').value = '';
        document.getElementById('newCitizenStreet').value = '';
        document.getElementById('newCitizenNumber').value = '';
        document.getElementById('newCitizenNeighborhood').value = '';
        document.getElementById('searchResult').textContent = 'Digite pelo menos 3 caracteres para buscar.';
        document.getElementById('addNewCitizenBtn').style.display = 'none';
    });

    // Adicionar cidadão
    document.getElementById('addCitizenConfirm').addEventListener('click', function() {
        const citizenSearch = document.getElementById('citizenSearch').value.trim();
        const newCitizenName = document.getElementById('newCitizenName').value;
        const newCitizenCPF = document.getElementById('newCitizenCPF').value;
        const newCitizenCNS = document.getElementById('newCitizenCNS').value;
        const newCitizenRace = document.getElementById('newCitizenRace').value;
        const newCitizenBirthDate = document.getElementById('newCitizenBirthDate').value;
        const newCitizenSex = document.getElementById('newCitizenSex').value;
        const newCitizenNationality = document.getElementById('newCitizenNationality').value;
        const newCitizenBirthState = document.getElementById('newCitizenBirthState').value;
        const newCitizenPhone = document.getElementById('newCitizenPhone').value;
        const newCitizenContactPhone = document.getElementById('newCitizenContactPhone').value;
        const newCitizenCEP = document.getElementById('newCitizenCEP').value;
        const newCitizenStreetType = document.getElementById('newCitizenStreetType').value;
        const newCitizenStreet = document.getElementById('newCitizenStreet').value;
        const newCitizenNumber = document.getElementById('newCitizenNumber').value;
        const newCitizenNeighborhood = document.getElementById('newCitizenNeighborhood').value;

        if (citizenSearch || (newCitizenName && (newCitizenCPF || newCitizenCNS) && newCitizenRace && newCitizenBirthDate && newCitizenSex && newCitizenNationality && newCitizenBirthState && newCitizenPhone && newCitizenContactPhone && newCitizenCEP && newCitizenStreetType && newCitizenStreet && newCitizenNumber && newCitizenNeighborhood)) {
            alert('✅ Cidadão adicionado com sucesso');
            const table = document.querySelector('.attendance-list table tbody');
            const row = table.insertRow();
            row.innerHTML = `<td class="p-2"><span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Aguardando</span></td><td class="p-2">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td><td class="p-2">${citizenSearch || newCitizenName}</td><td class="p-2">-</td><td class="p-2"><span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${Array.from(document.querySelectorAll('#addCitizenSection input[type="checkbox"]:checked')).map(cb => cb.nextElementSibling.textContent.trim()).join(', ')}</span></td><td class="p-2">-</td><td class="p-2">${document.getElementById('professional').value || '-'}</td><td class="p-2"><button class="text-blue-600 hover:underline">Atender</button></td>`;
            document.getElementById('addCitizenSection').classList.remove('show');
            document.getElementById('citizenSearch').value = '';
            document.getElementById('newCitizenForm').classList.remove('show');
            
            // Mostrar novamente todos os campos após adicionar cidadão
            const appointmentDateField = document.getElementById('appointmentDate').closest('.mb-3');
            if (appointmentDateField) {
                appointmentDateField.style.display = 'block';
            }
            
            const professionalField = document.getElementById('professional').closest('.mb-3');
            if (professionalField) {
                professionalField.style.display = 'block';
            }
            
            const teamField = document.getElementById('team').closest('.mb-3');
            if (teamField) {
                teamField.style.display = 'block';
            }
            
            // Mostrar novamente a seção de Tipo de Serviço
            const serviceTypeSectionElementsConfirm = document.querySelectorAll('.mb-3');
            serviceTypeSectionElementsConfirm.forEach(section => {
                const label = section.querySelector('label.form-label');
                if (label && label.textContent.trim() === 'Tipo de Serviço') {
                    section.style.display = 'block';
                }
            });
        } else {
            alert('Erro: Preencha todos os campos obrigatórios.');
        }
    });

    // Botão Cancelar novo cidadão
    document.getElementById('cancelNewCitizen')?.addEventListener('click', function() {
        // Fechar formulário de novo cidadão
        document.getElementById('newCitizenForm').classList.remove('show');
        
        // Restaurar campos ocultados
        const appointmentDateField = document.getElementById('appointmentDate').closest('.mb-3');
        if (appointmentDateField) {
            appointmentDateField.style.display = 'block';
        }
        
        const professionalField = document.getElementById('professional').closest('.mb-3');
        if (professionalField) {
            professionalField.style.display = 'block';
        }
        
        const teamField = document.getElementById('team').closest('.mb-3');
        if (teamField) {
            teamField.style.display = 'block';
        }
        
        const serviceTypeSectionElementsCancel = document.querySelectorAll('.mb-3');
        serviceTypeSectionElementsCancel.forEach(section => {
            const label = section.querySelector('label.form-label');
            if (label && label.textContent.trim() === 'Tipo de Serviço') {
                section.style.display = 'block';
            }
        });
        
        // Mostrar botões padrão e ocultar botões do novo cidadão
        const defaultButtons = document.getElementById('defaultButtons');
        const newCitizenButtons = document.getElementById('newCitizenButtons');
        if (defaultButtons) defaultButtons.style.display = 'block';
        if (newCitizenButtons) newCitizenButtons.style.display = 'none';
        
        // Limpar formulário
        document.getElementById('citizenSearch').value = '';
        document.getElementById('searchResult').textContent = 'Digite pelo menos 3 caracteres para buscar.';
        document.getElementById('addNewCitizenBtn').style.display = 'inline-block';
        document.getElementById('addNewCitizenBtn').style.visibility = 'visible';
    });

    // Botão Salvar novo cidadão
    document.getElementById('saveNewCitizen')?.addEventListener('click', function() {
        const newCitizenName = document.getElementById('newCitizenName').value;
        const newCitizenCPF = document.getElementById('newCitizenCPF').value;
        const newCitizenCNS = document.getElementById('newCitizenCNS').value;
        
        if (newCitizenName && (newCitizenCPF || newCitizenCNS)) {
            alert('✅ Cidadão salvo com sucesso no cadastro');
            
            // Fechar formulário e restaurar interface
            document.getElementById('cancelNewCitizen').click();
        } else {
            alert('Erro: Preencha pelo menos o Nome e CPF ou CNS.');
        }
    });

    // Botão Salvar e Inserir na Fila
    document.getElementById('saveAndAddToQueue')?.addEventListener('click', function() {
        const newCitizenName = document.getElementById('newCitizenName').value;
        const newCitizenCPF = document.getElementById('newCitizenCPF').value;
        const newCitizenCNS = document.getElementById('newCitizenCNS').value;
        
        if (newCitizenName && (newCitizenCPF || newCitizenCNS)) {
            alert('✅ Cidadão salvo e adicionado à fila de atendimento');
            
            // Adicionar à tabela
            const table = document.querySelector('.attendance-list table tbody');
            if (table) {
                const row = table.insertRow();
                row.innerHTML = `<td class="p-2"><span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Aguardando</span></td><td class="p-2">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td><td class="p-2">${newCitizenName}</td><td class="p-2">-</td><td class="p-2"><span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">-</span></td><td class="p-2">-</td><td class="p-2">-</td><td class="p-2"><button class="text-blue-600 hover:underline">Atender</button></td>`;
            }
            
            // Fechar formulário e restaurar interface
            document.getElementById('cancelNewCitizen').click();
            document.getElementById('addCitizenSection').classList.remove('show');
        } else {
            alert('Erro: Preencha pelo menos o Nome e CPF ou CNS.');
        }
    });
});

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

document.querySelectorAll('.initial-listening-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = '/Prototipo/escutaInicial.html';
    });
});

// Toggle sidebar
document.getElementById('sidebarToggle').addEventListener('click', function() {
    const sidebar = document.querySelector('nav');
    sidebar.classList.toggle('hidden');
    if (!sidebar.classList.contains('hidden')) {
        document.querySelector('div.flex-1').classList.add('ml-64');
    } else {
        document.querySelector('div.flex-1').classList.remove('ml-64');
    }
});

// Abrir seção de adicionar cidadão
document.getElementById('addCitizenBtn').addEventListener('click', function() {
    const addCitizenSection = new bootstrap.Collapse(document.getElementById('addCitizenSection'), { toggle: true });
    document.getElementById('citizenSearch').focus();
});

// Simulação de busca de paciente
document.getElementById('citizenSearch').addEventListener('input', function() {
    const searchResult = document.getElementById('searchResult');
    const addNewCitizenBtn = document.getElementById('addNewCitizenBtn');
    const value = this.value.toLowerCase();
    
    if (value.length > 2) {
        if (value !== 'maria') {
            searchResult.textContent = 'Nenhum resultado encontrado. Clique em "Adicionar Novo" para cadastrar.';
            addNewCitizenBtn.style.display = 'inline-block'; // Exibe o botão quando não encontra
            addNewCitizenBtn.style.visibility = 'visible';
        } else {
            searchResult.textContent = 'Resultado encontrado: Maria Antoinieta.';
            addNewCitizenBtn.style.display = 'none';
        }
    } else {
        searchResult.textContent = 'Digite pelo menos 3 caracteres para buscar.';
        addNewCitizenBtn.style.display = 'inline-block';
        addNewCitizenBtn.style.visibility = 'visible';
    }
});

// Abrir formulário de novo cidadão
document.getElementById('addNewCitizenBtn').addEventListener('click', function() {
    const newCitizenForm = new bootstrap.Collapse(document.getElementById('newCitizenForm'), { toggle: true });
    document.getElementById('citizenSearch').value = '';
    document.getElementById('searchResult').textContent = 'Preencha os dados do novo cidadão.';
    
    // Ocultar campos quando inserir novo cidadão
    const appointmentDateField = document.getElementById('appointmentDate').closest('.mb-3');
    if (appointmentDateField) {
        appointmentDateField.style.display = 'none';
    }
    
    const professionalField = document.getElementById('professional').closest('.mb-3');
    if (professionalField) {
        professionalField.style.display = 'none';
    }
    
    const teamField = document.getElementById('team').closest('.mb-3');
    if (teamField) {
        teamField.style.display = 'none';
    }
    
    // Ocultar toda a seção de Tipo de Serviço
    const serviceTypeSectionElements2 = document.querySelectorAll('.mb-3');
    serviceTypeSectionElements2.forEach(section => {
        const label = section.querySelector('label.form-label');
        if (label && label.textContent.trim() === 'Tipo de Serviço') {
            section.style.display = 'none';
        }
    });
    
    // Ocultar botões padrão e mostrar botões do novo cidadão
    const defaultButtons2 = document.getElementById('defaultButtons');
    const newCitizenButtons2 = document.getElementById('newCitizenButtons');
    if (defaultButtons2) defaultButtons2.style.display = 'none';
    if (newCitizenButtons2) newCitizenButtons2.style.display = 'flex';
    
    // Garantir que os campos estejam limpos e habilitados
    document.getElementById('newCitizenName').value = '';
    document.getElementById('newCitizenCPF').value = '';
    document.getElementById('newCitizenCNS').value = '';
    document.getElementById('newCitizenRace').value = '';
    document.getElementById('newCitizenBirthDate').value = '';
    document.getElementById('newCitizenSex').value = '';
    document.getElementById('newCitizenMother').value = '';
    document.getElementById('unknownMotherToggle').textContent = 'Desconhecido';
    document.getElementById('newCitizenMother').disabled = true;
    document.getElementById('newCitizenFather').value = '';
    document.getElementById('unknownFatherToggle').textContent = 'Desconhecido';
    document.getElementById('newCitizenFather').disabled = true;
    document.getElementById('newCitizenNationality').value = '';
    document.getElementById('newCitizenBirthState').value = '';
    document.getElementById('newCitizenPhone').value = '';
    document.getElementById('newCitizenContactPhone').value = '';
    document.getElementById('newCitizenCEP').value = '';
    document.getElementById('newCitizenStreetType').value = '';
    document.getElementById('newCitizenStreet').value = '';
    document.getElementById('newCitizenNumber').value = '';
    document.getElementById('newCitizenNeighborhood').value = '';
});

// Gerenciar campo Nome da Mãe
document.getElementById('unknownMotherToggle').addEventListener('click', function() {
    const input = document.getElementById('newCitizenMother');
    const isUnknown = input.disabled;
    input.disabled = !isUnknown;
    if (!isUnknown) {
        input.value = '';
        this.textContent = 'Conhecido';
    } else {
        this.textContent = 'Desconhecido';
    }
});

// Gerenciar campo Nome do Pai
document.getElementById('unknownFatherToggle').addEventListener('click', function() {
    const input = document.getElementById('newCitizenFather');
    const isUnknown = input.disabled;
    input.disabled = !isUnknown;
    if (!isUnknown) {
        input.value = '';
        this.textContent = 'Conhecido';
    } else {
        this.textContent = 'Desconhecido';
    }
});

// Limpar campos
document.getElementById('clearFields').addEventListener('click', function() {
    document.getElementById('citizenSearch').value = '';
    document.getElementById('appointmentDate').value = '2025-06-27';
    document.getElementById('professional').value = '';
    document.getElementById('team').value = '';
    document.querySelectorAll('#addCitizenSection input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    document.getElementById('newCitizenForm').classList.remove('show');
    
    // Mostrar novamente todos os campos ocultados
    const appointmentDateField = document.getElementById('appointmentDate').closest('.mb-3');
    if (appointmentDateField) {
        appointmentDateField.style.display = 'block';
    }
    
    const professionalField = document.getElementById('professional').closest('.mb-3');
    if (professionalField) {
        professionalField.style.display = 'block';
    }
    
    const teamField = document.getElementById('team').closest('.mb-3');
    if (teamField) {
        teamField.style.display = 'block';
    }
    
    // Mostrar novamente a seção de Tipo de Serviço
    const serviceTypeSectionElementsClear2 = document.querySelectorAll('.mb-3');
    serviceTypeSectionElementsClear2.forEach(section => {
        const label = section.querySelector('label.form-label');
        if (label && label.textContent.trim() === 'Tipo de Serviço') {
            section.style.display = 'block';
        }
    });
    
    // Mostrar botões padrão e ocultar botões do novo cidadão
    const defaultButtons3 = document.getElementById('defaultButtons');
    const newCitizenButtons3 = document.getElementById('newCitizenButtons');
    if (defaultButtons3) defaultButtons3.style.display = 'block';
    if (newCitizenButtons3) newCitizenButtons3.style.display = 'none';
    
    document.getElementById('newCitizenName').value = '';
    document.getElementById('newCitizenCPF').value = '';
    document.getElementById('newCitizenCNS').value = '';
    document.getElementById('newCitizenRace').value = '';
    document.getElementById('newCitizenBirthDate').value = '';
    document.getElementById('newCitizenSex').value = '';
    document.getElementById('newCitizenMother').value = '';
    document.getElementById('unknownMotherToggle').textContent = 'Desconhecido';
    document.getElementById('newCitizenMother').disabled = true;
    document.getElementById('newCitizenFather').value = '';
    document.getElementById('unknownFatherToggle').textContent = 'Desconhecido';
    document.getElementById('newCitizenFather').disabled = true;
    document.getElementById('newCitizenNationality').value = '';
    document.getElementById('newCitizenBirthState').value = '';
    document.getElementById('newCitizenPhone').value = '';
    document.getElementById('newCitizenContactPhone').value = '';
    document.getElementById('newCitizenCEP').value = '';
    document.getElementById('newCitizenStreetType').value = '';
    document.getElementById('newCitizenStreet').value = '';
    document.getElementById('newCitizenNumber').value = '';
    document.getElementById('newCitizenNeighborhood').value = '';
    document.getElementById('searchResult').textContent = 'Digite pelo menos 3 caracteres para buscar.';
    document.getElementById('addNewCitizenBtn').style.display = 'none';
});

// Adicionar cidadão
document.getElementById('addCitizenConfirm').addEventListener('click', function() {
    const citizenSearch = document.getElementById('citizenSearch').value.trim();
    const newCitizenName = document.getElementById('newCitizenName').value;
    const newCitizenCPF = document.getElementById('newCitizenCPF').value;
    const newCitizenCNS = document.getElementById('newCitizenCNS').value;
    const newCitizenRace = document.getElementById('newCitizenRace').value;
    const newCitizenBirthDate = document.getElementById('newCitizenBirthDate').value;
    const newCitizenSex = document.getElementById('newCitizenSex').value;
    const newCitizenNationality = document.getElementById('newCitizenNationality').value;
    const newCitizenBirthState = document.getElementById('newCitizenBirthState').value;
    const newCitizenPhone = document.getElementById('newCitizenPhone').value;
    const newCitizenContactPhone = document.getElementById('newCitizenContactPhone').value;
    const newCitizenCEP = document.getElementById('newCitizenCEP').value;
    const newCitizenStreetType = document.getElementById('newCitizenStreetType').value;
    const newCitizenStreet = document.getElementById('newCitizenStreet').value;
    const newCitizenNumber = document.getElementById('newCitizenNumber').value;
    const newCitizenNeighborhood = document.getElementById('newCitizenNeighborhood').value;

    if (citizenSearch || (newCitizenName && (newCitizenCPF || newCitizenCNS) && newCitizenRace && newCitizenBirthDate && newCitizenSex && newCitizenNationality && newCitizenBirthState && newCitizenPhone && newCitizenContactPhone && newCitizenCEP && newCitizenStreetType && newCitizenStreet && newCitizenNumber && newCitizenNeighborhood)) {
        alert('✅ Cidadão adicionado com sucesso');
        const table = document.querySelector('.attendance-list table tbody');
        const row = table.insertRow();
        row.innerHTML = `<td class="p-2"><span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Aguardando</span></td><td class="p-2">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td><td class="p-2">${citizenSearch || newCitizenName}</td><td class="p-2">-</td><td class="p-2"><span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${Array.from(document.querySelectorAll('#addCitizenSection input[type="checkbox"]:checked')).map(cb => cb.nextElementSibling.textContent.trim()).join(', ')}</span></td><td class="p-2">-</td><td class="p-2">${document.getElementById('professional').value || '-'}</td><td class="p-2"><button class="text-blue-600 hover:underline">Atender</button></td>`;
        document.getElementById('addCitizenSection').classList.remove('show');
        document.getElementById('citizenSearch').value = '';
        document.getElementById('newCitizenForm').classList.remove('show');
        
        // Mostrar novamente todos os campos após adicionar cidadão
        const appointmentDateField = document.getElementById('appointmentDate').closest('.mb-3');
        if (appointmentDateField) {
            appointmentDateField.style.display = 'block';
        }
        
        const professionalField = document.getElementById('professional').closest('.mb-3');
        if (professionalField) {
            professionalField.style.display = 'block';
        }
        
        const teamField = document.getElementById('team').closest('.mb-3');
        if (teamField) {
            teamField.style.display = 'block';
        }
        
        // Mostrar novamente a seção de Tipo de Serviço
        const serviceTypeSectionElementsConfirm = document.querySelectorAll('.mb-3');
        serviceTypeSectionElementsConfirm.forEach(section => {
            const label = section.querySelector('label.form-label');
            if (label && label.textContent.trim() === 'Tipo de Serviço') {
                section.style.display = 'block';
            }
        });
    } else {
        alert('Erro: Preencha todos os campos obrigatórios.');
    }
});

// Botão Cancelar novo cidadão
document.getElementById('cancelNewCitizen')?.addEventListener('click', function() {
    // Fechar formulário de novo cidadão
    document.getElementById('newCitizenForm').classList.remove('show');
    
    // Restaurar campos ocultados
    const appointmentDateField = document.getElementById('appointmentDate').closest('.mb-3');
    if (appointmentDateField) {
        appointmentDateField.style.display = 'block';
    }
    
    const professionalField = document.getElementById('professional').closest('.mb-3');
    if (professionalField) {
        professionalField.style.display = 'block';
    }
    
    const teamField = document.getElementById('team').closest('.mb-3');
    if (teamField) {
        teamField.style.display = 'block';
    }
    
    const serviceTypeSectionElementsCancel = document.querySelectorAll('.mb-3');
    serviceTypeSectionElementsCancel.forEach(section => {
        const label = section.querySelector('label.form-label');
        if (label && label.textContent.trim() === 'Tipo de Serviço') {
            section.style.display = 'block';
        }
    });
    
    // Mostrar botões padrão e ocultar botões do novo cidadão
    const defaultButtons = document.getElementById('defaultButtons');
    const newCitizenButtons = document.getElementById('newCitizenButtons');
    if (defaultButtons) defaultButtons.style.display = 'block';
    if (newCitizenButtons) newCitizenButtons.style.display = 'none';
    
    // Limpar formulário
    document.getElementById('citizenSearch').value = '';
    document.getElementById('searchResult').textContent = 'Digite pelo menos 3 caracteres para buscar.';
    document.getElementById('addNewCitizenBtn').style.display = 'inline-block';
    document.getElementById('addNewCitizenBtn').style.visibility = 'visible';
});

// Botão Salvar novo cidadão
document.getElementById('saveNewCitizen')?.addEventListener('click', function() {
    const newCitizenName = document.getElementById('newCitizenName').value;
    const newCitizenCPF = document.getElementById('newCitizenCPF').value;
    const newCitizenCNS = document.getElementById('newCitizenCNS').value;
    
    if (newCitizenName && (newCitizenCPF || newCitizenCNS)) {
        alert('✅ Cidadão salvo com sucesso no cadastro');
        
        // Fechar formulário e restaurar interface
        document.getElementById('cancelNewCitizen').click();
    } else {
        alert('Erro: Preencha pelo menos o Nome e CPF ou CNS.');
    }
});

// Botão Salvar e Inserir na Fila
document.getElementById('saveAndAddToQueue')?.addEventListener('click', function() {
    const newCitizenName = document.getElementById('newCitizenName').value;
    const newCitizenCPF = document.getElementById('newCitizenCPF').value;
    const newCitizenCNS = document.getElementById('newCitizenCNS').value;
    
    if (newCitizenName && (newCitizenCPF || newCitizenCNS)) {
        alert('✅ Cidadão salvo e adicionado à fila de atendimento');
        
        // Adicionar à tabela
        const table = document.querySelector('.attendance-list table tbody');
        if (table) {
            const row = table.insertRow();
            row.innerHTML = `<td class="p-2"><span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Aguardando</span></td><td class="p-2">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td><td class="p-2">${newCitizenName}</td><td class="p-2">-</td><td class="p-2"><span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">-</span></td><td class="p-2">-</td><td class="p-2">-</td><td class="p-2"><button class="text-blue-600 hover:underline">Atender</button></td>`;
        }
        
        // Fechar formulário e restaurar interface
        document.getElementById('cancelNewCitizen').click();
        document.getElementById('addCitizenSection').classList.remove('show');
    } else {
        alert('Erro: Preencha pelo menos o Nome e CPF ou CNS.');
    }
});

// Gerenciar campo Nome da Mãe (checkbox)
document.getElementById('unknownMother')?.addEventListener('change', function() {
    document.getElementById('newCitizenMother').disabled = this.checked;
    if (this.checked) document.getElementById('newCitizenMother').value = '';
});

