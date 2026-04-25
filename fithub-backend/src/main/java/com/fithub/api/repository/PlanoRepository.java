package com.fithub.api.repository;

import com.fithub.api.entity.Plano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PlanoRepository extends JpaRepository<Plano, UUID> {
}