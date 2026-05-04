package com.fithub.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    private String login; // formato: usuario@dominio ou email completo pro admin

    @NotBlank
    private String senha;
}