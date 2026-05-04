package com.fithub.api.service;

import com.fithub.api.dto.plano.PlanoRequest;
import com.fithub.api.dto.plano.PlanoResponse;
import com.fithub.api.entity.Academia;
import com.fithub.api.entity.Plano;
import com.fithub.api.repository.AcademiaRepository;
import com.fithub.api.repository.PlanoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanoService {

    private final PlanoRepository planoRepository;
    private final AcademiaRepository academiaRepository;

    public List<PlanoResponse> listar(UUID academiaId) {
        if (academiaId != null) {
            return planoRepository.findByAcademiaId(academiaId).stream()
                    .map(PlanoResponse::from)
                    .collect(Collectors.toList());
        }
        return planoRepository.findAll().stream()
                .map(PlanoResponse::from)
                .collect(Collectors.toList());
    }

    public PlanoResponse buscarPorId(UUID id) {
        return planoRepository.findById(id)
                .map(PlanoResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plano não encontrado"));
    }

    public PlanoResponse criar(PlanoRequest request, UUID academiaId) {
        Academia academia = academiaId != null
                ? academiaRepository.findById(academiaId).orElse(null)
                : null;

        Plano plano = Plano.builder()
                .nome(request.getNome())
                .tipo(Plano.TipoPlano.valueOf(request.getTipo()))
                .valor(request.getValor())
                .descricao(request.getDescricao())
                .academia(academia)
                .build();
        return PlanoResponse.from(planoRepository.save(plano));
    }

    public PlanoResponse atualizar(UUID id, PlanoRequest request) {
        Plano plano = planoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plano não encontrado"));

        plano.setNome(request.getNome());
        plano.setTipo(Plano.TipoPlano.valueOf(request.getTipo()));
        plano.setValor(request.getValor());
        plano.setDescricao(request.getDescricao());

        return PlanoResponse.from(planoRepository.save(plano));
    }

    public void deletar(UUID id) {
        if (!planoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plano não encontrado");
        }
        planoRepository.deleteById(id);
    }
}