# Deploy to Fly.io

Este guia explica como fazer o deploy da API NestJS no Fly.io.

## Pré-requisitos

1. **Instalar Fly CLI**:

   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Fazer login no Fly.io**:

   ```bash
   fly auth login
   ```

3. **Configurar variáveis de ambiente**:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   DB_URL=your-postgresql-database-url
   JWT_SECRET=your-jwt-secret
   PORT=8080
   NODE_ENV=production
   ```

## Deploy Automático

Use o script de deploy automatizado:

```bash
./deploy.sh
```

Este script irá:

- Verificar se o Fly CLI está instalado
- Verificar se você está logado
- Criar o app no Fly.io (se não existir)
- Configurar as variáveis de ambiente do arquivo `.env`
- Fazer o deploy da aplicação

## Deploy Manual

Se preferir fazer o deploy manualmente:

1. **Criar o app** (apenas na primeira vez):

   ```bash
   fly apps create waving-test-api --org personal
   ```

2. **Configurar variáveis de ambiente**:

   ```bash
   fly secrets set DB_URL="your-database-url" --app waving-test-api
   fly secrets set JWT_SECRET="your-jwt-secret" --app waving-test-api
   ```

3. **Fazer o deploy**:
   ```bash
   fly deploy --app waving-test-api
   ```

## Configurações

### fly.toml

O arquivo `fly.toml` já está configurado com:

- **App name**: `waving-test-api`
- **Primary region**: `gru` (São Paulo)
- **Port**: `8080`
- **Memory**: `512MB`
- **CPU**: `1 shared core`
- **Auto-scaling**: Habilitado (0-1 máquinas)

### Dockerfile

O Dockerfile está otimizado para produção com:

- Multi-stage build para reduzir o tamanho da imagem
- Usuário não-root para segurança
- Health checks automáticos
- Geração do cliente Prisma
- Build otimizado do TypeScript

## Comandos Úteis

### Verificar status

```bash
fly status --app waving-test-api
```

### Ver logs

```bash
fly logs --app waving-test-api
```

### Acessar o app

```bash
fly open --app waving-test-api
```

### Escalar a aplicação

```bash
fly scale count 2 --app waving-test-api
```

### Reiniciar a aplicação

```bash
fly apps restart waving-test-api
```

## Banco de Dados

Para usar um banco PostgreSQL no Fly.io:

1. **Criar banco de dados**:

   ```bash
   fly postgres create --name waving-test-db --region gru
   ```

2. **Anexar ao app**:

   ```bash
   fly postgres attach waving-test-db --app waving-test-api
   ```

3. **Executar migrações**:
   ```bash
   fly ssh console --app waving-test-api
   npx prisma migrate deploy
   ```

## Monitoramento

- **Métricas**: Acesse o dashboard do Fly.io
- **Logs**: Use `fly logs --app waving-test-api`
- **Health checks**: Configurados automaticamente no `/api` endpoint

## Troubleshooting

### Problemas comuns:

1. **Erro de conexão com banco**:

   - Verifique se a variável `DB_URL` está configurada
   - Confirme se o banco está acessível

2. **Erro de build**:

   - Verifique se todas as dependências estão no `package.json`
   - Confirme se o TypeScript está compilando corretamente

3. **App não inicia**:
   - Verifique os logs: `fly logs --app waving-test-api`
   - Confirme se a porta 8080 está sendo usada

### Suporte

- [Documentação do Fly.io](https://fly.io/docs/)
- [Discord do Fly.io](https://discord.gg/flyio)
