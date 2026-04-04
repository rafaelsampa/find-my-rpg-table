# Arquitetura de Software: <br> O Modelo 🍽️ Restaurante de Alto Padrão

Este documento descreve a arquitetura do projeto **Find My RPG Table**, utilizando o **PERN Stack Moderno** (PostgreSQL, Express, React, Node + Prisma), através da analogia de um restaurante de alto padrão. 

Em um sistema web completo, temos dois "fronts" principais de trabalho que operam de forma isolada, mas perfeitamente sincronizada: O **Frontend** (O Salão) e o **Backend** (A Cozinha).

---

## 1. O Frontend 🏛️ 
> *Tecnologias: React, Vite, Tailwind CSS, shadcn/ui*

O Frontend é tudo aquilo que o cliente vê, toca e interage. O cliente não faz ideia de como a comida é preparada, ele apenas desfruta do ambiente que foi preparado para ele.

* **Os Clientes (Usuários):** São os jogadores e mestres de RPG acessando a plataforma pelo navegador do computador ou do celular.
* **As Mesas e o Ambiente (React + Tailwind):** É a interface visual (UI). O conforto das cadeiras, as cores da parede, o design do cardápio. É a tela de "Criar Campanha" ou os "Cards" bonitos gerados pelo shadcn/ui.
* **A Recepcionista (Load Balancer / Cloudflare):** Quando o restaurante bomba, ela organiza a fila na porta. Impede a entrada de mal-intencionados (ataques DDoS) e direciona os clientes para onde o sistema está mais fluido.
* **O Garçom de Apoio / Olheiro (Cache / CDN):** Aquele funcionário ágil que entrega itens rápidos (água, palito, sal) sem precisar ir à cozinha. Na nossa arquitetura, é a CDN entregando imagens, fontes e páginas estáticas instantaneamente para o usuário não esperar.

---

## 2. A Comunicação 🗣️ 
> *Tecnologias: Node.js, Express, JSON, JWT*

Para que o Salão e a Cozinha funcionem, eles precisam de uma linguagem universal e de mensageiros eficientes.

* **O Garçom Principal (Servidor Node.js):** É o motor que não para. Ele escuta a porta do restaurante, vai até a mesa (Frontend) e leva o pedido para a cozinha (Backend) o tempo todo.
* **O Caderno de Anotações (JSON e JWT):** O garçom não confia na memória. Ele anota o número da mesa (ID), confirma quem é o cliente (crachá de autenticação **JWT**) e anota o pedido exato em formato **JSON** (ex: *Sistema: D&D 5e, Vagas: 4*).
* **Janela A da Cozinha (Rotas/Endpoints Express):** Onde o garçom entrega o pedido. Cada janela aceita um tipo de pedido: `POST /campaigns` para criar mesas, `GET /campaigns` para buscar o cardápio.
* **Janela B da Cozinha (Respostas HTTP):** Onde o garçom retira o resultado. Ele volta para a mesa com o prato pronto (Status `200 OK`) ou vai avisar que o ingrediente acabou (Status `404 Not Found`).

---

## 3. O Backend 
> *Tecnologias: TypeScript, Express, Zod*

A cozinha é um ambiente fechado, seguro e rigoroso, onde o trabalho pesado acontece. O cliente jamais entra aqui.

* **O Vice-Chefe / Inspetor (Middlewares e Zod):** Fica na Janela A. Antes de gastar tempo fazendo o prato, ele fiscaliza o pedido do garçom: *"O cliente pediu sistema 'Batman'? Isso não tem no cardápio de ENUMs! Rejeitado!"*. Ele barra dados sujos para não quebrar a cozinha.
* **O Chefe de Cozinha (Services / Business Logic):** É o cérebro da operação. Ele recebe o pedido aprovado pelo Vice-Chefe, aplica as regras de negócio do SaaS, diz a ordem do preparo e coordena a equipe.

---

## 4. O Estoque e a Força Bruta 📦 <br> (Banco de Dados)
> *Tecnologias: Prisma ORM, PostgreSQL*

A dispensa do restaurante precisa ser perfeitamente organizada para que os dados nunca se percam.

* **A Dispensa de Comida (PostgreSQL):** É o cofre trancado a sete chaves (rodando na nuvem do Supabase). Tudo está guardado em prateleiras perfeitas (Tabelas e Relações). O garçom (Node.js) não tem a chave da dispensa.
* **Os Cozinheiros / Auxiliares (Prisma ORM):** Eles são os únicos com acesso à Dispensa. O Chefe grita a ordem, os Cozinheiros (Prisma) sabem exatamente como entrar na dispensa (PostgreSQL), buscar os ingredientes com segurança, picar e entregar na mão do Chefe. Tudo isso usando o `schema.prisma`.
* **Lava-louças e Depósito (Garbage Collector e Logs):** Funcionários invisíveis que passam limpando a memória do servidor tirando os dados antigos para o sistema não travar, além de anotar tudo que quebrou no expediente para manutenção futura.