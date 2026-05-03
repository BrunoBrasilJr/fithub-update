package com.fithub.api.dto.matricula;

import lombok.Data;
import java.util.UUID;

@Data
public class MatriculaRequest {
    private UUID alunoId;
    private UUID planoId;
    private String status;
    private String dataInicio;
    private String dataFim;
}