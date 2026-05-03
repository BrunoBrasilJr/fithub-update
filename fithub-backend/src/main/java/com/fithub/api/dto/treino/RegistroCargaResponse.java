package com.fithub.api.dto.treino;

import com.fithub.api.entity.RegistroCarga;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class RegistroCargaResponse {
    private UUID id;
    private String carga;
    private String registradoEm;

    public static RegistroCargaResponse from(RegistroCarga r) {
        return RegistroCargaResponse.builder()
                .id(r.getId())
                .carga(r.getCarga())
                .registradoEm(r.getRegistradoEm().toString())
                .build();
    }
}