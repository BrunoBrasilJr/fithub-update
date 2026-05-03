package com.fithub.api.controller;

import com.fithub.api.dto.treino.HistoricoTreinoResponse;
import com.fithub.api.dto.treino.TreinoRequest;
import com.fithub.api.dto.treino.TreinoResponse;
import com.fithub.api.service.TreinoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
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
    public ResponseEntity<List<TreinoResponse>> listarMeusTreinos(Principal principal) {
        return ResponseEntity.ok(treinoService.listarPorEmail(principal.getName()));
    }

    @GetMapping("/aluno/treinos/{id}")
    public ResponseEntity<TreinoResponse> buscarMeuTreino(@PathVariable UUID id) {
        return ResponseEntity.ok(treinoService.buscarPorId(id));
    }

    @PostMapping("/aluno/treinos/{id}/concluir")
    public ResponseEntity<Void> concluirTreino(@PathVariable UUID id, Principal principal) {
        treinoService.concluirPorEmail(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/aluno/treinos/{id}/concluido-semana")
    public ResponseEntity<Map<String, Boolean>> verificarConcluidoSemana(@PathVariable UUID id, Principal principal) {
        boolean concluido = treinoService.jaConcluidoSemana(id, principal.getName());
        return ResponseEntity.ok(Map.of("concluido", concluido));
    }

    @GetMapping("/aluno/historico")
    public ResponseEntity<List<HistoricoTreinoResponse>> historico(Principal principal) {
        return ResponseEntity.ok(treinoService.historicoPorEmail(principal.getName()));
    }
}