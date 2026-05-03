package com.fithub.api.service;

import com.fithub.api.dto.treino.RegistroCargaResponse;
import com.fithub.api.entity.Aluno;
import com.fithub.api.entity.Exercicio;
import com.fithub.api.entity.RegistroCarga;
import com.fithub.api.entity.User;
import com.fithub.api.repository.AlunoRepository;
import com.fithub.api.repository.ExercicioRepository;
import com.fithub.api.repository.RegistroCargaRepository;
import com.fithub.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExercicioService {

    private final RegistroCargaRepository registroCargaRepository;
    private final AlunoRepository alunoRepository;
    private final UserRepository userRepository;
    private final ExercicioRepository exercicioRepository;

    public void registrarCarga(UUID exercicioId, String email, String carga) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        Aluno aluno = alunoRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
        Exercicio exercicio = exercicioRepository.findById(exercicioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercício não encontrado"));

        RegistroCarga registro = RegistroCarga.builder()
                .exercicio(exercicio)
                .aluno(aluno)
                .carga(carga)
                .build();

        registroCargaRepository.save(registro);
    }

    public List<RegistroCargaResponse> evolucao(UUID exercicioId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        Aluno aluno = alunoRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

        return registroCargaRepository
                .findByAlunoIdAndExercicioIdOrderByRegistradoEmAsc(aluno.getId(), exercicioId)
                .stream()
                .map(RegistroCargaResponse::from)
                .collect(Collectors.toList());
    }

    public String ultimaCarga(UUID exercicioId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        Aluno aluno = alunoRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

        return registroCargaRepository
                .findTopByAlunoIdAndExercicioIdOrderByRegistradoEmDesc(aluno.getId(), exercicioId)
                .map(RegistroCarga::getCarga)
                .orElse(null);
    }
}