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
