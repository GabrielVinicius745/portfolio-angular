// api-node/server.js - API do Portfolio em Node (Aulas 21 a 24)
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
const PORTA = 3000;
// A chave que assina os tokens. Fica aqui so ate a Aula 29, quando vai para o .env.
// Antes de abrir a API ao publico, substitua esta frase por uma longa, escolhida por voce.
const SEGREDO = 'troque-por-uma-frase-longa-que-so-voce-sabe';

app.use(cors());
app.use(express.json());

// Middleware unico: so as rotas que o pedem exigem um token.
function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization ?? '';
  const token = cabecalho.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado: token nao informado' });
  }
  try {
    req.usuario = jwt.verify(token, SEGREDO);
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token expirado ou assinatura invalida' });
  }
}

app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Portfolio em Node' });
});

// POST /api/login: email e senha -> token. Mensagem igual para email inexistente e senha errada.
app.post('/api/login', async (req, res) => {
  try {
    const dados = req.body;
    if (!dados || !dados.email || !dados.senha) {
      return res.status(400).json({ erro: 'Informe email e senha' });
    }
    const [linhas] = await pool.execute('SELECT id, email, senha_hash FROM usuarios WHERE email = ?', [dados.email]);
    const usuario = linhas[0];
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais incorretas' });
    }
    const confere = await bcrypt.compare(dados.senha, usuario.senha_hash);
    if (!confere) {
      return res.status(401).json({ erro: 'Credenciais incorretas' });
    }
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, SEGREDO, { expiresIn: '3h' });
    res.json({ token });
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// GET publico: so publicados (Aula 22).
app.get('/api/projetos', async (req, res) => {
  try {
    const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos WHERE status = 'publicado' ORDER BY ano DESC, id";
    const [projetos] = await pool.query(sql);
    res.json(projetos);
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// Entrega A: leitura de todos os projetos, incluindo rascunhos, exige token.
// Antes do :id para o Express nao interpretar 'todos' como id.
app.get('/api/projetos/todos', autenticar, async (req, res) => {
  try {
    const sql = 'SELECT id, nome, descricao, tecnologias, link_github, ano, status FROM projetos ORDER BY ano DESC, id';
    const [projetos] = await pool.query(sql);
    res.json(projetos);
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

app.get('/api/projetos/:id', async (req, res) => {
  try {
    const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos WHERE id = ? AND status = 'publicado'";
    const [linhas] = await pool.execute(sql, [req.params.id]);
    if (linhas.length === 0) {
      return res.status(404).json({ erro: 'Projeto nao encontrado' });
    }
    res.json(linhas[0]);
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// Aula 23: os dados de escrita chegam em JSON e os parametros vao por ? no SQL.
app.post('/api/projetos', autenticar, async (req, res) => {
  try {
    const dados = req.body;
    if (!dados || !dados.nome) {
      return res.status(400).json({ erro: 'Informe pelo menos o nome do projeto' });
    }
    const sql = 'INSERT INTO projetos (nome, descricao, tecnologias, link_github, ano, status) VALUES (?, ?, ?, ?, ?, ?)';
    const [resultado] = await pool.execute(sql, [
      dados.nome, dados.descricao ?? '', dados.tecnologias ?? '',
      dados.link_github ?? '', dados.ano ?? 2026, dados.status ?? 'publicado'
    ]);
    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

app.put('/api/projetos/:id', autenticar, async (req, res) => {
  try {
    const dados = req.body;
    if (!dados || !dados.nome) {
      return res.status(400).json({ erro: 'Informe pelo menos o nome do projeto' });
    }
    const sql = 'UPDATE projetos SET nome = ?, descricao = ?, tecnologias = ?, link_github = ?, ano = ?, status = ? WHERE id = ?';
    const [resultado] = await pool.execute(sql, [
      dados.nome, dados.descricao ?? '', dados.tecnologias ?? '',
      dados.link_github ?? '', dados.ano ?? 2026, dados.status ?? 'publicado',
      req.params.id
    ]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Projeto nao encontrado' });
    }
    res.json({ mensagem: 'Projeto atualizado' });
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

app.delete('/api/projetos/:id', autenticar, async (req, res) => {
  try {
    const [resultado] = await pool.execute('DELETE FROM projetos WHERE id = ?', [req.params.id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Projeto nao encontrado' });
    }
    res.status(204).end();
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// Aula 22: catalogo publico.
app.get('/api/tecnologias', async (req, res) => {
  try {
    const sql = "SELECT id, nome, categoria, descricao, ano_criacao FROM tecnologias WHERE status = 'ativo' ORDER BY categoria, nome";
    const [tecnologias] = await pool.query(sql);
    res.json(tecnologias);
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// Entrega A nivel B: as tres escritas do catalogo tambem sao autenticadas.
app.post('/api/tecnologias', autenticar, async (req, res) => {
  try {
    const dados = req.body;
    if (!dados || !dados.nome || !dados.categoria) {
      return res.status(400).json({ erro: 'Informe nome e categoria da tecnologia' });
    }
    const [resultado] = await pool.execute(
      'INSERT INTO tecnologias (nome, categoria, descricao, ano_criacao) VALUES (?, ?, ?, ?)',
      [dados.nome, dados.categoria, dados.descricao ?? '', dados.ano_criacao ?? null]
    );
    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

app.put('/api/tecnologias/:id', autenticar, async (req, res) => {
  try {
    const dados = req.body;
    if (!dados || !dados.nome || !dados.categoria) {
      return res.status(400).json({ erro: 'Informe nome e categoria da tecnologia' });
    }
    const [resultado] = await pool.execute(
      'UPDATE tecnologias SET nome = ?, categoria = ?, descricao = ?, ano_criacao = ? WHERE id = ?',
      [dados.nome, dados.categoria, dados.descricao ?? '', dados.ano_criacao ?? null, req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Tecnologia nao encontrada' });
    }
    res.json({ mensagem: 'Tecnologia atualizada' });
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

app.delete('/api/tecnologias/:id', autenticar, async (req, res) => {
  try {
    const [resultado] = await pool.execute('DELETE FROM tecnologias WHERE id = ?', [req.params.id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Tecnologia nao encontrada' });
    }
    res.status(204).end();
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

app.listen(PORTA, () => {
  console.log('API no ar em http://localhost:' + PORTA);
});
