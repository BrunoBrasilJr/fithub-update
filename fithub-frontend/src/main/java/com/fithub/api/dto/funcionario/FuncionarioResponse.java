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
    private String createdAt;

    public static FuncionarioResponse from(User user) {
        return FuncionarioResponse.builder()
                .id(user.getId())
                .nome(user.getNome())
                .email(user.getEmail())
                .role(user.getRole().name())
                .ativo(user.isAtivo())
                .createdAt(user.getCreatedAt().toString())
                .build();
    }
}