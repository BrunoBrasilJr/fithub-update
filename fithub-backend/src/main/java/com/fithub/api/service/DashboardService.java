package com.fithub.api.service;

import com.fithub.api.dto.dashboard.DashboardResponse;
import com.fithub.api.entity.Matricula;
import com.fithub.api.repository.AlunoRepository;
import com.fithub.api.repository.MatriculaRepository;
import com.fithub.api.repository.PlanoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AlunoRepository alunoRepository;
    private final PlanoRepository planoRepository;
    private final MatriculaRepository matriculaRepository;

    public DashboardResponse getMetrics() {
        return DashboardResponse.builder()
                .totalAlunos(alunoRepository.count())
                .alunosAtivos(alunoRepository.countByAtivo(true))
                .alunosInativos(alunoRepository.countByAtivo(false))
                .totalPlanos(planoRepository.count())
                .matriculasAtivas(matriculaRepository.countByStatus(Matricula.StatusMatricula.ATIVA))
                .receitaMensal(matriculaRepository.somarReceitaAtiva())
                .build();
    }
}