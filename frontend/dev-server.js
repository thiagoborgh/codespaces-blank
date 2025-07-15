const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3002;

// Serve arquivos estáticos do build
app.use(express.static(path.join(__dirname, 'build')));

// Para qualquer rota não encontrada, serve o index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📋 Acesse: http://localhost:${PORT}`);
  console.log(`🏥 Sistema de Fila de Atendimento - Modo Desenvolvimento`);
  console.log(`📊 Para testar as regras de negócio dos botões:`);
  console.log(`   - Acesse a fila: http://localhost:${PORT}/queue`);
  console.log(`   - Teste diferentes status de pacientes`);
  console.log(`   - Validação de tooltips e comportamentos`);
});
