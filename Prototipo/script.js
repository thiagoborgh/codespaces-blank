// Simulação de interação (ex.: alternar abas)
document.querySelectorAll('.nav-tabs .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-tabs .nav-link').forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');
        // Aqui você pode adicionar lógica para carregar conteúdo dinâmico por aba
        alert('Conteúdo da aba ' + this.text + ' será carregado (simulação).');
    });
});