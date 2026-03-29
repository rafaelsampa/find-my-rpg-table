# 🎲 [Nome do SaaS] - Encontre sua Mesa de RPG (Spec / Arquitetura)

## 1. Visão Geral do Produto
Uma plataforma SaaS em formato de CRUD focada em conectar jogadores a mesas de RPG de mesa. Jogadores podem buscar campanhas ativas através de um sistema robusto de filtros, enquanto Mestres/Criadores podem divulgar suas campanhas utilizando categorias pré-definidas para padronizar a busca e evitar textos livres que quebrem os motores de filtro.

## 2. Stack Tecnológica (A Fundação)
Para garantir um desenvolvimento ágil e um produto final performático, a stack foi escolhida com foco em modularidade e componentização:

* **Frontend (React.js construído com Vite):**
  * **Estilização:** Tailwind CSS + shadcn/ui (para componentes acessíveis e rápidos, como dropdowns complexos e formulários).
  * **Gerenciamento de Formulários:** React Hook Form (para validações em tempo real no cliente, como o limite de palavras).
  * **Consumo de API e Estado:** Axios + TanStack Query (para cache dinâmico e paginação eficiente das buscas).
* **Backend:** Node.js (Construção da API RESTful).
* **Banco de Dados:** PostgreSQL (Relacional, garantindo a integridade dos Enums e filtros).
* **Testes (TDD puro):** Jest + Supertest (Testando as rotas da API, integrações com o banco e regras de negócio antes da implementação final das lógicas).
* **Infraestrutura / Deploy:**
  * **Frontend:** Vercel (CI/CD automatizado e preview rápido).
  * **Backend e Banco de Dados:** VPS da Hostinger via acesso SSH (garantindo controle total do servidor e custos previsíveis).

## 3. Modelagem de Dados e Domínios (Enums)
O mecanismo de busca precisa ser exato. Para isso, a criação de cards será baseada em listas fixas, limitando a digitação livre apenas ao texto de apresentação do mundo.

### 3.1. Entidades Principais
* **`User`**: `id`, `email`, `password_hash`, `nome_perfil`, `data_criacao`.
* **`Campaign`**: `id`, `owner_id`, `historia_ambientacao` (Max: 1500 palavras), `vagas_totais`, `vagas_preenchidas`, `tem_gm` (Boolean).

### 3.2. Categorias Fixas (Filtros e Selects do Card)
Durante a criação ou busca de uma mesa, o usuário interagirá com opções predefinidas:

* **Sistemas Suportados:** D&D 5e, Lancer, Tormenta20, Call of Cthulhu, Pathfinder 2e, Vampiro: A Máscara, Outros.
* **Modalidade (Onde o jogo acontece):**
  * Remoto
  * Presencial (Exige preenchimento obrigatório de "Cidade/Estado". Ex: Recife - PE. Omitindo bairros exatos para privacidade).
* **Ferramentas de Tabletop (VTT):**
  * Tabletop Simulator, Foundry VTT, Roll20, Owlbear Rodeo, Apenas Discord/Teatro da Mente.
* **Assets / Recursos Visuais Planejados:**
  * Mapas modulares (ex: Inkarnate), Tokens digitais, Desenhos à mão, Sem assets visuais focados.
* **Temática:**
  * Fantasia Medieval, Sci-Fi / Mecha, Cyberpunk, Terror/Investigação, Pós-Apocalíptico.
* **Tipo de Campanha:**
  * Módulo Pronto / Aventura Publicada
  * Mundo Customizado (Homebrew)

## 4. Planejamento TDD (Casos de Teste Iniciais)
A arquitetura segue o ciclo Red-Green-Refactor. Os testes devem guiar a construção dos Controllers e Services.

**Suíte de Testes 1: Autenticação (`User`)**
* `[TESTE]` Deve criar um usuário com sucesso ao enviar email e senha válidos.
* `[TESTE]` Deve retornar erro `409 Conflict` se tentar cadastrar um email já existente no banco.
* `[TESTE]` Deve retornar um Token JWT válido ao realizar o login corretamente.

**Suíte de Testes 2: Validação de Regras da Campanha (`Campaign`)**
* `[TESTE]` Deve retornar erro `400 Bad Request` se a `historia_ambientacao` ultrapassar o limite exato de 1500 palavras.
* `[TESTE]` Deve retornar erro `400 Bad Request` se a "Modalidade" for "Presencial" mas o campo da cidade estiver em branco.
* `[TESTE]` Deve bloquear a criação e retornar erro se tentar enviar um "Sistema" que não existe no Enum cadastrado.
* `[TESTE]` Deve impedir que a quantidade de `vagas_preenchidas` seja maior que as `vagas_totais`.

**Suíte de Testes 3: Motor de Busca e Filtros (Integração)**
* `[TESTE]` A busca via `GET /campaigns` deve retornar apenas mesas batendo com a query string exata (ex: `?sistema=Lancer&ferramenta=Tabletop Simulator`).
* `[TESTE]` A busca deve ignorar parâmetros de filtro não preenchidos na requisição, trazendo o espectro geral.
* `[TESTE]` A resposta da busca deve ser paginada, retornando obrigatoriamente um limite de 10 cards por página para otimização do frontend.
