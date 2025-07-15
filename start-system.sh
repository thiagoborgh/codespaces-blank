#!/bin/bash

echo "🚀 Iniciando o sistema de atendimento médico..."

# Verificar se as dependências do mock server estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do mock server..."
    npm install
fi

# Iniciar o mock server em background
echo "🔧 Iniciando mock server na porta 3001..."
node mock-server.js &
MOCK_PID=$!

# Aguardar um momento para o mock server inicializar
sleep 2

# Verificar se o mock server está rodando
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Mock server iniciado com sucesso!"
else
    echo "❌ Erro ao iniciar mock server"
    exit 1
fi

# Navegar para o frontend e iniciar
echo "🌐 Iniciando servidor frontend..."
cd frontend

# Verificar se as dependências do frontend estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
fi

# Iniciar o frontend
echo "🚀 Iniciando aplicação frontend na porta 3002..."
PORT=3002 npm start

# Cleanup function
cleanup() {
    echo "🛑 Parando serviços..."
    kill $MOCK_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C para cleanup
trap cleanup SIGINT

# Manter o script rodando
wait
