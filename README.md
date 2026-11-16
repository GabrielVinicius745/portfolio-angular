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
    npm-install
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

**Provas para recolher no Codespace (ainda não executadas aqui):** capturas da aba Network com método e status, resultado do SELECT de projetos e saídas reais dos curl 201/200/204/400/404/405 e OPTIONS. Não são simuladas no README.

### 🎯 Autoavaliação — Atividade 15

Conceito visado: **A**, sujeito às provas de execução e capturas pedidas no Moodle. R1: `api/projetos.php`, blocos POST/PUT/DELETE; R2: `portfolio-angular/src/app/gestao/gestao.ts`, métodos `salvar`, `carregar`, `excluir`; R3: `gestao.html`, validação, status e mensagens; R4: esta seção e as justificativas; R5: `gestao.css` e estados de tela (validação no celular e teclado pendente).

**Registro de Network a completar com resultado observado:** método: ___; status: ___; Content-Type: ___; 201 indica recurso criado e 204 indica exclusão sem corpo.
