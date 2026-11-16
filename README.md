Projeto inicial de portfólio pessoal usando NodeJS e Angular Material.


Aluno: gabriel Vinicius da Silva
Curso: Técnico em Informática IFPR, 3º ano
Matéria: Desenvolvimento Web II


Programas utilizados -
NodeJS (versão 24.14.0)
Angular CLI (versão 21.2.13)
npm (versão 11.9.0)

1° Etapa: Criação e esboço inicial do projeto, apenas com uma mensagem de "em produção" no menu inicial e conexão com o servidor.

2° etapa: Página de ínicio e sobre bem descritas, com 4 páginas no total e que podem ser alternadas entre si sem resetar a aba do navegador.

3° etapa: subindo a API no ar, devolvendo JSON dos publicados com content-type e CORS. Anexação do banco de dados.



Início do projeto: 01/06/2026

## API em Node (aula 21)

Uma segunda versao da API, em JavaScript, na pasta `api-node/`.
O contrato de `GET /api/projetos` e o mesmo do `api/projetos.php`.

Como rodar:

    cd api-node
    npm install
    node server.js

A API sobe em http://localhost:3000. Teste com:

    curl -i http://localhost:3000/api/projetos

### Aula 22: a API lê do banco

Antes de subir a API, o MariaDB precisa estar de pé:

```bash
sudo service mariadb start
cd api-node
node server.js
```

Rotas que leem do `dwii_db`:

```bash
curl -i http://localhost:3000/api/projetos
curl -i http://localhost:3000/api/projetos/5
curl -i http://localhost:3000/api/tecnologias
```
### Aula 23: a API cria, altera e apaga

A API em uso e a de `api-node/`. Os arquivos `api/*.php` e `conexao.php` ficam no repositorio como historico do 2o trimestre.

```bash
curl -i -X POST http://localhost:3000/api/projetos -H "Content-Type: application/json" -d '{"nome":"Projeto de teste","ano":2026}'

curl -i -X PUT http://localhost:3000/api/projetos/7 -H "Content-Type: application/json" -d '{"nome":"Projeto de teste (editado)","ano":2026}'

curl -i -X DELETE http://localhost:3000/api/projetos/7
```

### Aula 19 e Atividade 15: gestão de projetos (PHP)

O mesmo endereco `api/projetos.php` decide a operacao pelo verbo HTTP: GET consulta, POST cria, PUT altera e DELETE apaga; o id identifica o registro.
Para a gestao, `GET /api/projetos.php?todos=1` lista publicados e rascunhos; a vitrine pública continua consultando somente os publicados.
A API PHP roda da raiz com `/usr/bin/php -S 0.0.0.0:8000`, e o Angular roda com `cd portfolio-angular && npm install && npx ng serve`.
Se o Codespace mudar de endereco, atualize `urlGestao` e `url` em `portfolio-angular/src/app/projeto.service.ts`.

- Depois de POST/PUT, a gestão chama `carregar()` para obter o estado atual do banco e limpa o formulário, sem F5.
- Depois do DELETE, `filter()` tira o projeto da lista em memória, economizando uma chamada de rede; se outra aba alterar o cadastro, esta lista local pode ficar desatualizada até nova consulta.
- Dois cliques muito rápidos no POST poderiam criar registros repetidos, porque são dois pedidos de criação. O estado `salvando` impede um novo envio enquanto o primeiro não conclui.
- Navegadores fazem pré-voo OPTIONS antes de certos pedidos entre origens para verificar métodos e cabeçalhos autorizados; o PHP responde 204 e anuncia GET, POST, PUT, DELETE e OPTIONS.
- Um link `<a href=".../projetos.php?id=5">Excluir</a>` não substitui o botão: links comuns enviam GET, e apagar exige DELETE. Prova: `curl -i -X DELETE 'http://localhost:8000/api/projetos.php?id=5'` (use um id descartável).

**Polimento pesquisado:** estado de lista vazia e mensagens visíveis de status/erro no componente `gestao`, com `role="status"` e `role="alert"`. Fonte: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role .

**Ficha de diagnóstico (Atividade 15):** antes, a API PHP só listava publicados e não existia a rota `/gestao`; agora ela possui os quatro verbos, estado de rascunho, formulário validado e mensagens de erro. Não alterei os componentes de Sobre e Contato, pois não são parte da atividade.

### 🎯 Autoavaliação — Atividade 15

Conceito pretendido: A.

- R1 — `api/projetos.php`, linhas 22–106: GET, POST, PUT, DELETE e respostas HTTP.
- R2 — `portfolio-angular/src/app/projeto.service.ts` e `portfolio-angular/src/app/gestao/gestao.ts`: CRUD pelo service.
- R3 — `portfolio-angular/src/app/gestao/gestao.ts` e `gestao.html`: lista atualizada sem F5, formulário e confirmação para excluir.
- R4 — README, seção "Aula 19 e Atividade 15": justificativas das operações.
- R5 — `portfolio-angular/src/app/gestao/gestao.css`, `portfolio-angular/src/index.html` e instruções de execução nesta seção.

### Aula 24: a tranca

A API de Node exige autenticacao para POST, PUT e DELETE. Primeiro, no Codespace com MariaDB instalado e os dados da Aula 16:

```bash
sudo service mariadb start
sudo mariadb dwii_db < sql/usuarios.sql
cd api-node
npm install
node criar-usuario.js SEU_EMAIL SUA_SENHA
node server.js
```

O script cria o usuario com hash bcrypt e nao precisa ficar rodando. Execute-o uma vez por email. **Nao registre a senha real no Git ou neste README**. Para usar os curl, em outro terminal:

```bash
curl -i -X POST http://localhost:3000/api/login -H 'Content-Type: application/json' -d '{"email":"SEU_EMAIL","senha":"<senha>"}'
# Copie o token retornado, sem publicar seu valor:
TOKEN='COLE_SEU_TOKEN_APENAS_NESTE_TERMINAL'
curl -i http://localhost:3000/api/projetos
curl -i http://localhost:3000/api/tecnologias
curl -i -X POST http://localhost:3000/api/projetos -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"nome":"Projeto teste","ano":2026}'
curl -i -X PUT http://localhost:3000/api/projetos/ID -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"nome":"Projeto teste editado","ano":2026}'
curl -i -X DELETE http://localhost:3000/api/projetos/ID -H "Authorization: Bearer $TOKEN"
```

A validade foi escolhida em **3h**, diferente das 2h do exemplo: da tempo de executar os exercicios sem renovar a cada pouco, mas o acesso ainda vence. O login devolve a **mesma resposta** tanto para email inexistente quanto para senha errada para nao revelar contas cadastradas.

#### Entrega A — rotas e token

| Rota | Verbo | Precisa de token? |
| --- | --- | --- |
| /api/login | POST | Nao |
| /api/projetos | GET | Nao |
| /api/projetos/:id | GET | Nao |
| /api/projetos/todos | GET | Sim |
| /api/projetos | POST | Sim |
| /api/projetos/:id | PUT | Sim |
| /api/projetos/:id | DELETE | Sim |
| /api/tecnologias | GET | Nao |
| /api/tecnologias | POST | Sim |
| /api/tecnologias/:id | PUT | Sim |
| /api/tecnologias/:id | DELETE | Sim |

`GET /api/projetos/todos` devolve publicados e rascunhos somente para quem estiver autenticado. O GET publico continua filtrando somente publicados. O middleware `autenticar` e unico, antes das rotas.

**Por que o SEGREDO em server.js nao serve para producao?** Qualquer pessoa com acesso ao codigo no repositorio pode ler a chave e criar tokens validos. A Aula 29 move a chave para um arquivo `.env` que nao deve entrar no Git. Antes de colocar o sistema online, configure uma chave privada longa e nunca exponha o token.

**O que esta API ainda nao faz:** (1) nao revoga um token antes do fim de sua validade; (2) nao aplica controle de acesso por perfis diferentes, pois so existe o dono.

Os resultados reais de HTTP para os comandos desta aula devem ser registrados após a execução no Codespace, sem expor a senha ou o token.

Uso de IA: auxílio na organização do código das aulas e do README.

### Aula 25: o Portfolio em React

O front novo nasce em `portfolio-react/` (Vite + React), ao lado do Angular. Para rodar:

    cd portfolio-react
    npm install
    npm run dev

A tela abre na porta 5173. Por enquanto os projetos sao fixos no `src/App.jsx`; a Aula 27 os traz da API.

A interface usa os componentes `Cabecalho`, `CardProjeto` e `Rodape`; links GitHub so aparecem quando cadastrados. O rodape identifica o autor do portfolio.

### Aula 26: estado, lista e formulario

Os projetos sairam do `App.jsx` e moram em `src/projetos.js`. A tela os desenha com `map`, usando `key={p.id}`.

O formulario de contato (`src/Contato.jsx`) guarda nome, email e mensagem no estado, com `useState`.
Ele ainda nao envia nada: avisa e limpa os campos. O envio de verdade chega com a API.
