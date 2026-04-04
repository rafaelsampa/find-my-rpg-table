


# 🎲  FindMyRPG

🇧🇷 Português | [🇺🇸 English](./README.en.md) | [🇫🇷 Français](./README.fr.md)

## Conectando Jogadores / Estruturando Ideias /  Construindo para Aprender

## Visão Geral
Uma plataforma SaaS voltada para conectar jogadores a mesas de RPG de mesa. 

A aplicação permite que jogadores encontrem campanhas ativas por meio de filtros estruturados, enquanto mestres ou jogadores podem divulgar suas mesas usando categorias padronizadas. A proposta é evitar texto livre excessivo nas buscas, garantindo consistência nos filtros, integridade no banco de dados e a melhor experiência de navegação. 

# 1. Propósito do Projeto

FindMyRPG nasce de duas motivações:

1. Resolver um problema real da comunidade de RPG de mesa:
   Encontrar mesas organizadas sem depender exclusivamente de grupos dispersos em Discord ou redes sociais.

2. Servir como projeto **Build to Learn**:
   um sistema projetado intencionalmente para exercitar:

   * Arquitetura em camadas
   * Modelagem relacional consistente
   * Uso correto de ENUMs
   * Definição formal de regras de negócio
   * TDD real
   * Contratos de API determinísticos

Este não é apenas um CRUD.
É um laboratório controlado de engenharia de software.

# 2. Problema que o Sistema Resolve

Hoje, encontrar uma mesa de RPG envolve:

* Mensagens soltas em Discord e chats
* Informações incompletas
* Falta de padronização
* Dificuldade de filtrar por sistema, temática ou formato

O sistema resolve isso impondo estrutura:

* Categorias fixas
* Filtros determinísticos
* Regras claras
* Dados consistentes

Sem texto livre quebrando busca.
Sem inconsistência semântica.


# 3. Filosofia de Projeto

Este sistema segue três princípios:

### 1. Estrutura > Flexibilidade excessiva

Campos críticos são ENUMs controlados.

### 2. Backend é a fonte da verdade

Toda regra validada no frontend deve ser obrigatoriamente validada no backend.

### 3. Especificação precede implementação

A implementação deve obedecer estritamente esta documentação.


# 4. Arquitetura

## Frontend

* React + Vite
* Tailwind CSS
* shadcn/ui
* React Hook Form + Zod
* Axios
* TanStack Query

## Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* Zod para validação
* Arquitetura em camadas:

  * Controllers
  * Services
  * Repositories
  * Middlewares


## Banco de Dados

* PostgreSQL
* UUID como chave primária
* ENUM nativo para domínios categóricos

# 5. Modelo de Dados

## Entidade: User

| Campo         | Tipo         | Regra         |
| ------------- | ------------ | ------------- |
| id            | UUID         | PK            |
| email         | VARCHAR(255) | Único         |
| password_hash | TEXT         | bcrypt        |
| nome_perfil   | VARCHAR(100) | obrigatório   |
| created_at    | TIMESTAMP    | default NOW() |

## Entidade: Campaign

| Campo                | Tipo         | Regra                    |
| -------------------- | ------------ | ------------------------ |
| id                   | UUID         | PK                       |
| owner_id             | UUID         | FK → User(id)            |
| sistema              | ENUM         | obrigatório              |
| tematica             | ENUM         | obrigatório              |
| modalidade           | ENUM         | obrigatório              |
| cidade               | VARCHAR(120) | condicional              |
| vtt                  | ENUM         | obrigatório              |
| tipo_campanha        | ENUM         | obrigatório              |
| historia_ambientacao | TEXT         | ≤ 1500 palavras          |
| vagas_totais         | INTEGER      | 1–12                     |
| vagas_preenchidas    | INTEGER      | 0 ≤ valor ≤ vagas_totais |
| created_at           | TIMESTAMP    | default NOW()            |


# 6. ENUMs Oficiais (Case-Sensitive)

## SISTEMA

* DND_5E
* LANCER
* TORMENTA20
* CALL_OF_CTHULHU
* PATHFINDER_2E
* VAMPIRO_A_MASCARA
* OUTRO
* A_DEFINIR

## TEMATICA

* FANTASIA_MEDIEVAL
* SCI_FI_MECHA
* CYBERPUNK
* TERROR_INVESTIGACAO
* POS_APOCALIPTICO
* OUTRO
* A_DEFINIR

## MODALIDADE

* REMOTO
* PRESENCIAL
* A_DEFINIR

## VTT_TOOL

* TABLETOP_SIMULATOR
* FOUNDRY_VTT
* ROLL20
* OWLBEAR_RODEO
* DISCORD_THEATER_OF_THE_MIND
* OUTRO
* A_DEFINIR

## TIPO_CAMPANHA

* MODULO_PUBLICADO
* HOME_BREW
* A_DEFINIR

# 7. Invariantes de Domínio (Obrigatórios)

1. vagas_totais ∈ [1, 12]
2. vagas_preenchidas ∈ [0, vagas_totais]
3. historia_ambientacao ≤ 1500 palavras
4. Se modalidade = PRESENCIAL → cidade obrigatória
5. Se modalidade = REMOTO → cidade deve ser NULL


# 8. Autenticação

JWT:

* Algoritmo: HS256
* Expiração: 24h
* Payload:

  * user_id
  * email


# 9. Contratos de API

## POST /auth/register

```json
{
  "email": "string",
  "password": "string (min 8)",
  "nome_perfil": "string"
}
```

## POST /auth/login

```json
{
  "email": "string",
  "password": "string"
}
```

Resposta:

```json
{
  "token": "JWT"
}
```

## POST /campaigns (Auth obrigatório)

```json
{
  "sistema": "LANCER",
  "tematica": "SCI_FI_MECHA",
  "modalidade": "REMOTO",
  "cidade": null,
  "vtt": "A_DEFINIR",
  "tipo_campanha": "HOME_BREW",
  "historia_ambientacao": "texto...",
  "vagas_totais": 5
}
```

## GET /campaigns

Query params opcionais:

* sistema
* tematica
* modalidade
* vtt
* tipo_campanha
* page (default 1)
* limit (default 10, max 50)

Resposta:

```json
{
  "page": 1,
  "limit": 10,
  "total_items": 37,
  "total_pages": 4,
  "data": []
}
```

# 10. Padrão Global de Erro

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrição amigável",
    "issues": []
  }
}
```

# 11. Estratégia de Testes (TDD)

* Nenhum endpoint é considerado pronto sem testes.
* Jest + Supertest.
* Testes de:

  * Autenticação
  * Regras de domínio
  * Autorização
  * Paginação
  * Filtros combinados

# 12. Natureza do Projeto

Este projeto é:

* Um exercício arquitetural deliberado
* Um laboratório de modelagem relacional
* Um estudo prático de TDD
* Uma base escalável para futuras features



________

**DISCLAMER**: Como é um projeto "Build to learn" as arquiteturas e tecnologias usadas podem ser substituidas ou retiradas durante o processo. 


