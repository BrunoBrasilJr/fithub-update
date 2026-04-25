package com.fithub.api.dto.treino;

import lombok.Data;

@Data
public class ExercicioRequest {
    private String nome;
    private Integer series;
    private String repeticoes;
    private String carga;
    private String observacao;
}