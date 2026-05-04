package com.fithub.api.service;

import com.fithub.api.dto.matricula.MatriculaRequest;
import com.fithub.api.dto.matricula.MatriculaResponse;
import com.fithub.api.entity.Academia;
import com.fithub.api.entity.Aluno;
import com.fithub.api.entity.Matricula;
import com.fithub.api.entity.Plano;
import com.fithub.api.entity.User;
import com.fithub.api.repository.AcademiaRepository;
import com.fithub.api.repository.AlunoRepository;
import com.fithub.api.repository.MatriculaRepository;
import com.fithub.api.repository.PlanoRepository;
import com.fithub.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;
    private final AlunoRepository alunoRepository;
    private final PlanoRepository planoRepository;
    private final UserRepository userRepository;
    private final AcademiaRepository academiaRepository;

    public List<MatriculaResponse> listar(UUID academiaId) {
        if (academiaId != null) {
            return matriculaRepository.findByAcademiaId(academiaId).stream()
                    .map(MatriculaResponse::from)
                    .collect(Collectors.toList());
        }
        return matriculaRepository.findAll().stream()
                .map(MatriculaResponse::from)
                .collect(Collectors.toList());
    }

    public List<MatriculaResponse> listarPorAluno(UUID alunoId) {
        return matriculaRepository.findByAlunoId(alunoId).stream()
                .map(MatriculaResponse::from)
                .collect(Collectors.toList());
    }

    public List<MatriculaResponse> listarPorEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        Aluno aluno = alunoRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
        return matriculaRepository.findByAlunoId(aluno.getId()).stream()
                .map(MatriculaResponse::from)
                .collect(Collectors.toList());
    }

    public MatriculaResponse criar(MatriculaRequest request, UUID academiaId) {
        Aluno aluno = alunoRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

        Plano plano = planoRepository.findById(request.getPlanoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plano não encontrado"));

        Academia academia = academiaId != null
                ? academiaRepository.findById(academiaId).orElse(null)
                : null;

        Matricula matricula = Matricula.builder()
                .aluno(aluno)
                .plano(plano)
                .status(Matricula.StatusMatricula.valueOf(request.getStatus()))
                .dataInicio(LocalDate.parse(request.getDataInicio()))
                .dataFim(LocalDate.parse(request.getDataFim()))
                .academia(academia)
                .build();

        return MatriculaResponse.from(matriculaRepository.save(matricula));
    }

    public MatriculaResponse atualizar(UUID id, MatriculaRequest request) {
        Matricula matricula = matriculaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Matrícula não encontrada"));

        matricula.setStatus(Matricula.StatusMatricula.valueOf(request.getStatus()));
        matricula.setDataInicio(LocalDate.parse(request.getDataInicio()));
        matricula.setDataFim(LocalDate.parse(request.getDataFim()));

        return MatriculaResponse.from(matriculaRepository.save(matricula));
    }

    public void deletar(UUID id) {
        if (!matriculaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Matrícula não encontrada");
        }
        matriculaRepository.deleteById(id);
    }
}