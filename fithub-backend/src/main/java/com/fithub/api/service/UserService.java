package com.fithub.api.service;

import com.fithub.api.dto.TrocaSenhaRequest;
import com.fithub.api.entity.Aluno;
import com.fithub.api.entity.User;
import com.fithub.api.repository.AlunoRepository;
import com.fithub.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AlunoRepository alunoRepository;
    private final PasswordEncoder passwordEncoder;

    public void trocarSenha(String email, TrocaSenhaRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        if (!passwordEncoder.matches(request.getSenhaAtual(), user.getSenha())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha atual incorreta");
        }
        user.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        user.setPrimeiroAcesso(false);
        userRepository.save(user);
    }

    public String atualizarFoto(String email, String fotoUrl) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        Aluno aluno = alunoRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
        aluno.setFotoUrl(fotoUrl);
        alunoRepository.save(aluno);
        return fotoUrl;
    }

    public Map<String, String> buscarInfoAluno(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Map<String, String> info = new HashMap<>();

        alunoRepository.findByUser(user).ifPresent(aluno -> {
            info.put("fotoUrl", aluno.getFotoUrl() != null ? aluno.getFotoUrl() : "");
            info.put("telefone", aluno.getTelefone() != null ? aluno.getTelefone() : "");
            info.put("dataNascimento", aluno.getDataNascimento() != null ? aluno.getDataNascimento().toString() : "");
        });

        if (!info.containsKey("fotoUrl")) info.put("fotoUrl", "");
        if (!info.containsKey("telefone")) info.put("telefone", "");
        if (!info.containsKey("dataNascimento")) info.put("dataNascimento", "");

        return info;
    }
}