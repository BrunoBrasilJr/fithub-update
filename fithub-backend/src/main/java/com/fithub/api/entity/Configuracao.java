package com.fithub.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "configuracao")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Configuracao {

    @Id
    private Long id;

    @Column(nullable = false)
    private String nomeAcademia;

    @Column(nullable = false)
    private String corPrimaria;

    @Column(columnDefinition = "TEXT")
    private String logoUrl;

    @PrePersist
    public void prePersist() {
        this.id = 1L;
    }
}