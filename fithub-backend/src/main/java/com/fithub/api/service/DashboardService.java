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
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AlunoRepository alunoRepository;
    private final PlanoRepository planoRepository;
    private final MatriculaRepository matriculaRepository;

    public DashboardResponse getMetrics(UUID academiaId) {
        List<Matricula> matriculas = academiaId != null
                ? matriculaRepository.findByAcademiaId(academiaId)
                : matriculaRepository.findAll();

        long matriculasVencidas = matriculas.stream()
                .filter(m -> m.getStatus() == Matricula.StatusMatricula.INATIVA
                        || (m.getStatus() == Matricula.StatusMatricula.ATIVA
                            && m.getDataFim().isBefore(LocalDate.now())))
                .count();

        long matriculasAtivas = matriculas.stream()
                .filter(m -> m.getStatus() == Matricula.StatusMatricula.ATIVA)
                .count();

        return DashboardResponse.builder()
                .totalAlunos(academiaId != null ? alunoRepository.findByAcademiaId(academiaId).size() : alunoRepository.count())
                .alunosAtivos(academiaId != null ? alunoRepository.countByAtivoAndAcademiaId(true, academiaId) : alunoRepository.countByAtivo(true))
                .alunosInativos(academiaId != null ? alunoRepository.countByAtivoAndAcademiaId(false, academiaId) : alunoRepository.countByAtivo(false))
                .totalPlanos(academiaId != null ? planoRepository.findByAcademiaId(academiaId).size() : planoRepository.count())
                .matriculasAtivas(matriculasAtivas)
                .matriculasVencidas(matriculasVencidas)
                .receitaMensal(academiaId != null
                        ? matriculaRepository.somarReceitaAtivaPorAcademia(academiaId)
                        : matriculaRepository.somarReceitaAtiva())
                .build();
    }

    public List<MatriculaResponse> getMatriculasVencendo(UUID academiaId) {
        LocalDate hoje = LocalDate.now();
        LocalDate em7Dias = hoje.plusDays(7);

        List<Matricula> matriculas = academiaId != null
                ? matriculaRepository.findByAcademiaId(academiaId)
                : matriculaRepository.findAll();

        return matriculas.stream()
                .filter(m -> m.getStatus() == Matricula.StatusMatricula.ATIVA)
                .filter(m -> !m.getDataFim().isBefore(hoje) && !m.getDataFim().isAfter(em7Dias))
                .map(MatriculaResponse::from)
                .collect(Collectors.toList());
    }

    public List<MatriculaResponse> getInadimplentes(UUID academiaId) {
        LocalDate hoje = LocalDate.now();

        List<Matricula> matriculas = academiaId != null
                ? matriculaRepository.findByAcademiaId(academiaId)
                : matriculaRepository.findAll();

        return matriculas.stream()
                .filter(m -> m.getStatus() == Matricula.StatusMatricula.ATIVA)
                .filter(m -> m.getDataFim().isBefore(hoje))
                .map(MatriculaResponse::from)
                .collect(Collectors.toList());
    }

    public List<AlunoResponse> getAniversariantesDoMes(UUID academiaId) {
        int mesAtual = LocalDate.now().getMonthValue();

        List<com.fithub.api.entity.Aluno> alunos = academiaId != null
                ? alunoRepository.findByAcademiaId(academiaId)
                : alunoRepository.findAll();

        return alunos.stream()
                .filter(a -> a.getDataNascimento() != null)
                .filter(a -> a.getDataNascimento().getMonthValue() == mesAtual)
                .map(AlunoResponse::from)
                .collect(Collectors.toList());
    }
}