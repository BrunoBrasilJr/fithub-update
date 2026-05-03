package com.fithub.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "historico_treinos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "treino_id", nullable = false)
    private Treino treino;

    @Column(nullable = false)
    private LocalDateTime concluidoEm;

    @PrePersist
    public void prePersist() {
        this.concluidoEm = LocalDateTime.now();
    }
}