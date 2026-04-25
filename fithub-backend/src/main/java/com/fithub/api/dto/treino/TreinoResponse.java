package com.fithub.api.dto.treino;

import com.fithub.api.entity.Treino;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
public class TreinoResponse {
    private UUID id;
    private String nome;
    private String descricao;
    private String diaSemana;
    private UUID alunoId;
    private String alunoNome;
    private List<ExercicioResponse> exercicios;
    private String createdAt;

    public static TreinoResponse from(Treino treino) {
        return TreinoResponse.builder()
                .id(treino.getId())
                .nome(treino.getNome())
                .descricao(treino.getDescricao())
                .diaSemana(treino.getDiaSemana())
                .alunoId(treino.getAluno().getId())
                .alunoNome(treino.getAluno().getNome())
                .exercicios(treino.getExercicios().stream().map(ExercicioResponse::from).collect(Collectors.toList()))
                .createdAt(treino.getCreatedAt().toString())
                .build();
    }
}