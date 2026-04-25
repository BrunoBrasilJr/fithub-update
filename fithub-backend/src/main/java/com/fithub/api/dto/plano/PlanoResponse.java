package com.fithub.api.dto.plano;

import com.fithub.api.entity.Plano;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class PlanoResponse {
    private UUID id;
    private String nome;
    private String tipo;
    private BigDecimal valor;
    private String descricao;

    public static PlanoResponse from(Plano plano) {
        return PlanoResponse.builder()
                .id(plano.getId())
                .nome(plano.getNome())
                .tipo(plano.getTipo().name())
                .valor(plano.getValor())
                .descricao(plano.getDescricao())
                .build();
    }
}