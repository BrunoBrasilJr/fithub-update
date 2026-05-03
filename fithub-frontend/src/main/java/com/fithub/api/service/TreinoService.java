package com.fithub.api.service;

import com.fithub.api.dto.treino.ExercicioRequest;
import com.fithub.api.dto.treino.HistoricoTreinoResponse;
import com.fithub.api.dto.treino.TreinoRequest;
import com.fithub.api.dto.treino.TreinoResponse;
import com.fithub.api.entity.Aluno;
import com.fithub.api.entity.Exercicio;
import com.fithub.api.entity.HistoricoTreino;
import com.fithub.api.entity.Treino;
import com.fithub.api.entity.User;
import com.fithub.api.repository.AlunoRepository;
import com.fithub.api.repository.HistoricoTreinoRepository;
import com.fithub.api.repository.TreinoRepository;
import com.fithub.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TreinoService {

    private final TreinoRepository treinoRepository;
    private final AlunoRepository alunoRepository;
    private final HistoricoTreinoRepository historicoTreinoRepository;
    private final UserRepository userRepository;

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

    public List<TreinoResponse> listarPorEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        Aluno aluno = alunoRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
        return treinoRepository.findByAlunoId(aluno.getId()).stream()
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

    public boolean jaConcluidoSemana(UUID treinoId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        Aluno aluno = alunoRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

        LocalDateTime inicioSemana = LocalDate.now()
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .atStartOfDay();
        LocalDateTime fimSemana = inicioSemana.plusWeeks(1);

        return historicoTreinoRepository
                .existsByAlunoIdAndTreinoIdAndConcluidoEmBetween(aluno.getId(), treinoId, inicioSemana, fimSemana);
    }

    public void concluirPorEmail(UUID treinoId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        Aluno aluno = alunoRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
        Treino treino = treinoRepository.findById(treinoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Treino não encontrado"));

        LocalDateTime inicioSemana = LocalDate.now()
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .atStartOfDay();
        LocalDateTime fimSemana = inicioSemana.plusWeeks(1);

        boolean jaConcluidoSemana = historicoTreinoRepository
                .existsByAlunoIdAndTreinoIdAndConcluidoEmBetween(aluno.getId(), treinoId, inicioSemana, fimSemana);

        if (jaConcluidoSemana) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Treino já concluído esta semana");
        }

        HistoricoTreino historico = HistoricoTreino.builder()
                .treino(treino)
                .aluno(aluno)
                .build();

        historicoTreinoRepository.save(historico);
    }

    public List<HistoricoTreinoResponse> historicoPorEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        Aluno aluno = alunoRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
        return historicoTreinoRepository.findByAlunoIdOrderByConcluidoEmDesc(aluno.getId()).stream()
                .map(HistoricoTreinoResponse::from)
                .collect(Collectors.toList());
    }

    public void concluir(UUID treinoId, UUID alunoId) {
        Treino treino = treinoRepository.findById(treinoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Treino não encontrado"));
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

        HistoricoTreino historico = HistoricoTreino.builder()
                .treino(treino)
                .aluno(aluno)
                .build();

        historicoTreinoRepository.save(historico);
    }

    public List<HistoricoTreinoResponse> historico(UUID alunoId) {
        return historicoTreinoRepository.findByAlunoIdOrderByConcluidoEmDesc(alunoId).stream()
                .map(HistoricoTreinoResponse::from)
                .collect(Collectors.toList());
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