package com.fithub.api.dto;

import lombok.Data;

@Data
public class AcademiaRequest {
    private String dominio;
    private String nomeAcademia;
    private String corPrimaria;
    private String logoUrl;
}