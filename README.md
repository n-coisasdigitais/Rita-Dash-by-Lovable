# Google Ads Middleware - Node.js

Middleware Node.js para integração com Google Ads API usando a biblioteca oficial `google-ads-api`.

## 🚀 Deploy no Railway

### Passo 1: Criar conta no Railway
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub

### Passo 2: Criar novo repositório
1. Copie todos os arquivos da pasta `middleware-nodejs` para um novo repositório Git
2. Faça commit e push para o GitHub

### Passo 3: Deploy
1. No Railway, clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha o repositório criado
4. Railway detectará automaticamente o `railway.json` e fará o build

### Passo 4: Configurar variáveis de ambiente
No Railway, adicione as seguintes variáveis:

```
GOOGLE_ADS_CLIENT_ID=seu_client_id
GOOGLE_ADS_CLIENT_SECRET=seu_client_secret
GOOGLE_ADS_DEVELOPER_TOKEN=seu_developer_token
MIDDLEWARE_API_KEY=gere_uma_chave_aleatória_segura
PORT=3000
```

### Passo 5: Obter URL pública
1. Railway gerará automaticamente uma URL pública (ex: `https://seu-app.up.railway.app`)
2. Copie essa URL

### Passo 6: Configurar Supabase
No Supabase, adicione os seguintes secrets:
- `GOOGLE_ADS_MIDDLEWARE_URL`: URL do Railway (ex: `https://seu-app.up.railway.app`)
- `GOOGLE_ADS_MIDDLEWARE_API_KEY`: mesma chave gerada no passo 4

## 📝 Endpoints

### POST /sync/keywords
Sincroniza keywords do Google Ads.

**Body:**
```json
{
  "customerId": "123-456-7890",
  "refreshToken": "1//...",
  "dateRange": "LAST_30_DAYS"
}
```

### POST /sync/metrics
Sincroniza métricas de campanhas.

### POST /sync/hourly-metrics
Sincroniza métricas por hora do dia.

### POST /sync/geographic-metrics
Sincroniza métricas geográficas.

### POST /sync/audience-insights
Sincroniza insights de audiência.

## 🔒 Segurança

Todos os endpoints (exceto `/health`) requerem autenticação via Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  -X POST https://seu-app.up.railway.app/sync/keywords \
  -d '{"customerId":"123-456-7890","refreshToken":"1//..."}'
```

## 🧪 Teste local

```bash
# Instalar dependências
npm install

# Configurar .env
cp .env.example .env
# Editar .env com suas credenciais

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 💰 Custos

- Railway: Gratuito até 500h/mês (suficiente para MVP)
- Se exceder: ~$5-10/mês

## 🔄 Alternativas de Deploy

### Render.com
- Gratuito com limitações (spin down após 15min inatividade)
- Deploy similar ao Railway

### Vercel/Netlify
- Não recomendado (limitações de timeout para APIs)

### VPS próprio
- Melhor performance, mas requer manutenção
