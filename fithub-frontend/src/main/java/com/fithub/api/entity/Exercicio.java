package com.fithub.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "exercicios")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Exercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private Integer series;

    @Column(nullable = false)
    private String repeticoes;

    private String carga;
    private String observacao;

    @ManyToOne
    @JoinColumn(name = "treino_id", nullable = false)
    private Treino treino;
}