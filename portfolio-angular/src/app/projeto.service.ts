import {Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Projeto {
    id: number;
    nome: string;
    descricao: string;
    tecnologias: string;
    link_github: string;
    ano: number;
}

@Injectable({ providedIn: 'root' })
export class ProjetoService {
    private http = inject(HttpClient);
    private Url = 'https://ideal-dollop-4j4rwr5gjp99fq7wv-8000.app.github.dev/api/projetos.php';

    listar(): Observable<Projeto[]> {
        return this.http.get<Projeto[]>(this.Url);
    }
}