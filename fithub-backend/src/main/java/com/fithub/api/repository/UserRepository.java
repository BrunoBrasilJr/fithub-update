package com.fithub.api.repository;

import com.fithub.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Busca todos os usuários de uma academia e filtra pelo trecho antes do @ no Java
    @Query("SELECT u FROM User u WHERE u.academia.id = :academiaId")
    List<User> findByAcademiaId(@Param("academiaId") UUID academiaId);
}