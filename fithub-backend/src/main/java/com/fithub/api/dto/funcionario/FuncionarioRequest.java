package com.fithub.api.dto.funcionario;

import lombok.Data;

@Data
public class FuncionarioRequest {
    private String nome;
    private String email;
    private String role;
    private String telefone;
    private String dataNascimento;
    private String fotoUrl;
}