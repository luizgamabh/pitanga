# Deploy no Dokku (Hostinger)

Este documento descreve como configurar e fazer deploy do Pitanga no servidor Dokku.

## URLs de Produção

| App | Domínio | Porta |
|-----|---------|-------|
| Web (Next.js) | pitanga.digital | 3000 |
| API (NestJS) | api.pitanga.digital | 3333 |

## 1. Pré-requisitos no servidor

```bash
# Conectar no servidor via SSH
ssh root@seu-servidor-hostinger

# Verificar se o Dokku está instalado
dokku version
```

## 2. Criar as aplicações no Dokku

```bash
# Criar app da API
dokku apps:create pitanga-api

# Criar app do Web
dokku apps:create pitanga-web
```

## 3. Configurar os domínios

```bash
# Configurar domínio da API
dokku domains:set pitanga-api api.pitanga.digital

# Configurar domínio do Web
dokku domains:set pitanga-web pitanga.digital
```

## 4. Configurar variáveis de ambiente

```bash
# API - variáveis de ambiente
dokku config:set pitanga-api NODE_ENV=production
dokku config:set pitanga-api PORT=3333

# Web - variáveis de ambiente
dokku config:set pitanga-web NODE_ENV=production
dokku config:set pitanga-web NEXT_PUBLIC_API_URL=https://api.pitanga.digital
```

## 5. Configurar portas

```bash
# API escuta na porta 3333
dokku ports:set pitanga-api http:80:3333

# Web escuta na porta 3000
dokku ports:set pitanga-web http:80:3000
```

## 6. Configurar Dockerfile path

Como é um monorepo, precisa configurar qual Dockerfile usar:

```bash
# Para a API
dokku builder-dockerfile:set pitanga-api dockerfile-path apps/pitanga-api/Dockerfile

# Para o Web
dokku builder-dockerfile:set pitanga-web dockerfile-path apps/pitanga/Dockerfile
```

## 7. Configurar SSL (Let's Encrypt)

```bash
# Instalar plugin se não tiver
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git

# Configurar email para SSL
dokku letsencrypt:set pitanga-api email seu-email@exemplo.com
dokku letsencrypt:set pitanga-web email seu-email@exemplo.com

# Habilitar SSL (fazer APÓS o primeiro deploy)
dokku letsencrypt:enable pitanga-api
dokku letsencrypt:enable pitanga-web

# Auto-renovação
dokku letsencrypt:cron-job --add
```

## 8. Configurar Git remotes (máquina local)

```bash
# Adicionar remotes para deploy
git remote add dokku-api dokku@seu-servidor:pitanga-api
git remote add dokku-web dokku@seu-servidor:pitanga-web
```

## 9. Deploy

```bash
# Deploy da API (substitua 'main' pela sua branch se necessário)
git push dokku-api main

# Deploy do Web
git push dokku-web main

# Se estiver em outra branch (ex: feature/tailwind)
git push dokku-api feature/tailwind:main
git push dokku-web feature/tailwind:main
```

## 10. Comandos úteis

### Logs

```bash
# Ver logs em tempo real
dokku logs pitanga-api -t
dokku logs pitanga-web -t

# Ver últimas 100 linhas
dokku logs pitanga-api -n 100
```

### Status

```bash
# Ver status dos containers
dokku ps:report pitanga-api
dokku ps:report pitanga-web

# Ver todas as apps
dokku apps:list
```

### Restart

```bash
# Reiniciar uma app
dokku ps:restart pitanga-api
dokku ps:restart pitanga-web
```

### Variáveis de ambiente

```bash
# Ver todas as variáveis
dokku config:show pitanga-api

# Adicionar/atualizar variável
dokku config:set pitanga-api CHAVE=valor

# Remover variável
dokku config:unset pitanga-api CHAVE
```

### Rollback

```bash
# Ver releases disponíveis
dokku releases pitanga-api

# Fazer rollback para versão anterior
dokku releases:rollback pitanga-api
```

## Troubleshooting

### Build falhou

```bash
# Ver logs do build
dokku logs pitanga-api --type build

# Limpar cache do build
dokku builder:build-clear pitanga-api
```

### App não inicia

```bash
# Verificar health check
dokku checks:report pitanga-api

# Desabilitar temporariamente (debug)
dokku checks:disable pitanga-api

# Reabilitar
dokku checks:enable pitanga-api
```

### Verificar recursos

```bash
# Ver uso de memória/CPU
dokku ps:report pitanga-api

# Limitar recursos (opcional)
dokku resource:limit --memory 512m pitanga-api
```
