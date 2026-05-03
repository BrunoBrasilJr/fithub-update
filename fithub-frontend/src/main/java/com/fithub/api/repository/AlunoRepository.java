package com.fithub.api.repository;

import com.fithub.api.entity.Aluno;
import com.fithub.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, UUID> {
    Optional<Aluno> findByEmail(String email);
    Optional<Aluno> findByUser(User user);
    boolean existsByEmail(String email);
    long countByAtivo(boolean ativo);
}