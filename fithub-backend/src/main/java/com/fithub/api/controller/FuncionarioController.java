package com.fithub.api.controller;

import com.fithub.api.dto.funcionario.FuncionarioRequest;
import com.fithub.api.dto.funcionario.FuncionarioResponse;
import com.fithub.api.security.AcademiaContextHelper;
import com.fithub.api.service.FuncionarioService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/funcionarios")
@RequiredArgsConstructor
public class FuncionarioController {

    private final FuncionarioService funcionarioService;
    private final AcademiaContextHelper academiaContextHelper;

    @GetMapping
    public ResponseEntity<List<FuncionarioResponse>> listar(HttpServletRequest request) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(request);
        return ResponseEntity.ok(funcionarioService.listar(academiaId));
    }

    @PostMapping
    public ResponseEntity<FuncionarioResponse> criar(@RequestBody FuncionarioRequest request, HttpServletRequest httpRequest) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(httpRequest);
        return ResponseEntity.ok(funcionarioService.criar(request, academiaId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        funcionarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}