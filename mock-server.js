const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3002', 'http://127.0.0.1:3002'],
  credentials: true
}));
app.use(bodyParser.json());

// Mock data
let users = [
  {
    id: 1,
    name: 'Usuario Teste',
    email: 'usuario@exemplo.com',
    password: '123456',
    role: 'doctor',
    active: true,
    registration_number: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper function to generate JWT token (mock)
function generateMockToken(user) {
  return `mock-jwt-token-${user.id}-${Date.now()}`;
}

// Routes
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Email ou senha inválidos.'
    });
  }

  const accessToken = generateMockToken(user);
  const refreshToken = generateMockToken(user);

  res.json({
    success: true,
    message: 'Login realizado com sucesso.',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        registration_number: user.registration_number,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      access_token: accessToken,
      refresh_token: refreshToken
    }
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  const { user: userData } = req.body;
  
  // Check if user exists
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email já está em uso.'
    });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'doctor',
    active: true,
    registration_number: userData.registration_number || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  users.push(newUser);

  const accessToken = generateMockToken(newUser);
  const refreshToken = generateMockToken(newUser);

  res.status(201).json({
    success: true,
    message: 'Usuário cadastrado com sucesso.',
    data: {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        active: newUser.active,
        registration_number: newUser.registration_number,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at
      },
      access_token: accessToken,
      refresh_token: refreshToken
    }
  });
});

app.get('/api/v1/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de acesso não fornecido.'
    });
  }

  // Mock user data (in real app, decode JWT)
  const user = users[0];
  
  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      registration_number: user.registration_number,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  });
});

app.delete('/api/v1/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso.'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/v1/auth/login');
  console.log('- POST /api/v1/auth/register');
  console.log('- GET /api/v1/auth/me');
  console.log('- DELETE /api/v1/auth/logout');
});
