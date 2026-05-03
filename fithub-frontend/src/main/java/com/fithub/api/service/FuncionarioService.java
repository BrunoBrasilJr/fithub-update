package com.fithub.api.service;

import com.fithub.api.dto.funcionario.FuncionarioRequest;
import com.fithub.api.dto.funcionario.FuncionarioResponse;
import com.fithub.api.entity.User;
import com.fithub.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FuncionarioService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<FuncionarioResponse> listar() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.PERSONAL)
                .map(FuncionarioResponse::from)
                .collect(Collectors.toList());
    }

    public FuncionarioResponse criar(FuncionarioRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado");
        }

        User user = User.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(passwordEncoder.encode("personal123"))
                .role(User.Role.valueOf(request.getRole()))
                .ativo(true)
                .primeiroAcesso(true)
                .build();

        return FuncionarioResponse.from(userRepository.save(user));
    }

    public void deletar(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado"));
        userRepository.delete(user);
    }
}