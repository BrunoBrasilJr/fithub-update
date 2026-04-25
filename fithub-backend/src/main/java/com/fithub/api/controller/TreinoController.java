package com.fithub.api.controller;

import com.fithub.api.dto.treino.TreinoRequest;
import com.fithub.api.dto.treino.TreinoResponse;
import com.fithub.api.service.TreinoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TreinoController {

    private final TreinoService treinoService;

    @GetMapping("/admin/treinos")
    public ResponseEntity<List<TreinoResponse>> listar() {
        return ResponseEntity.ok(treinoService.listar());
    }

    @GetMapping("/admin/treinos/{id}")
    public ResponseEntity<TreinoResponse> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(treinoService.buscarPorId(id));
    }

    @GetMapping("/admin/treinos/aluno/{alunoId}")
    public ResponseEntity<List<TreinoResponse>> listarPorAlunoAdmin(@PathVariable UUID alunoId) {
        return ResponseEntity.ok(treinoService.listarPorAluno(alunoId));
    }

    @PostMapping("/admin/treinos")
    public ResponseEntity<TreinoResponse> criar(@RequestBody TreinoRequest request) {
        return ResponseEntity.ok(treinoService.criar(request));
    }

    @PutMapping("/admin/treinos/{id}")
    public ResponseEntity<TreinoResponse> atualizar(@PathVariable UUID id, @RequestBody TreinoRequest request) {
        return ResponseEntity.ok(treinoService.atualizar(id, request));
    }

    @DeleteMapping("/admin/treinos/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        treinoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/aluno/treinos")
    public ResponseEntity<List<TreinoResponse>> listarMeusTreinos(@RequestParam UUID alunoId) {
        return ResponseEntity.ok(treinoService.listarPorAluno(alunoId));
    }

    @GetMapping("/aluno/treinos/{id}")
    public ResponseEntity<TreinoResponse> buscarMeuTreino(@PathVariable UUID id) {
        return ResponseEntity.ok(treinoService.buscarPorId(id));
    }
}