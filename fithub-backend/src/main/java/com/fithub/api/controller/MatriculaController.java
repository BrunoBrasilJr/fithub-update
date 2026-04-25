package com.fithub.api.controller;

import com.fithub.api.dto.matricula.MatriculaRequest;
import com.fithub.api.dto.matricula.MatriculaResponse;
import com.fithub.api.service.MatriculaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/matriculas")
@RequiredArgsConstructor
public class MatriculaController {

    private final MatriculaService matriculaService;

    @GetMapping
    public ResponseEntity<List<MatriculaResponse>> listar() {
        return ResponseEntity.ok(matriculaService.listar());
    }

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<MatriculaResponse>> listarPorAluno(@PathVariable UUID alunoId) {
        return ResponseEntity.ok(matriculaService.listarPorAluno(alunoId));
    }

    @PostMapping
    public ResponseEntity<MatriculaResponse> criar(@RequestBody MatriculaRequest request) {
        return ResponseEntity.ok(matriculaService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MatriculaResponse> atualizar(@PathVariable UUID id, @RequestBody MatriculaRequest request) {
        return ResponseEntity.ok(matriculaService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        matriculaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}