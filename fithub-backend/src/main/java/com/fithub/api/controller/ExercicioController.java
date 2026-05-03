package com.fithub.api.controller;

import com.fithub.api.dto.treino.RegistroCargaResponse;
import com.fithub.api.service.ExercicioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/aluno/exercicios")
@RequiredArgsConstructor
public class ExercicioController {

    private final ExercicioService exercicioService;

    @PostMapping("/{id}/carga")
    public ResponseEntity<Void> registrarCarga(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            Principal principal) {
        exercicioService.registrarCarga(id, principal.getName(), body.get("carga"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/evolucao")
    public ResponseEntity<List<RegistroCargaResponse>> evolucao(
            @PathVariable UUID id,
            Principal principal) {
        return ResponseEntity.ok(exercicioService.evolucao(id, principal.getName()));
    }

    @GetMapping("/{id}/ultima-carga")
    public ResponseEntity<Map<String, String>> ultimaCarga(
            @PathVariable UUID id,
            Principal principal) {
        String carga = exercicioService.ultimaCarga(id, principal.getName());
        return ResponseEntity.ok(Map.of("carga", carga != null ? carga : ""));
    }
}