package com.fithub.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private boolean ativo;

    @Column(nullable = false)
    private boolean primeiroAcesso;

    private String telefone;
    private LocalDate dataNascimento;

    @Column(columnDefinition = "TEXT")
    private String fotoUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academia_id")
    private Academia academia;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.ativo = true;
        this.primeiroAcesso = true;
    }

    public enum Role {
        SUPER_ADMIN, ADMIN, ALUNO, PERSONAL
    }
}