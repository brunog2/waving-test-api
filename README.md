# 🛍️ Waving Test API

API REST para sistema de e-commerce desenvolvida com NestJS, PostgreSQL e Prisma.

## 🚀 Tecnologias

- **Backend:** NestJS
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT
- **Documentação:** Swagger/OpenAPI
- **Validação:** class-validator
- **Criptografia:** bcrypt

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- PostgreSQL
- Docker (opcional, para rodar PostgreSQL)

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/brunog2/waving-test-api
cd waving-test-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DB_HOST=localhost
DB_NAME=wt
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5432
DB_URL=postgresql://postgres:postgres@localhost:5432/wt?schema=public

# JWT
SECRET=sua-chave-secreta-aqui

# API
PORT=3000
```

### 4. Configure o banco de dados

#### Opção A: Usando Docker (Recomendado)

```bash
# Inicia o PostgreSQL
docker compose -f docker-compose-dev.yml up -d
```

#### Opção B: PostgreSQL local

Certifique-se de que o PostgreSQL está rodando e crie um banco de dados chamado `wt`.

## 🗄️ Configuração do Banco de Dados

### 1. Gere o Prisma Client

```bash
npx prisma generate
```

### 2. Execute as migrações

```bash
npx prisma migrate dev
```

### 3. Popule o banco com dados de exemplo

```bash
npm run prisma:seed
```

## 🚀 Como Executar

### Desenvolvimento

```bash
# Modo desenvolvimento com watch
npm run start:dev

# Ou com serviços Docker
npm run start:services
```

### Produção

```bash
# Build do projeto
npm run build

# Executar em produção
npm run start:prod
```

## 📚 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Executa em modo desenvolvimento com watch
npm run start:services     # Executa com Docker + desenvolvimento
npm run start:debug        # Executa em modo debug

# Produção
npm run build              # Compila o projeto
npm run start:prod         # Executa em produção

# Testes
npm run test               # Executa testes unitários
npm run test:watch         # Executa testes em modo watch
npm run test:e2e           # Executa testes end-to-end
npm run test:cov           # Executa testes com cobertura

# Qualidade de código
npm run lint               # Executa ESLint
npm run format             # Formata código com Prettier

# Banco de dados
npm run prisma:seed        # Popula banco com dados de exemplo
npm run db:reset           # Reseta banco, migrações e dados
npm run db:migrate         # Executa migrações em desenvolvimento
npm run db:deploy          # Executa migrações em produção
npm run db:studio          # Abre Prisma Studio
npm run db:generate        # Gera Prisma Client
npm run db:push            # Sincroniza schema com banco
npm run db:pull            # Puxa schema do banco
```

## 🗄️ Comandos do Prisma

```bash
# Gerar Prisma Client
npx prisma generate

# Criar nova migração
npx prisma migrate dev --name nome-da-migracao

# Aplicar migrações em produção
npx prisma migrate deploy

# Resetar banco de dados
npx prisma migrate reset

# Abrir Prisma Studio (interface visual)
npx prisma studio

# Verificar status do banco
npx prisma db pull

# Gerar schema a partir do banco
npx prisma db push
```

## 📖 Documentação da API

Após iniciar o servidor, acesse a documentação Swagger:

```
http://localhost:3000/api
```

## 🔐 Usuários de Teste

Após executar o seed, você terá os seguintes usuários:

### Administrador

- **Email:** adm@wt.com
- **Senha:** 123
- **Role:** ADMIN

### Cliente

- **Email:** customer@wt.com
- **Senha:** 123
- **Role:** CUSTOMER

### Usuários para Avaliações

- john@example.com / 123
- jane@example.com / 123
- mike@example.com / 123
- sarah@example.com / 123
- david@example.com / 123

## 🛠️ Estrutura do Projeto

```
src/
├── modules/
│   ├── auth/           # Autenticação e autorização
│   ├── users/          # Gerenciamento de usuários
│   ├── categories/     # Categorias de produtos
│   ├── products/       # Produtos
│   ├── comments/       # Comentários e avaliações
│   ├── cart/           # Carrinho de compras
│   └── orders/         # Pedidos
├── prisma/
│   ├── schema.prisma   # Schema do banco de dados
│   ├── seed.ts         # Dados de exemplo
│   └── migrations/     # Migrações do banco
└── config/             # Configurações da aplicação
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente

- `DB_HOST`: Host do banco de dados
- `DB_NAME`: Nome do banco de dados
- `DB_USER`: Usuário do banco de dados
- `DB_PASSWORD`: Senha do banco de dados
- `DB_PORT`: Porta do banco de dados
- `DB_URL`: URL completa de conexão com PostgreSQL
- `SECRET`: Chave secreta para JWT
- `PORT`: Porta da aplicação

### Extensões PostgreSQL

O projeto utiliza a extensão `unaccent` para busca sem acentos. A migração é aplicada automaticamente.

## 🚨 Troubleshooting

### Problemas com Prisma

```bash
# Se houver problemas com o Prisma Client
npx prisma generate

# Se houver problemas com migrações
npx prisma migrate reset --force
```

### Problemas com Docker

```bash
# Parar containers
docker compose -f docker-compose-dev.yml down

# Remover volumes (cuidado: apaga dados)
docker compose -f docker-compose-dev.yml down -v
```

### Problemas com dependências

```bash
# Limpar cache do npm
npm cache clean --force

# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notas de Desenvolvimento

- A API utiliza soft delete (não remove registros permanentemente)
- Todas as operações críticas usam transações de banco
- Busca de produtos suporta normalização de acentos
- Sistema de avaliações com ratings de 1-5 estrelas
- Dashboard administrativo com estatísticas completas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ usando NestJS**
