package com.fithub.api.dto.aluno;

import com.fithub.api.entity.Aluno;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class AlunoResponse {
    private UUID id;
    private String nome;
    private String email;
    private String telefone;
    private String dataNascimento;
    private String observacoes;
    private String fotoUrl;
    private boolean ativo;
    private String createdAt;

    public static AlunoResponse from(Aluno aluno) {
        return AlunoResponse.builder()
                .id(aluno.getId())
                .nome(aluno.getNome())
                .email(aluno.getEmail())
                .telefone(aluno.getTelefone())
                .dataNascimento(aluno.getDataNascimento() != null ? aluno.getDataNascimento().toString() : null)
                .observacoes(aluno.getObservacoes())
                .fotoUrl(aluno.getFotoUrl())
                .ativo(aluno.isAtivo())
                .createdAt(aluno.getCreatedAt().toString())
                .build();
    }
}