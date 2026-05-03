package com.fithub.api.repository;

import com.fithub.api.entity.RegistroCarga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RegistroCargaRepository extends JpaRepository<RegistroCarga, UUID> {
    List<RegistroCarga> findByAlunoIdAndExercicioIdOrderByRegistradoEmAsc(UUID alunoId, UUID exercicioId);
    Optional<RegistroCarga> findTopByAlunoIdAndExercicioIdOrderByRegistradoEmDesc(UUID alunoId, UUID exercicioId);
}