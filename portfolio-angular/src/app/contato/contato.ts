import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContatoService, NovoContato } from '../contato.service';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contato.html',
})
export class Contato {
  private fb = inject(FormBuilder);
  private contatoService = inject(ContatoService);
  enviando = false; sucesso = false; erro = '';

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    mensagem: ['', [Validators.required, Validators.minLength(10)]],
  });

  onSubmit() {
    this.sucesso = false; this.erro = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando = true;
    this.contatoService.enviar(this.form.value as NovoContato).subscribe({
      next: () => {
        this.enviando = false;
        this.sucesso = true;
        this.form.reset();
      },
      error: () => {
        this.erro = 'Nao foi possivel enviar. Tente novamente.';
        this.enviando = false;
      },
    });
  } 
}