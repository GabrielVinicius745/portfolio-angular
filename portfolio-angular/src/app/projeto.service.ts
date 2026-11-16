import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Projeto {
    id?: number;
    nome: string;
    descricao: string;
    tecnologias: string;
    link_github: string;
    status?: 'rascunho' | 'publicado' | 'arquivado';
    ano: number;
}

@Injectable({ providedIn: 'root' })
export class ProjetoService {
    private http = inject(HttpClient);
    private urlGestao = 'https://ideal-dollop-4j4rwr5gjp99fq7wv-8000.app.github.dev/api/projetos.php';
    private url = 'https://ideal-dollop-4j4rwr5gjp99fq7wv-3000.app.github.dev/api/projetos';

    listar(): Observable<Projeto[]> {
        return this.http.get<Projeto[]>(this.url);
    }

    // Atividade 15: a gestao usa o CRUD PHP da Aula 19.
    listarGestao(): Observable<Projeto[]> {
        return this.http.get<Projeto[]>(this.urlGestao + '?todos=1');
    }

    // POST: o projeto vai inteiro no corpo. Sem id - quem gera o id e o banco.
    criar(projeto: Projeto): Observable<{ id?: number; mensagem?: string }> {
        return this.http.post<{ id?: number; mensagem?: string }>(this.urlGestao, projeto);
    }

    // PUT: o id vai na URL (qual projeto) e o projeto vai no corpo (o que gravar).
    atualizar(id: number, projeto: Projeto): Observable<{ id?: number; mensagem?: string }> {
        return this.http.put<{ id?: number; mensagem?: string }>(this.urlGestao + '?id=' + id, projeto);
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(this.urlGestao + '?id=' + id);
    }
}