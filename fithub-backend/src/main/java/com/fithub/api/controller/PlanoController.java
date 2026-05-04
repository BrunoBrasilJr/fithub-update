package com.fithub.api.controller;

import com.fithub.api.dto.plano.PlanoRequest;
import com.fithub.api.dto.plano.PlanoResponse;
import com.fithub.api.security.AcademiaContextHelper;
import com.fithub.api.service.PlanoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/planos")
@RequiredArgsConstructor
public class PlanoController {

    private final PlanoService planoService;
    private final AcademiaContextHelper academiaContextHelper;

    @GetMapping
    public ResponseEntity<List<PlanoResponse>> listar(HttpServletRequest request) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(request);
        return ResponseEntity.ok(planoService.listar(academiaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanoResponse> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(planoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PlanoResponse> criar(@RequestBody PlanoRequest request, HttpServletRequest httpRequest) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(httpRequest);
        return ResponseEntity.ok(planoService.criar(request, academiaId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanoResponse> atualizar(@PathVariable UUID id, @RequestBody PlanoRequest request) {
        return ResponseEntity.ok(planoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        planoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}