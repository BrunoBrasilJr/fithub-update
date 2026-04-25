package com.fithub.api.repository;

import com.fithub.api.entity.Treino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TreinoRepository extends JpaRepository<Treino, UUID> {
    List<Treino> findByAlunoId(UUID alunoId);
}