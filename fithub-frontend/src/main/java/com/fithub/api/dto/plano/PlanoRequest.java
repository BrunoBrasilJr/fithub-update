package com.fithub.api.dto.plano;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PlanoRequest {
    private String nome;
    private String tipo;
    private BigDecimal valor;
    private String descricao;
}