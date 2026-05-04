package com.fithub.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "academias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Academia {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String dominio;

    @Column(nullable = false)
    private String nomeAcademia;

    private String corPrimaria;

    private String logoUrl;

    @Column(nullable = false)
    @Builder.Default
    private boolean ativo = true;
}