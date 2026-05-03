package com.fithub.api.controller;

import com.fithub.api.dto.aluno.AlunoResponse;
import com.fithub.api.dto.treino.TreinoRequest;
import com.fithub.api.dto.treino.TreinoResponse;
import com.fithub.api.repository.AlunoRepository;
import com.fithub.api.service.TreinoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/personal")
@RequiredArgsConstructor
public class PersonalController {

    private final TreinoService treinoService;
    private final AlunoRepository alunoRepository;

    @GetMapping("/alunos")
    public ResponseEntity<List<AlunoResponse>> buscarAlunos(@RequestParam(required = false) String nome) {
        List<AlunoResponse> alunos = alunoRepository.findAll().stream()
                .filter(a -> nome == null || a.getNome().toLowerCase().contains(nome.toLowerCase()))
                .map(AlunoResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(alunos);
    }

    @GetMapping("/treinos/aluno/{alunoId}")
    public ResponseEntity<List<TreinoResponse>> listarTreinosAluno(@PathVariable UUID alunoId) {
        return ResponseEntity.ok(treinoService.listarPorAluno(alunoId));
    }

    @PostMapping("/treinos")
    public ResponseEntity<TreinoResponse> criar(@RequestBody TreinoRequest request) {
        return ResponseEntity.ok(treinoService.criar(request));
    }

    @PutMapping("/treinos/{id}")
    public ResponseEntity<TreinoResponse> atualizar(@PathVariable UUID id, @RequestBody TreinoRequest request) {
        return ResponseEntity.ok(treinoService.atualizar(id, request));
    }

    @DeleteMapping("/treinos/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        treinoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}