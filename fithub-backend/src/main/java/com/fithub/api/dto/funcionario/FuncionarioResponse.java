package com.fithub.api.dto.funcionario;

import com.fithub.api.entity.User;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class FuncionarioResponse {
    private UUID id;
    private String nome;
    private String email;
    private String role;
    private boolean ativo;
    private String telefone;
    private String dataNascimento;
    private String fotoUrl;
    private String createdAt;

    public static FuncionarioResponse from(User user) {
        return FuncionarioResponse.builder()
                .id(user.getId())
                .nome(user.getNome())
                .email(user.getEmail())
                .role(user.getRole().name())
                .ativo(user.isAtivo())
                .telefone(user.getTelefone())
                .dataNascimento(user.getDataNascimento() != null ? user.getDataNascimento().toString() : null)
                .fotoUrl(user.getFotoUrl())
                .createdAt(user.getCreatedAt().toString())
                .build();
    }
}