package com.fithub.api.dto;

import com.fithub.api.entity.Configuracao;
import lombok.Data;

@Data
public class ConfiguracaoDto {
    private String nomeAcademia;
    private String corPrimaria;
    private String logoUrl;

    public static ConfiguracaoDto from(Configuracao c) {
        ConfiguracaoDto dto = new ConfiguracaoDto();
        dto.setNomeAcademia(c.getNomeAcademia());
        dto.setCorPrimaria(c.getCorPrimaria());
        dto.setLogoUrl(c.getLogoUrl());
        return dto;
    }
}