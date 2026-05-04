package com.fithub.api.dto.dashboard;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class DashboardResponse {
    private long totalAlunos;
    private long alunosAtivos;
    private long alunosInativos;
    private long totalPlanos;
    private long matriculasAtivas;
    private long matriculasVencidas;
    private BigDecimal receitaMensal;
}