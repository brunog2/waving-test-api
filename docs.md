# Waving Test API - Documentação

## 📋 Visão Geral

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