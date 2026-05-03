package com.fithub.api.repository;

import com.fithub.api.entity.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface MatriculaRepository extends JpaRepository<Matricula, UUID> {
    List<Matricula> findByAlunoId(UUID alunoId);
    long countByStatus(Matricula.StatusMatricula status);

    @Query("SELECT COALESCE(SUM(m.plano.valor), 0) FROM Matricula m WHERE m.status = 'ATIVA'")
    BigDecimal somarReceitaAtiva();
}