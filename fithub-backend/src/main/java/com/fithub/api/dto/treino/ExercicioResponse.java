package com.fithub.api.dto.treino;

import com.fithub.api.entity.Exercicio;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ExercicioResponse {
    private UUID id;
    private String nome;
    private Integer series;
    private String repeticoes;
    private String carga;
    private String observacao;

    public static ExercicioResponse from(Exercicio e) {
        return ExercicioResponse.builder()
                .id(e.getId())
                .nome(e.getNome())
                .series(e.getSeries())
                .repeticoes(e.getRepeticoes())
                .carga(e.getCarga())
                .observacao(e.getObservacao())
                .build();
    }
}