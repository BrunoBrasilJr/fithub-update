package com.fithub.api.dto;

import com.fithub.api.entity.User;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UserDto {
    private UUID id;
    private String nome;
    private String email;
    private String role;
    private boolean primeiroAcesso;
    private boolean ativo;

    public static UserDto from(User user) {
        return UserDto.builder()
                .id(user.getId())
                .nome(user.getNome())
                .email(user.getEmail())
                .role(user.getRole().name())
                .primeiroAcesso(user.isPrimeiroAcesso())
                .ativo(user.isAtivo())
                .build();
    }
}