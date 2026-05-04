package com.fithub.api.repository;

import com.fithub.api.entity.Academia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface AcademiaRepository extends JpaRepository<Academia, UUID> {
    Optional<Academia> findByDominio(String dominio);
}