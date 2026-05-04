package com.fithub.api.dto;

import com.fithub.api.entity.Academia;
import lombok.Data;
import java.util.UUID;

@Data
public class AcademiaResponse {
    private UUID id;
    private String dominio;
    private String nomeAcademia;
    private String corPrimaria;
    private String logoUrl;
    private boolean ativo;

    public static AcademiaResponse from(Academia a) {
        AcademiaResponse r = new AcademiaResponse();
        r.setId(a.getId());
        r.setDominio(a.getDominio());
        r.setNomeAcademia(a.getNomeAcademia());
        r.setCorPrimaria(a.getCorPrimaria());
        r.setLogoUrl(a.getLogoUrl());
        r.setAtivo(a.isAtivo());
        return r;
    }
}