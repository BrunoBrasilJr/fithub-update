package com.fithub.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "registros_carga")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistroCarga {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "exercicio_id", nullable = false)
    private Exercicio exercicio;

    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @Column(nullable = false)
    private String carga;

    @Column(nullable = false)
    private LocalDateTime registradoEm;

    @PrePersist
    public void prePersist() {
        this.registradoEm = LocalDateTime.now();
    }
}