package com.fithub.api.dto;

import lombok.Data;

@Data
public class TrocaSenhaRequest {
    private String senhaAtual;
    private String novaSenha;
}