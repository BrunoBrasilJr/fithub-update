package com.fithub.api.controller;

import com.fithub.api.dto.matricula.MatriculaRequest;
import com.fithub.api.dto.matricula.MatriculaResponse;
import com.fithub.api.security.AcademiaContextHelper;
import com.fithub.api.service.MatriculaService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class MatriculaController {

    private final MatriculaService matriculaService;
    private final AcademiaContextHelper academiaContextHelper;

    @GetMapping("/admin/matriculas")
    public ResponseEntity<List<MatriculaResponse>> listar(HttpServletRequest request) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(request);
        return ResponseEntity.ok(matriculaService.listar(academiaId));
    }

    @GetMapping("/admin/matriculas/aluno/{alunoId}")
    public ResponseEntity<List<MatriculaResponse>> listarPorAluno(@PathVariable UUID alunoId) {
        return ResponseEntity.ok(matriculaService.listarPorAluno(alunoId));
    }

    @PostMapping("/admin/matriculas")
    public ResponseEntity<MatriculaResponse> criar(@RequestBody MatriculaRequest request, HttpServletRequest httpRequest) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(httpRequest);
        return ResponseEntity.ok(matriculaService.criar(request, academiaId));
    }

    @PutMapping("/admin/matriculas/{id}")
    public ResponseEntity<MatriculaResponse> atualizar(@PathVariable UUID id, @RequestBody MatriculaRequest request) {
        return ResponseEntity.ok(matriculaService.atualizar(id, request));
    }

    @DeleteMapping("/admin/matriculas/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        matriculaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/aluno/matriculas")
    public ResponseEntity<List<MatriculaResponse>> listarMinhasMatriculas(Principal principal) {
        return ResponseEntity.ok(matriculaService.listarPorEmail(principal.getName()));
    }
}