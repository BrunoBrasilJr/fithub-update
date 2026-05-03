package com.fithub.api.dto.treino;

import com.fithub.api.entity.HistoricoTreino;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class HistoricoTreinoResponse {
    private UUID id;
    private UUID treinoId;
    private String treinoNome;
    private String diaSemana;
    private String concluidoEm;

    public static HistoricoTreinoResponse from(HistoricoTreino h) {
        return HistoricoTreinoResponse.builder()
                .id(h.getId())
                .treinoId(h.getTreino().getId())
                .treinoNome(h.getTreino().getNome())
                .diaSemana(h.getTreino().getDiaSemana())
                .concluidoEm(h.getConcluidoEm().toString())
                .build();
    }
}