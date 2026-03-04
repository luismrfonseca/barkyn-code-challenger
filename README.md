# 🐾 Dog Academy - Fullstack Challenge
## 🚀 Overview
Este projeto é uma plataforma de gestão de cursos para cães, desenvolvida como um desafio técnico Fullstack. A aplicação permite gerir um catálogo de cursos, inscrições de utilizadores e um sistema de progressão lógica, garantindo a integridade dos dados em cenários de alta concorrência.

## 🏗️ Decisões Arquiteturais (Senior Perspective)
1. Integridade de Dados & Race Conditions
A "Regra de Ouro" deste desafio (prevenir overbooking) foi abordada garantindo que o número de vagas nunca seja excedido, mesmo em cenários de alta concorrência. Implementei uma estratégia de Integridade ao nível da base de dados.

* Check Constraint: Adicionei uma restrição nativa no PostgreSQL:

```sql
ALTER TABLE courses ADD CONSTRAINT slots_not_negative CHECK ("availableSlots" >= 0);
```
Isto garante, independentemente de qualquer bug na camada aplicacional, o motor do SQL rejeitará qualquer operação que tente reduzir as vagas abaixo de zero.


* Database Transaction: As operações de inscrição são executadas dentro de uma transação ACID. Se o decremento da vaga falhar (devido à violação da constraint) ou se a criação do registo de inscrição falhar, o sistema efetua um rollback automático, mantendo a consistência absoluta dos dados.

2. Sistema de Progressão (Blocked Progression)
Implementei uma lógica de desbloqueio baseada na ordem sequencial dos cursos (sortOrder).

    * Backend: O endpoint de inscrição valida se o utilizador existe e se já concluiu o curso anterior antes de permitir a nova inscrição no curso seguinte.

    * Frontend: O estado de cada curso (Bloqueado, Inscreva-se, Inscrito, Concluído) é calculado dinamicamente, permitindo uma interface reativa que guia o utilizador na sua jornada de aprendizagem.

3. Developer Experience (DX) & Testabilidade
Para facilitar a avaliação técnica, a interface inclui um User Switcher na barra lateral. Isto permite alternar instantaneamente entre 20 utilizadores pré-configurados com diferentes níveis de progresso, permitindo validar o comportamento da aplicação (bloqueio de cursos, progresso concluído, etc.) sem necessidade de manipulação manual da base de dados.

## 🛠️ Tech Stack
* Frontend: Next.js 14 (App Router), Tailwind CSS, TanStack Query (React Query).

* Backend: NestJS, Prisma ORM.

* Database: PostgreSQL.

## 🚦 Como Executar o Projeto
1. Instalação
```bash
# Instalar dependências (na raiz do monorepo)
pnpm install
```
2. Base de Dados
Certifica-te de que tens o Docker a correr e executa:

```bash
# Levantar o contentor PostgreSQL
docker-compose up -d

# Correr as migrations e o seeder (fundamental para os dados de teste)
cd apps/api
npx prisma migrate dev
npx prisma db seed
```
3. Iniciar a Aplicação
```bash
# Na raiz do projeto
pnpm dev
```
A aplicação estará disponível em http://localhost:3000.

## 🧪 Cenários de Teste Sugeridos
* Teste de Concorrência: Abre duas janelas do browser com utilizadores diferentes e tenta inscrever ambos num curso com apenas 1 vaga restante. Observa o tratamento de erro automático na segunda tentativa.
* Teste de Progressão: Seleciona um utilizador novo e tenta aceder ao "Curso B" sem concluir o "Curso A". O sistema bloqueará a ação visualmente e na API.

## 📈 Melhorias Futuras
* Implementação de Redis: Para caching do catálogo em cenários de leitura massiva.

* Testes E2E: Adicionar Cypress ou Playwright para cobrir o fluxo crítico de inscrição.

* Auth Real: Substituir o mock de utilizador por uma solução robusta como NextAuth ou Clerk.