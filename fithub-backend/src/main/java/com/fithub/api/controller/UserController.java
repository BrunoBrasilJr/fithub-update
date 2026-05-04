package com.fithub.api.controller;

import com.fithub.api.dto.TrocaSenhaRequest;
import com.fithub.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/trocar-senha")
    public ResponseEntity<Void> trocarSenha(Principal principal, @RequestBody TrocaSenhaRequest request) {
        userService.trocarSenha(principal.getName(), request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/foto")
    public ResponseEntity<Void> atualizarFoto(Principal principal, @RequestBody Map<String, String> body) {
        userService.atualizarFoto(principal.getName(), body.get("fotoUrl"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/foto")
    public ResponseEntity<Map<String, String>> buscarFoto(Principal principal) {
        return ResponseEntity.ok(userService.buscarInfoAluno(principal.getName()));
    }
}