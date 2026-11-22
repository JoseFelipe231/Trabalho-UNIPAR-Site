# 📦 Sistema de Gestão Logística

> Projeto acadêmico desenvolvido para o curso de **Engenharia de Software** (Universidade Paranaense — Unipar), com foco no gerenciamento de fretes, rotas, transportadoras e cargas compostas por múltiplos itens.

---

## 📋 Sobre o Projeto

O **Sistema de Gestão Logística** é uma aplicação web desenvolvida para automatizar o registro e o acompanhamento de operações de transporte de cargas. O sistema permite cadastrar rotas (origem e destino), vincular uma transportadora responsável, definir o status da entrega e adicionar dinamicamente múltiplos produtos a um único frete (relacionamento **1:N**), calculando automaticamente a quantidade total de volumes e o peso total da carga.

---

## 🚀 Funcionalidades

- **Cadastro de Rotas e Transportadoras:** Registro de endereços de origem e destino, seleção de transportadora (`TransParaná Logística`, `Expresso Sul`, `Carga Rápida Brasil`) e controle de status (`Aguardando Coleta`, `Em Trânsito`, `Entregue`).
- **Adição Dinâmica de Produtos (1:N):** Criação e remoção dinâmica de itens da carga (descrição, quantidade e peso unitário em kg) diretamente na interface.
- **Cálculo Automático de Carga:** Soma em tempo real da quantidade total de itens e do peso total ($\text{quantidade} \times \text{peso unitário}$) exibidos na listagem de fretes.
- **Persistência e Integridade de Dados:**
  - **Front-end:** Armazenamento local via `localStorage` para visualização e exclusão imediata na tabela.
  - **Back-end & Banco de Dados:** Estrutura relacional em **MySQL** com transações SQL (`PDO::beginTransaction`) e chave estrangeira (`ON DELETE CASCADE`) garantindo integridade entre o frete e seus itens.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3 (Grid Layout, Flexbox, variáveis CSS) e JavaScript (ES6+ / manipulação de DOM e `localStorage`).
- **Back-end:** PHP 8+ com **PDO** (*Prepared Statements* e controle transacional).
- **Banco de Dados:** MySQL / MariaDB (`utf8mb4`).
- **Ambiente de Desenvolvimento:** XAMPP (Apache + MySQL) e Visual Studio Code.

---

## 🗂️ Estrutura de Arquivos

```text
├── Index.html       # Interface principal (formulário de frete, itens dinâmicos e tabela)
├── style.css        # Estilização responsiva e identidade visual do sistema
├── script.js        # Lógica de campos dinâmicos, cálculos e renderização da tabela
├── conexao.php      # Configuração da conexão PDO com o banco de dados MySQL
├── Baackend2.php    # Processamento POST, validação de dados e inserção transacional
└── Banco.sql        # Script DDL para criação do banco logistica_db e tabelas
