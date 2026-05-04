package com.fithub.api.service;

import com.fithub.api.dto.ConfiguracaoDto;
import com.fithub.api.entity.Configuracao;
import com.fithub.api.repository.ConfiguracaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConfiguracaoService {

    private final ConfiguracaoRepository configuracaoRepository;

    public ConfiguracaoDto buscar() {
        return configuracaoRepository.findById(1L)
                .map(ConfiguracaoDto::from)
                .orElseGet(() -> {
                    ConfiguracaoDto dto = new ConfiguracaoDto();
                    dto.setNomeAcademia("FitHub");
                    dto.setCorPrimaria("#16a34a");
                    dto.setLogoUrl("");
                    return dto;
                });
    }

    public ConfiguracaoDto salvar(ConfiguracaoDto dto) {
        Configuracao config = configuracaoRepository.findById(1L)
                .orElse(Configuracao.builder().id(1L).build());

        config.setNomeAcademia(dto.getNomeAcademia());
        config.setCorPrimaria(dto.getCorPrimaria());
        config.setLogoUrl(dto.getLogoUrl());

        return ConfiguracaoDto.from(configuracaoRepository.save(config));
    }
}