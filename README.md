
# Copy Agents Hub

Uma aplicação web profissional para geração de copy através de agentes de IA integrados com n8n.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui
- **Autenticação**: Supabase Auth
- **Estado**: React Query + Axios
- **Deploy**: Vercel (frontend) + Supabase (backend)

## 🎨 Design System

### Cores
- **Primary Background**: `#0f1116`
- **Card Background**: `#1b1e25`
- **Border**: `#2a2d35`
- **Accent Gold**: `#d4af37`
- **Text Light**: `#e5e5e5`
- **Text Muted**: `#a0a0a0`

## ⚙️ Configuração

### 1. Instalar dependências
```bash
pnpm install
# ou
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 3. Configurar Supabase

Execute os seguintes comandos SQL no Supabase:

```sql
-- Criar tabela de usuários (se necessário)
create table if not exists auth.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  created_at timestamptz default now()
);

-- Habilitar RLS
alter table auth.users enable row level security;

-- Política de acesso
create policy "Users can view own profile" 
  on auth.users for select 
  using ( auth.uid() = id );
```

### 4. Configurar webhook n8n

No arquivo `src/hooks/useAgentAPI.ts`, substitua:
```typescript
const WEBHOOK_URL = 'https://SEU-DOMINIO/webhook/agents-copy'
```

## 🏃‍♂️ Executar localmente

```bash
pnpm dev
# ou
npm run dev
```

Acesse: `http://localhost:8080`

## 📱 Funcionalidades

### Autenticação
- Login/registro com email e senha
- Sessão persistente
- Rotas protegidas

### Dashboard
- 6 cards de agentes de copy:
  - 📝 Briefing de Campanha
  - 📱 Sequência de Stories
  - 🖼️ Sequência de Carrosséis
  - 🎬 Roteiro de Reels
  - 💬 Mensagens de WhatsApp
  - ✉️ Sequência de E-mails

### Integração n8n
- POST request para webhook configurável
- Loading states durante geração
- Painel de resultado com copy gerado
- Funcionalidade de copiar texto

## 🎯 API do n8n

O webhook deve receber:
```json
{
  "agent": "agent-id"
}
```

E retornar:
```json
{
  "copy": "texto gerado pelo agente",
  "success": true
}
```

## 📱 Responsividade

- **Desktop**: Grid 3x2 (6 cards)
- **Mobile**: Grid 2x3 (cards empilhados)
- Design totalmente responsivo

## 🚀 Deploy

### Vercel (Frontend)
1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push na main

### Supabase (Backend)
1. Crie um projeto no Supabase
2. Configure autenticação por email
3. Execute os scripts SQL necessários

## 🔧 Desenvolvimento

### Estrutura do projeto
```
src/
├── components/       # Componentes reutilizáveis
├── contexts/        # Contextos React (Auth)
├── data/           # Dados estáticos (agents)
├── hooks/          # Hooks customizados
├── lib/            # Utilitários (supabase)
├── pages/          # Páginas da aplicação
└── types/          # Tipos TypeScript
```

### Scripts disponíveis
```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build para produção
pnpm preview      # Preview do build
pnpm lint         # Verificar código
```

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.
