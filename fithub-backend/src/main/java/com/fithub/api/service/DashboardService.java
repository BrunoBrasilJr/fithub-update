package com.fithub.api.service;

import com.fithub.api.dto.aluno.AlunoResponse;
import com.fithub.api.dto.dashboard.DashboardResponse;
import com.fithub.api.dto.matricula.MatriculaResponse;
import com.fithub.api.entity.Matricula;
import com.fithub.api.repository.AlunoRepository;
import com.fithub.api.repository.MatriculaRepository;
import com.fithub.api.repository.PlanoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<MatriculaResponse> getMatriculasVencendo() {
        LocalDate hoje = LocalDate.now();
        LocalDate em7Dias = hoje.plusDays(7);
        return matriculaRepository.findAll().stream()
                .filter(m -> m.getStatus() == Matricula.StatusMatricula.ATIVA)
                .filter(m -> !m.getDataFim().isBefore(hoje) && !m.getDataFim().isAfter(em7Dias))
                .map(MatriculaResponse::from)
                .collect(Collectors.toList());
    }

    public List<MatriculaResponse> getInadimplentes() {
        LocalDate hoje = LocalDate.now();
        return matriculaRepository.findAll().stream()
                .filter(m -> m.getStatus() == Matricula.StatusMatricula.ATIVA)
                .filter(m -> m.getDataFim().isBefore(hoje))
                .map(MatriculaResponse::from)
                .collect(Collectors.toList());
    }

    public List<AlunoResponse> getAniversariantesDoMes() {
        int mesAtual = LocalDate.now().getMonthValue();
        return alunoRepository.findAll().stream()
                .filter(a -> a.getDataNascimento() != null)
                .filter(a -> a.getDataNascimento().getMonthValue() == mesAtual)
                .map(AlunoResponse::from)
                .collect(Collectors.toList());
    }
}