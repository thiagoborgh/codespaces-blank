# Sistema de Fila de Atendimento - Saúde Simples

## 🚀 Deploy Público

### Opções para tornar público:

#### 1. **Netlify (Recomendado)**
1. Acesse [netlify.com](https://netlify.com)
2. Faça login/cadastro gratuito
3. Arraste a pasta `frontend/build` para o deploy
4. Ou use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=frontend/build
```

#### 2. **Vercel**
1. Acesse [vercel.com](https://vercel.com)
2. Faça login/cadastro gratuito
3. Arraste a pasta do projeto
4. Ou use Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

#### 3. **Railway**
1. Acesse [railway.app](https://railway.app)
2. Conecte com GitHub ou use CLI
3. Deploy automático

#### 4. **Heroku**
1. Acesse [heroku.com](https://heroku.com)
2. Crie app gratuito
3. Configure buildpack para Node.js

#### 5. **Surge.sh (Frontend Only)**
```bash
npm install -g surge
cd frontend/build
surge
```

### 📱 **Acesso Mobile**
- Todas as opções acima geram URLs públicas
- Interface 100% responsiva
- Funciona em tablets e smartphones

### 🔗 **Compartilhamento**
Após deploy, você receberá uma URL como:
- `https://seu-app.netlify.app`
- `https://seu-app.vercel.app`
- `https://seu-app.railway.app`

### 💡 **Dica**
Para testes rápidos, recomendo **Netlify** - basta arrastar a pasta `build` no site!
