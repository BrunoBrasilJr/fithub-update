package com.fithub.api.controller;

import com.fithub.api.dto.aluno.AlunoRequest;
import com.fithub.api.dto.aluno.AlunoResponse;
import com.fithub.api.security.AcademiaContextHelper;
import com.fithub.api.service.AlunoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;
    private final AcademiaContextHelper academiaContextHelper;

    @GetMapping
    public ResponseEntity<List<AlunoResponse>> listar(HttpServletRequest request) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(request);
        return ResponseEntity.ok(alunoService.listar(academiaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponse> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<AlunoResponse> criar(@RequestBody AlunoRequest request, HttpServletRequest httpRequest) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(httpRequest);
        return ResponseEntity.ok(alunoService.criar(request, academiaId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoResponse> atualizar(@PathVariable UUID id, @RequestBody AlunoRequest request) {
        return ResponseEntity.ok(alunoService.atualizar(id, request));
    }

    @PutMapping("/{id}/foto")
    public ResponseEntity<AlunoResponse> atualizarFoto(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(alunoService.atualizarFoto(id, body.get("fotoUrl")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        alunoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}