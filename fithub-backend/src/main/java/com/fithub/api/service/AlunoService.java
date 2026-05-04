package com.fithub.api.service;

import com.fithub.api.dto.aluno.AlunoRequest;
import com.fithub.api.dto.aluno.AlunoResponse;
import com.fithub.api.entity.Academia;
import com.fithub.api.entity.Aluno;
import com.fithub.api.entity.User;
import com.fithub.api.repository.AcademiaRepository;
import com.fithub.api.repository.AlunoRepository;
import com.fithub.api.repository.HistoricoTreinoRepository;
import com.fithub.api.repository.MatriculaRepository;
import com.fithub.api.repository.RegistroCargaRepository;
import com.fithub.api.repository.TreinoRepository;
import com.fithub.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final UserRepository userRepository;
    private final AcademiaRepository academiaRepository;
    private final MatriculaRepository matriculaRepository;
    private final TreinoRepository treinoRepository;
    private final HistoricoTreinoRepository historicoTreinoRepository;
    private final RegistroCargaRepository registroCargaRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AlunoResponse> listar(UUID academiaId) {
        if (academiaId != null) {
            return alunoRepository.findByAcademiaId(academiaId).stream()
                    .map(AlunoResponse::from)
                    .collect(Collectors.toList());
        }
        return alunoRepository.findAll().stream()
                .map(AlunoResponse::from)
                .collect(Collectors.toList());
    }

    public AlunoResponse buscarPorId(UUID id) {
        return alunoRepository.findById(id)
                .map(AlunoResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
    }

    public AlunoResponse criar(AlunoRequest request, UUID academiaId) {
        if (alunoRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado");
        }

        Academia academia = academiaId != null
                ? academiaRepository.findById(academiaId).orElse(null)
                : null;

        User user = User.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(passwordEncoder.encode("aluno123"))
                .role(User.Role.ALUNO)
                .ativo(true)
                .primeiroAcesso(true)
                .academia(academia)
                .build();
        userRepository.save(user);

        Aluno aluno = Aluno.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .telefone(request.getTelefone())
                .dataNascimento(request.getDataNascimento() != null ? LocalDate.parse(request.getDataNascimento()) : null)
                .observacoes(request.getObservacoes())
                .fotoUrl(request.getFotoUrl())
                .user(user)
                .academia(academia)
                .build();

        return AlunoResponse.from(alunoRepository.save(aluno));
    }

    public AlunoResponse atualizar(UUID id, AlunoRequest request) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

        aluno.setNome(request.getNome());
        aluno.setTelefone(request.getTelefone());
        aluno.setAtivo(request.isAtivo());
        aluno.setObservacoes(request.getObservacoes());
        aluno.setFotoUrl(request.getFotoUrl());
        if (request.getDataNascimento() != null) {
            aluno.setDataNascimento(LocalDate.parse(request.getDataNascimento()));
        }

        return AlunoResponse.from(alunoRepository.save(aluno));
    }

    public AlunoResponse atualizarFoto(UUID id, String fotoUrl) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
        aluno.setFotoUrl(fotoUrl);
        return AlunoResponse.from(alunoRepository.save(aluno));
    }

    @Transactional
    public void deletar(UUID id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

        registroCargaRepository.findAll().stream()
                .filter(r -> r.getAluno().getId().equals(id))
                .forEach(registroCargaRepository::delete);

        historicoTreinoRepository.findByAlunoIdOrderByConcluidoEmDesc(id)
                .forEach(historicoTreinoRepository::delete);

        matriculaRepository.findByAlunoId(id)
                .forEach(matriculaRepository::delete);

        treinoRepository.findByAlunoId(id)
                .forEach(treinoRepository::delete);

        User user = aluno.getUser();
        alunoRepository.delete(aluno);
        if (user != null) userRepository.delete(user);
    }
}