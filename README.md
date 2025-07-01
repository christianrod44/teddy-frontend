# Teddy - Frontend

Este é o projeto frontend do Teddy, desenvolvido com Angular. Ele permite a gestão de clientes, visualização de dados, e interação com APIs para operações CRUD.

## Tecnologias Utilizadas

* **Angular CLI**: Para gerenciar o projeto e os builds.
* **Angular (versão 16+)**: Framework principal para construção da interface.
* **TypeScript**: Linguagem de programação.
* **SCSS**: Para estilos CSS.

## Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas em sua máquina:

* **Node.js**: Versão 18.x ou superior. (Recomendado o uso de um gerenciador de versão como NVM ou Volta).
    * Você pode baixar o Node.js em [nodejs.org](https://nodejs.org/).
* **npm** (Node Package Manager) ou **Yarn** ou **pnpm**: Gerenciador de pacotes do Node.js. Geralmente, vem junto com a instalação do Node.js.
    * Verifique a versão do npm: `npm -v`
    * Se for usar pnpm: `npm install -g pnpm`
    * Se for usar Yarn: `npm install -g yarn`
* **Angular CLI**: Versão 19.x ou superior.
    * Instale o Angular CLI globalmente com: `npm install -g @angular/cli`

## Instalação

Siga os passos abaixo para configurar e rodar o projeto em sua máquina local.

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/christianrod44/teddy-frontend.git](https://github.com/christianrod44/teddy-frontend.git)
    cd teddy-frontend
    ```

2.  **Instale as dependências:**
    Escolha o gerenciador de pacotes de sua preferência:

    ```bash
    # Usando npm (padrão)
    npm install

    # Ou usando yarn
    # yarn install

    # Ou usando pnpm
    # pnpm install
    ```

## Executando a Aplicação

Depois de instalar as dependências, você pode iniciar o servidor de desenvolvimento.

1.  **Inicie o servidor de desenvolvimento:**

    ```bash
    ng serve
    ```

    Este comando irá compilar o projeto e iniciar um servidor de desenvolvimento. A aplicação estará disponível em `http://localhost:4200/` por padrão.

    * Se a porta 4200 estiver ocupada, o Angular CLI sugerirá uma porta alternativa.
    * As alterações nos arquivos serão automaticamente recarregadas no navegador.

2.  **Abra o navegador:**
    Navegue até `http://localhost:4200/` em seu navegador para ver a aplicação em execução.

## Estrutura de Assets e Favicon (Importante para Angular 16+)

A partir do Angular v16, o Angular CLI adotou uma nova abordagem para o gerenciamento de assets públicos, utilizando a pasta `public/`.

* **Favicon**: O arquivo `favicon.ico` (o ícone da aba do navegador) e outros ativos estáticos (como imagens globais que não são específicas de componentes) devem ser colocados na pasta `public/` na raiz do projeto.
    * Certifique-se de que seu `favicon.ico` está em `public/favicon.ico`.
    * A referência no `src/index.html` deve ser `href="favicon.ico"`.

## Testes

Para executar os testes unitários da aplicação:

```bash
ng test