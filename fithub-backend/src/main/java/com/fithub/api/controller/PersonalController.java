package com.fithub.api.controller;

import com.fithub.api.dto.aluno.AlunoResponse;
import com.fithub.api.dto.treino.TreinoRequest;
import com.fithub.api.dto.treino.TreinoResponse;
import com.fithub.api.entity.User;
import com.fithub.api.repository.AlunoRepository;
import com.fithub.api.repository.UserRepository;
import com.fithub.api.security.AcademiaContextHelper;
import com.fithub.api.service.TreinoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/personal")
@RequiredArgsConstructor
public class PersonalController {

    private final TreinoService treinoService;
    private final AlunoRepository alunoRepository;
    private final UserRepository userRepository;
    private final AcademiaContextHelper academiaContextHelper;

    @GetMapping("/alunos")
    public ResponseEntity<List<AlunoResponse>> buscarAlunos(@RequestParam(required = false) String nome, HttpServletRequest request) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(request);
        List<AlunoResponse> alunos = (academiaId != null
                ? alunoRepository.findByAcademiaId(academiaId)
                : alunoRepository.findAll()).stream()
                .filter(a -> nome == null || a.getNome().toLowerCase().contains(nome.toLowerCase()))
                .map(AlunoResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(alunos);
    }

    @GetMapping("/treinos")
    public ResponseEntity<List<TreinoResponse>> listarTodosTreinos(HttpServletRequest request) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(request);
        return ResponseEntity.ok(treinoService.listar(academiaId));
    }

    @GetMapping("/treinos/aluno/{alunoId}")
    public ResponseEntity<List<TreinoResponse>> listarTreinosAluno(@PathVariable UUID alunoId) {
        return ResponseEntity.ok(treinoService.listarPorAluno(alunoId));
    }

    @PostMapping("/treinos")
    public ResponseEntity<TreinoResponse> criar(@RequestBody TreinoRequest request, HttpServletRequest httpRequest) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(httpRequest);
        return ResponseEntity.ok(treinoService.criar(request, academiaId));
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

    @GetMapping("/perfil")
    public ResponseEntity<Map<String, String>> buscarPerfil(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Map<String, String> perfil = new HashMap<>();
        perfil.put("fotoUrl", user.getFotoUrl() != null ? user.getFotoUrl() : "");
        perfil.put("telefone", user.getTelefone() != null ? user.getTelefone() : "");
        perfil.put("dataNascimento", user.getDataNascimento() != null ? user.getDataNascimento().toString() : "");

        return ResponseEntity.ok(perfil);
    }
}