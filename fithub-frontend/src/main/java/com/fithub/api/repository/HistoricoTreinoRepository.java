package com.fithub.api.repository;

import com.fithub.api.entity.HistoricoTreino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface HistoricoTreinoRepository extends JpaRepository<HistoricoTreino, UUID> {
    List<HistoricoTreino> findByAlunoIdOrderByConcluidoEmDesc(UUID alunoId);
    boolean existsByAlunoIdAndTreinoIdAndConcluidoEmBetween(UUID alunoId, UUID treinoId, LocalDateTime inicio, LocalDateTime fim);
}