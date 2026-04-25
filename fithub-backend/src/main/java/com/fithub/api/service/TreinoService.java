package com.fithub.api.service;

import com.fithub.api.dto.treino.ExercicioRequest;
import com.fithub.api.dto.treino.TreinoRequest;
import com.fithub.api.dto.treino.TreinoResponse;
import com.fithub.api.entity.Aluno;
import com.fithub.api.entity.Exercicio;
import com.fithub.api.entity.Treino;
import com.fithub.api.repository.AlunoRepository;
import com.fithub.api.repository.TreinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TreinoService {

    private final TreinoRepository treinoRepository;
    private final AlunoRepository alunoRepository;

    public List<TreinoResponse> listar() {
        return treinoRepository.findAll().stream()
                .map(TreinoResponse::from)
                .collect(Collectors.toList());
    }

    public List<TreinoResponse> listarPorAluno(UUID alunoId) {
        return treinoRepository.findByAlunoId(alunoId).stream()
                .map(TreinoResponse::from)
                .collect(Collectors.toList());
    }

    public TreinoResponse buscarPorId(UUID id) {
        return treinoRepository.findById(id)
                .map(TreinoResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Treino não encontrado"));
    }

    public TreinoResponse criar(TreinoRequest request) {
        Aluno aluno = alunoRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

        Treino treino = Treino.builder()
                .nome(request.getNome())
                .descricao(request.getDescricao())
                .diaSemana(request.getDiaSemana())
                .aluno(aluno)
                .build();

        if (request.getExercicios() != null) {
            List<Exercicio> exercicios = request.getExercicios().stream()
                    .map(e -> buildExercicio(e, treino))
                    .collect(Collectors.toList());
            treino.setExercicios(exercicios);
        }

        return TreinoResponse.from(treinoRepository.save(treino));
    }

    public TreinoResponse atualizar(UUID id, TreinoRequest request) {
        Treino treino = treinoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Treino não encontrado"));

        treino.setNome(request.getNome());
        treino.setDescricao(request.getDescricao());
        treino.setDiaSemana(request.getDiaSemana());
        treino.getExercicios().clear();

        if (request.getExercicios() != null) {
            request.getExercicios().stream()
                    .map(e -> buildExercicio(e, treino))
                    .forEach(treino.getExercicios()::add);
        }

        return TreinoResponse.from(treinoRepository.save(treino));
    }

    public void deletar(UUID id) {
        if (!treinoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Treino não encontrado");
        }
        treinoRepository.deleteById(id);
    }

    private Exercicio buildExercicio(ExercicioRequest e, Treino treino) {
        return Exercicio.builder()
                .nome(e.getNome())
                .series(e.getSeries())
                .repeticoes(e.getRepeticoes())
                .carga(e.getCarga())
                .observacao(e.getObservacao())
                .treino(treino)
                .build();
    }
}