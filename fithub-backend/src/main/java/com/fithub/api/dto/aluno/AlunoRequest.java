package com.fithub.api.dto.aluno;

import lombok.Data;

@Data
public class AlunoRequest {
    private String nome;
    private String email;
    private String telefone;
    private String dataNascimento;
    private String observacoes;
    private String fotoUrl;
    private boolean ativo;
}