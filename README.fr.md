
# 🎲 FindMyRPG

[🇧🇷 Português](./README.md) | [🇺🇸 English](./README.en.md) | 🇫🇷 Français

## Connecter les Joueurs / Structurer les Idées / Construire pour Apprendre

## Aperçu Général
Une plateforme SaaS conçue pour connecter les joueurs aux tables de jeux de rôle (JDR) sur table.

L'application permet aux joueurs de trouver des campagnes actives via des filtres structurés, tandis que les maîtres de jeu (MJ) ou les joueurs peuvent promouvoir leurs tables en utilisant des catégories standardisées. L'objectif est d'éviter les textes libres excessifs dans les recherches, en garantissant la cohérence des filtres, l'intégrité de la base de données et la meilleure expérience de navigation possible.

# 1. Objectif du Projet

FindMyRPG est né de deux motivations principales :

1. Résoudre un problème réel de la communauté de JDR sur table :
   Trouver des tables organisées sans dépendre exclusivement de groupes dispersés sur Discord ou les réseaux sociaux.

2. Servir de projet **Build to Learn** :
   Un système intentionnellement conçu pour pratiquer :

   * Architecture en couches (N-Tier)
   * Modélisation relationnelle cohérente
   * Utilisation correcte des ENUMs
   * Définition formelle des règles métier (Business rules)
   * Vrai TDD (Test-Driven Development)
   * Contrats d'API déterministes

Il ne s'agit pas d'un simple CRUD.
C'est un laboratoire contrôlé d'ingénierie logicielle.

# 2. Problème Résolu par le Système

Aujourd'hui, trouver une table de JDR implique :

* Des messages éparpillés sur Discord et des chats
* Des informations incomplètes
* Un manque de standardisation
* Une difficulté à filtrer par système, thème ou format

Le système résout cela en imposant une structure :

* Catégories fixes
* Filtres déterministes
* Règles claires
* Données cohérentes

Pas de texte libre qui casse les recherches.
Pas d'incohérence sémantique.


# 3. Philosophie de Conception

Ce système suit trois principes fondamentaux :

### 1. Structure > Flexibilité excessive

Les champs critiques sont des ENUMs contrôlés.

### 2. Le Backend est la source de vérité

Toute règle validée sur le frontend doit obligatoirement être validée sur le backend.

### 3. La spécification précède l'implémentation

L'implémentation doit respecter strictement cette documentation.


# 4. Architecture

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
* Zod pour la validation
* Architecture en couches :

  * Controllers
  * Services
  * Repositories
  * Middlewares


## Base de Données

* PostgreSQL
* UUID comme clé primaire
* ENUM natif pour les domaines catégoriels

# 5. Modèle de Données

## Entité : User

| Champ         | Type         | Règle         |
| ------------- | ------------ | ------------- |
| id            | UUID         | PK            |
| email         | VARCHAR(255) | Unique        |
| password_hash | TEXT         | bcrypt        |
| nome_perfil   | VARCHAR(100) | Obligatoire   |
| created_at    | TIMESTAMP    | default NOW() |

## Entité : Campaign

| Champ                | Type         | Règle                    |
| -------------------- | ------------ | ------------------------ |
| id                   | UUID         | PK                       |
| owner_id             | UUID         | FK → User(id)            |
| sistema              | ENUM         | Obligatoire              |
| tematica             | ENUM         | Obligatoire              |
| modalidade           | ENUM         | Obligatoire              |
| cidade               | VARCHAR(120) | Conditionnel             |
| vtt                  | ENUM         | Obligatoire              |
| tipo_campanha        | ENUM         | Obligatoire              |
| historia_ambientacao | TEXT         | ≤ 1500 mots              |
| vagas_totais         | INTEGER      | 1–12                     |
| vagas_preenchidas    | INTEGER      | 0 ≤ valeur ≤ vagas_totais|
| created_at           | TIMESTAMP    | default NOW()            |


# 6. ENUMs Officiels (Sensibles à la casse)

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

# 7. Invariants du Domaine (Obligatoires)

1. vagas_totais ∈ [1, 12]
2. vagas_preenchidas ∈ [0, vagas_totais]
3. historia_ambientacao ≤ 1500 mots
4. Si modalidade = PRESENCIAL → cidade obligatoire
5. Si modalidade = REMOTO → cidade doit être NULL


# 8. Authentification

JWT :

* Algorithme : HS256
* Expiration : 24h
* Payload :

  * user_id
  * email


# 9. Contrats d'API

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

Réponse :

```json
{
  "token": "JWT"
}
```

## POST /campaigns (Auth obligatoire)

```json
{
  "sistema": "LANCER",
  "tematica": "SCI_FI_MECHA",
  "modalidade": "REMOTO",
  "cidade": null,
  "vtt": "A_DEFINIR",
  "tipo_campanha": "HOME_BREW",
  "historia_ambientacao": "texte...",
  "vagas_totais": 5
}
```

## GET /campaigns

Paramètres de requête (Query params) optionnels :

* sistema
* tematica
* modalidade
* vtt
* tipo_campanha
* page (default 1)
* limit (default 10, max 50)

Réponse :

```json
{
  "page": 1,
  "limit": 10,
  "total_items": 37,
  "total_pages": 4,
  "data": []
}
```

# 10. Modèle Global d'Erreur

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Description conviviale",
    "issues": []
  }
}
```

# 11. Stratégie de Tests (TDD)

* Aucun endpoint n'est considéré comme terminé sans tests.
* Jest + Supertest.
* Tests de :

  * Authentification
  * Règles de domaine
  * Autorisation
  * Pagination
  * Filtres combinés

# 12. Nature du Projet

Ce projet est :

* Un exercice architectural délibéré
* Un laboratoire de modélisation relationnelle
* Une étude pratique du TDD
* Une base évolutive pour de futures fonctionnalités

________

**AVERTISSEMENT** : Comme il s'agit d'un projet "Build to learn", les architectures et les technologies utilisées peuvent être remplacées ou retirées pendant le processus de développement.
