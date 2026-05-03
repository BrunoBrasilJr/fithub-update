package com.fithub.api.dto.matricula;

import com.fithub.api.dto.aluno.AlunoResponse;
import com.fithub.api.dto.plano.PlanoResponse;
import com.fithub.api.entity.Matricula;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class MatriculaResponse {
    private UUID id;
    private String status;
    private String dataInicio;
    private String dataFim;
    private AlunoResponse aluno;
    private PlanoResponse plano;

    public static MatriculaResponse from(Matricula matricula) {
        return MatriculaResponse.builder()
                .id(matricula.getId())
                .status(matricula.getStatus().name())
                .dataInicio(matricula.getDataInicio().toString())
                .dataFim(matricula.getDataFim().toString())
                .aluno(AlunoResponse.from(matricula.getAluno()))
                .plano(PlanoResponse.from(matricula.getPlano()))
                .build();
    }
}