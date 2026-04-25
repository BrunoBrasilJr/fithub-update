package com.fithub.api.controller;

import com.fithub.api.dto.plano.PlanoRequest;
import com.fithub.api.dto.plano.PlanoResponse;
import com.fithub.api.service.PlanoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/planos")
@RequiredArgsConstructor
public class PlanoController {

    private final PlanoService planoService;

    @GetMapping
    public ResponseEntity<List<PlanoResponse>> listar() {
        return ResponseEntity.ok(planoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanoResponse> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(planoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PlanoResponse> criar(@RequestBody PlanoRequest request) {
        return ResponseEntity.ok(planoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanoResponse> atualizar(@PathVariable UUID id, @RequestBody PlanoRequest request) {
        return ResponseEntity.ok(planoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        planoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}