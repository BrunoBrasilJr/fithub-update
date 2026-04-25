package com.fithub.api.dto.treino;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class TreinoRequest {
    private String nome;
    private String descricao;
    private String diaSemana;
    private UUID alunoId;
    private List<ExercicioRequest> exercicios;
}