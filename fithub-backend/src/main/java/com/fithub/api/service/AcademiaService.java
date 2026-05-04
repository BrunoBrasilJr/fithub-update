package com.fithub.api.service;

import com.fithub.api.dto.AcademiaRequest;
import com.fithub.api.dto.AcademiaResponse;
import com.fithub.api.entity.Academia;
import com.fithub.api.repository.AcademiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AcademiaService {

    private final AcademiaRepository academiaRepository;

    public AcademiaResponse criar(AcademiaRequest request) {
        if (academiaRepository.findByDominio(request.getDominio()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Domínio já cadastrado");
        }
        Academia academia = Academia.builder()
                .dominio(request.getDominio().toLowerCase())
                .nomeAcademia(request.getNomeAcademia())
                .corPrimaria(request.getCorPrimaria())
                .logoUrl(request.getLogoUrl())
                .build();
        return AcademiaResponse.from(academiaRepository.save(academia));
    }

    public List<AcademiaResponse> listar() {
        return academiaRepository.findAll().stream()
                .map(AcademiaResponse::from)
                .toList();
    }

    public AcademiaResponse buscarPorDominio(String dominio) {
        Academia academia = academiaRepository.findByDominio(dominio.toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Academia não encontrada"));
        return AcademiaResponse.from(academia);
    }

    public AcademiaResponse atualizar(UUID id, AcademiaRequest request) {
        Academia academia = academiaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Academia não encontrada"));

        academia.setNomeAcademia(request.getNomeAcademia());
        academia.setCorPrimaria(request.getCorPrimaria());
        academia.setLogoUrl(request.getLogoUrl());

        return AcademiaResponse.from(academiaRepository.save(academia));
    }

    public void deletar(UUID id) {
        if (!academiaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Academia não encontrada");
        }
        academiaRepository.deleteById(id);
    }
}