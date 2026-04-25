package com.fithub.api.controller;

import com.fithub.api.dto.aluno.AlunoRequest;
import com.fithub.api.dto.aluno.AlunoResponse;
import com.fithub.api.service.AlunoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    @GetMapping
    public ResponseEntity<List<AlunoResponse>> listar() {
        return ResponseEntity.ok(alunoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponse> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<AlunoResponse> criar(@RequestBody AlunoRequest request) {
        return ResponseEntity.ok(alunoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoResponse> atualizar(@PathVariable UUID id, @RequestBody AlunoRequest request) {
        return ResponseEntity.ok(alunoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        alunoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}