package com.fithub.api.service;

import com.fithub.api.dto.LoginRequest;
import com.fithub.api.dto.LoginResponse;
import com.fithub.api.dto.UserDto;
import com.fithub.api.entity.Academia;
import com.fithub.api.entity.User;
import com.fithub.api.repository.AcademiaRepository;
import com.fithub.api.repository.UserRepository;
import com.fithub.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AcademiaRepository academiaRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public LoginResponse login(LoginRequest request) {
        String login = request.getLogin().trim();
        String emailReal;
        Academia academia = null;

        if (login.contains("@")) {
            String[] partes = login.split("@");
            String usuario = partes[0];
            String dominio = partes[1];

            // Se o domínio tem ponto, é email normal (ex: super@fithub.com)
            boolean isDominioAcademia = !dominio.contains(".");

            if (isDominioAcademia) {
                academia = academiaRepository.findByDominio(dominio.toLowerCase()).orElse(null);
            }

            if (academia != null) {
                // Login multi-tenant: busca usuário pelo trecho antes do @ dentro da academia
                List<User> usuariosDaAcademia = userRepository.findByAcademiaId(academia.getId());
                User user = usuariosDaAcademia.stream()
                        .filter(u -> {
                            String emailUsuario = u.getEmail();
                            String prefixo = emailUsuario.contains("@") ? emailUsuario.split("@")[0] : emailUsuario;
                            return prefixo.equalsIgnoreCase(usuario);
                        })
                        .findFirst()
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));
                emailReal = user.getEmail();
            } else {
                // Email normal (admin global, super admin)
                emailReal = login;
            }
        } else {
            emailReal = login;
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(emailReal, request.getSenha())
            );
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        User user = userRepository.findByEmail(emailReal)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("nome", user.getNome());
        claims.put("userId", user.getId().toString());
        if (academia != null) {
            claims.put("academiaId", academia.getId().toString());
            claims.put("academiaDominio", academia.getDominio());
        }

        String token = jwtService.generateToken(userDetails, claims);

        return LoginResponse.builder()
                .token(token)
                .user(UserDto.from(user))
                .build();
    }
}