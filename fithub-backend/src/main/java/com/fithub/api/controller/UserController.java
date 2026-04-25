package com.fithub.api.controller;

import com.fithub.api.dto.TrocaSenhaRequest;
import com.fithub.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/aluno")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/trocar-senha")
    public ResponseEntity<Void> trocarSenha(Principal principal, @RequestBody TrocaSenhaRequest request) {
        userService.trocarSenha(principal.getName(), request);
        return ResponseEntity.ok().build();
    }
}