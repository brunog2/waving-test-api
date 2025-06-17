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
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wt?schema=public

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

### 2. Execute as migrations

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

## 📋 Visão Geral do Projeto

API REST desenvolvida em **NestJS** com **Prisma ORM** e **PostgreSQL**, implementando um sistema de e-commerce completo com autenticação JWT, controle de usuários, produtos, categorias, carrinho de compras, pedidos e comentários.

## 🏗️ Arquitetura

### Tecnologias Utilizadas
- **Framework**: NestJS (Node.js)
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: class-validator + class-transformer
- **Documentação**: Swagger/OpenAPI
- **Deploy**: Fly.io

### Estrutura do Projeto
```
src/
├── modules/
│   ├── auth/           # Autenticação e autorização
│   ├── users/          # Gestão de usuários
│   ├── categories/     # Categorias de produtos
│   ├── products/       # Produtos
│   ├── cart/          # Carrinho de compras
│   ├── orders/        # Pedidos
│   └── comments/      # Comentários
├── enums/             # Enums do sistema
├── config/            # Configurações
└── prisma/            # Configuração do Prisma
```

## 🔐 Sistema de Autenticação

### Tipos de Usuário
- **CUSTOMER**: Cliente comum (pode fazer compras)
- **ADMIN**: Administrador (acesso total ao sistema)

### Endpoints de Autenticação
- `POST /auth/register` - Registro de cliente
- `POST /auth/login` - Login de cliente
- `POST /auth/admin/login` - Login de administrador

### Proteção de Rotas
- **@UseGuards(JwtAuthGuard)**: Rotas protegidas por JWT
- **@UseGuards(AdminGuard)**: Rotas exclusivas para admin
- **@UseGuards(CustomerGuard)**: Rotas exclusivas para cliente

## 📊 Modelos de Dados

### User
```typescript
{
  id: string
  email: string
  password: string (hasheada)
  name: string
  role: Role (CUSTOMER | ADMIN)
  createdAt: Date
  updatedAt: Date
}
```

### Category
```typescript
{
  id: string
  name: string
  description: string
  products: Product[]
}
```

### Product
```typescript
{
  id: string
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
  category: Category
  cartItems: CartItem[]
  orderItems: OrderItem[]
}
```

### Cart & CartItem
```typescript
{
  id: string
  userId: string
  user: User
  items: CartItem[]
}

CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  product: Product
}
```

### Order & OrderItem
```typescript
{
  id: string
  userId: string
  status: OrderStatus
  total: number
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

OrderStatus: PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED
```

## 🚀 Endpoints da API

### Autenticação
| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | `/auth/register` | Registro de cliente | Público |
| POST | `/auth/login` | Login de cliente | Público |
| POST | `/auth/admin/login` | Login de admin | Público |

### Usuários
| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/users` | Listar usuários | Admin |
| GET | `/users/profile` | Perfil do usuário logado | Cliente |
| GET | `/users/:id` | Buscar usuário por ID | Admin/Próprio |
| PATCH | `/users/:id` | Atualizar usuário | Admin/Próprio |
| DELETE | `/users/:id` | Deletar usuário | Admin |

### Categorias
| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/categories` | Listar categorias | Público |
| GET | `/categories/all` | Listar todas categorias | Público |
| GET | `/categories/with-products` | Categorias com produtos | Público |
| GET | `/categories/:id` | Buscar categoria por ID | Público |
| POST | `/categories` | Criar categoria | Admin |
| PATCH | `/categories/:id` | Atualizar categoria | Admin |
| DELETE | `/categories/:id` | Deletar categoria | Admin |

### Produtos
| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/products` | Listar produtos | Público |
| GET | `/products/:id` | Buscar produto por ID | Público |
| POST | `/products` | Criar produto | Admin |
| PATCH | `/products/:id` | Atualizar produto | Admin |
| DELETE | `/products/:id` | Deletar produto | Admin |

### Carrinho
| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/cart` | Ver carrinho | Cliente |
| GET | `/cart/total` | Total do carrinho | Cliente |
| POST | `/cart/items` | Adicionar item | Cliente |
| POST | `/cart/items/bulk` | Adicionar múltiplos itens | Cliente |
| PATCH | `/cart/items/:id` | Atualizar quantidade | Cliente |
| DELETE | `/cart/items/:id` | Remover item | Cliente |
| DELETE | `/cart` | Limpar carrinho | Cliente |

### Pedidos
| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/orders` | Listar pedidos | Admin/Próprios |
| GET | `/orders/:id` | Buscar pedido por ID | Admin/Próprio |
| POST | `/orders` | Criar pedido | Cliente |
| PATCH | `/orders/:id` | Atualizar status | Admin |
| DELETE | `/orders/:id` | Deletar pedido | Admin |
| GET | `/orders/dashboard/stats` | Estatísticas | Admin |

### Comentários
| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/comments` | Listar comentários | Público |
| POST | `/comments` | Criar comentário | Cliente |

## 🔧 Configurações

### Variáveis de Ambiente
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="seu-jwt-secret"
PORT=3000
NODE_ENV=production
```

### Banco de Dados
- **PostgreSQL** com extensão `unaccent` para busca
- **Migrations** automáticas no deploy
- **Seeds** para dados iniciais

## 🚀 Deploy

### Fly.io
- **URL**: https://waving-test-api.fly.dev
- **Documentação**: https://waving-test-api.fly.dev/api
- **Porta**: 3000 (padrão Fly.io)

### Processo de Deploy
1. Build multi-stage Docker
2. Execução automática de migrations
3. Execução automática de seeds
4. Inicialização da aplicação

## 📝 Funcionalidades Implementadas

### ✅ Completas
- [x] Autenticação JWT com roles (CUSTOMER/ADMIN)
- [x] CRUD completo de usuários
- [x] CRUD completo de categorias
- [x] CRUD completo de produtos
- [x] Sistema de carrinho de compras
- [x] Sistema de pedidos com status
- [x] Sistema de comentários
- [x] Validação de dados com class-validator
- [x] Documentação Swagger
- [x] Deploy automatizado no Fly.io
- [x] Seeds automáticos
- [x] Health checks

### 🔒 Segurança
- [x] Senhas hasheadas com bcrypt
- [x] Autenticação JWT
- [x] Autorização por roles
- [x] Validação de entrada
- [x] Usuário não-root no Docker

### 📊 Dados Iniciais
O sistema é populado automaticamente com:
- Usuário admin padrão
- Categorias de exemplo
- Produtos de exemplo
- Comentários de exemplo

## 🧪 Testes

### Endpoints de Teste
- `GET /api` - Documentação Swagger
- `GET /health` - Health check

### Credenciais de Teste
```
Admin:
- Email: adm@wt.com
- Senha: 123

Cliente:
- Email: customer@wt.com  
- Senha: 123
```

## 📚 Documentação da API

A documentação completa está disponível em:
**https://waving-test-api.fly.dev/api**

🔗 **Documentação também disponível em:** [https://deepwiki.com/brunog2/waving-test-api](https://deepwiki.com/brunog2/waving-test-api)


Inclui:
- Todos os endpoints
- Schemas de request/response
- Exemplos de uso
- Códigos de erro
- Autenticação

## 🎯 Decisões de Arquitetura

### NestJS
- Framework robusto para APIs
- Arquitetura modular
- Injeção de dependência
- Decorators para validação

### Prisma
- Type-safe ORM
- Migrations automáticas
- Seeds integrados
- Relacionamentos bem definidos

### Fly.io
- Deploy simples
- Escalabilidade automática
- PostgreSQL integrado
- Health checks nativos

### Estrutura Modular
- Separação clara de responsabilidades
- Guards para autorização
- DTOs para validação
- Interfaces bem definidas

## 🔄 Fluxo de Dados

1. **Cliente** faz login → recebe JWT
2. **Cliente** navega produtos → adiciona ao carrinho
3. **Cliente** finaliza compra → cria pedido
4. **Admin** gerencia pedidos → atualiza status
5. **Sistema** mantém histórico completo

Esta arquitetura garante:
- **Escalabilidade**: Módulos independentes
- **Manutenibilidade**: Código bem estruturado
- **Segurança**: Autenticação e autorização robustas
- **Performance**: ORM otimizado e índices adequados 

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
- `DATABASE_URL`: URL completa de conexão com PostgreSQL
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
