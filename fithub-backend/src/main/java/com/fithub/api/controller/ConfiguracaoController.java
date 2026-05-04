package com.fithub.api.controller;

import com.fithub.api.dto.ConfiguracaoDto;
import com.fithub.api.service.ConfiguracaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ConfiguracaoController {

    private final ConfiguracaoService configuracaoService;

    @GetMapping("/admin/configuracao")
    public ResponseEntity<ConfiguracaoDto> buscarAdmin() {
        return ResponseEntity.ok(configuracaoService.buscar());
    }

    @PutMapping("/admin/configuracao")
    public ResponseEntity<ConfiguracaoDto> salvar(@RequestBody ConfiguracaoDto dto) {
        return ResponseEntity.ok(configuracaoService.salvar(dto));
    }

    @GetMapping("/public/configuracao")
    public ResponseEntity<ConfiguracaoDto> buscarPublico() {
        return ResponseEntity.ok(configuracaoService.buscar());
    }
}