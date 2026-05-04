package com.fithub.api.controller;

import com.fithub.api.dto.aluno.AlunoResponse;
import com.fithub.api.dto.dashboard.DashboardResponse;
import com.fithub.api.dto.matricula.MatriculaResponse;
import com.fithub.api.security.AcademiaContextHelper;
import com.fithub.api.service.DashboardService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final AcademiaContextHelper academiaContextHelper;

    @GetMapping
    public ResponseEntity<DashboardResponse> getMetrics(HttpServletRequest request) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(request);
        return ResponseEntity.ok(dashboardService.getMetrics(academiaId));
    }

    @GetMapping("/vencimentos")
    public ResponseEntity<List<MatriculaResponse>> getVencimentos(HttpServletRequest request) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(request);
        return ResponseEntity.ok(dashboardService.getMatriculasVencendo(academiaId));
    }

    @GetMapping("/inadimplentes")
    public ResponseEntity<List<MatriculaResponse>> getInadimplentes(HttpServletRequest request) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(request);
        return ResponseEntity.ok(dashboardService.getInadimplentes(academiaId));
    }

    @GetMapping("/aniversariantes")
    public ResponseEntity<List<AlunoResponse>> getAniversariantes(HttpServletRequest request) {
        UUID academiaId = academiaContextHelper.getAcademiaIdFromRequest(request);
        return ResponseEntity.ok(dashboardService.getAniversariantesDoMes(academiaId));
    }
}