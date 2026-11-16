import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjetoService, Projeto } from '../projeto.service';

@Component({
  selector: 'app-gestao',
  imports: [ReactiveFormsModule],
  templateUrl: './gestao.html',
  styleUrl: './gestao.css'
})
export class Gestao implements OnInit {
  private service = inject(ProjetoService);
  projetos: Projeto[] = [];
  carregando = true;
  erro = '';
  aviso = '';
  editandoId: number | null = null;
  salvando = false;
  excluindo = false;

  form = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descricao: new FormControl(''),
    tecnologias: new FormControl(''),
    link_github: new FormControl(''),
    ano: new FormControl(2026, [Validators.required]),
    status: new FormControl<'rascunho' | 'publicado'>('publicado', [Validators.required]),
  });

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando = true;
    this.erro = '';
    this.service.listarGestao().subscribe({
      next: (lista) => { this.projetos = lista; this.carregando = false; },
      error: () => { this.erro = 'Nao foi possivel carregar os projetos.'; this.carregando = false; }
    });
  }

  editar(p: Projeto) {
    this.editandoId = p.id ?? null;
    this.form.patchValue({
      nome: p.nome, descricao: p.descricao, tecnologias: p.tecnologias,
      link_github: p.link_github, ano: p.ano,
      status: p.status === 'rascunho' ? 'rascunho' : 'publicado'
    });
    this.aviso = '';
  }

  salvar() {
    if (this.salvando) { return; }
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.salvando = true;
    this.erro = '';
    this.aviso = '';
    const dados = this.form.value as Projeto;
    const requisicao = this.editandoId
      ? this.service.atualizar(this.editandoId, dados)
      : this.service.criar(dados);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.editandoId = null;
        this.form.reset({
          nome: '', descricao: '', tecnologias: '', link_github: '',
          ano: 2026, status: 'publicado'
        });
        this.aviso = 'Projeto salvo com sucesso.';
        this.carregar();
      },
      error: () => { this.salvando = false; this.erro = 'Nao foi possivel salvar. Tente de novo.'; }
    });
  }

  excluir(p: Projeto) {
    if (!p.id || this.excluindo) { return; }
    if (!confirm('Excluir o projeto "' + p.nome + '"? Esta acao nao pode ser desfeita.')) { return; }
    this.excluindo = true;
    this.erro = '';
    this.service.excluir(p.id).subscribe({
      next: () => {
        this.projetos = this.projetos.filter(x => x.id !== p.id);
        this.excluindo = false;
        this.aviso = 'Projeto excluido.';
      },
      error: () => {
        this.excluindo = false;
        this.erro = 'Nao foi possivel excluir. Tente de novo.';
      }
    });
  }
}
