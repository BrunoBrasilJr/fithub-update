package com.fithub.api.controller;

import com.fithub.api.dto.dashboard.DashboardResponse;
import com.fithub.api.dto.matricula.MatriculaResponse;
import com.fithub.api.dto.aluno.AlunoResponse;
import com.fithub.api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getMetrics() {
        return ResponseEntity.ok(dashboardService.getMetrics());
    }

    @GetMapping("/vencimentos")
    public ResponseEntity<List<MatriculaResponse>> getVencimentos() {
        return ResponseEntity.ok(dashboardService.getMatriculasVencendo());
    }

    @GetMapping("/inadimplentes")
    public ResponseEntity<List<MatriculaResponse>> getInadimplentes() {
        return ResponseEntity.ok(dashboardService.getInadimplentes());
    }

    @GetMapping("/aniversariantes")
    public ResponseEntity<List<AlunoResponse>> getAniversariantes() {
        return ResponseEntity.ok(dashboardService.getAniversariantesDoMes());
    }
}