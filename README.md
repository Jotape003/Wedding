# Site de Casamento & Gestão de Cerimonial

Este é o repositório oficial do nosso site de casamento. Mais do que uma simples página de informações, este projeto é uma plataforma *full-stack* completa, desenvolvida sob medida para gerenciar a lista de presentes, a confirmação de presença (RSVP) integrada por famílias e um painel de controle administrativo exclusivo para os noivos.

## Sobre o Projeto

O sistema foi desenhado com uma interface elegante, paleta de cores pastéis (sage, blush, butter) e uma arquitetura robusta. Ele elimina a necessidade de serviços terceirizados caros de cerimonial digital, oferecendo controle total sobre os dados dos convidados e os recebimentos via PIX e Cartão de Crédito.

## 🛠️ Tecnologias Utilizadas

* **Front-end:** Next.js (App Router), React, Tailwind CSS, Framer Motion (Animações).
* **Back-end:** Next.js Server Actions.
* **Banco de Dados:** PostgreSQL, Prisma ORM.
* **Ícones:** Lucide React.
* **Deploy:** Vercel.

## 🌟 Principais Funcionalidades

### Para os Convidados:
* **Lista de Presentes Inteligente:** Fluxo de pagamento "à prova de curiosos". O item só é bloqueado no banco de dados após o convidado informar o nome, deixar uma mensagem e confirmar ativamente que concluiu o PIX ou Cartão.
* **Geração de QR Code:** Conversão automática de chaves PIX em imagens QR Code na própria tela.
* **RSVP Fechado:** Confirmação de presença restrita através de Códigos de Acesso únicos por família (enviados no convite físico).

### Para os Noivos (Painel Secreto):
* **Dashboard em Tempo Real:** Acompanhamento de metas de arrecadação financeira, dias restantes para o evento e progresso das confirmações de presença.
* **CRM de Famílias:** Criação de núcleos familiares e geração de códigos de acesso com 1 clique.
* **Gestão de Convidados:** Adição, edição e remoção de convidados, com filtro de busca em tempo real.
* **Controle de Presentes:** Lista detalhada com o nome do comprador, valor arrecadado e mensagens de carinho deixadas no momento da reserva.

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para rodar o projeto na sua máquina:

### 1. Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado na sua máquina. Você também precisará de um banco de dados PostgreSQL rodando (localmente ou em nuvem, como na Vercel ou Supabase).

### 2. Clonando o Repositório
```bash
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
cd seu-repositorio