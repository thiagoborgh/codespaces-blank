#!/bin/bash

# Script para iniciar o ambiente de desenvolvimento da fila de atendimento

echo "🏥 Iniciando ambiente de desenvolvimento da Fila de Atendimento..."

# Navegar para o diretório do frontend
cd frontend

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
fi

# Iniciar o servidor de desenvolvimento na porta 3002
echo "🚀 Iniciando servidor de desenvolvimento na porta 3002..."
echo "📋 Acesse a fila de atendimento em: http://localhost:3002/queue"
echo "🏠 Dashboard disponível em: http://localhost:3002/dashboard"
echo ""
echo "🔧 Para parar o servidor, pressione Ctrl+C"
echo ""

PORT=3002 npm start
