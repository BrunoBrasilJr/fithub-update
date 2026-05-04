package com.fithub.api.controller;

import com.fithub.api.dto.AcademiaRequest;
import com.fithub.api.dto.AcademiaResponse;
import com.fithub.api.service.AcademiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AcademiaController {

    private final AcademiaService academiaService;

    // Endpoint PÚBLICO — frontend carrega tema antes de logar
    @GetMapping("/public/academia")
    public ResponseEntity<AcademiaResponse> buscarPorDominio(@RequestParam String dominio) {
        return ResponseEntity.ok(academiaService.buscarPorDominio(dominio));
    }

    // Endpoints super admin
    @PostMapping("/super/academias")
    public ResponseEntity<AcademiaResponse> criar(@RequestBody AcademiaRequest request) {
        return ResponseEntity.ok(academiaService.criar(request));
    }

    @GetMapping("/super/academias")
    public ResponseEntity<List<AcademiaResponse>> listar() {
        return ResponseEntity.ok(academiaService.listar());
    }

    @PutMapping("/super/academias/{id}")
    public ResponseEntity<AcademiaResponse> atualizar(@PathVariable UUID id, @RequestBody AcademiaRequest request) {
        return ResponseEntity.ok(academiaService.atualizar(id, request));
    }

    @DeleteMapping("/super/academias/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        academiaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}