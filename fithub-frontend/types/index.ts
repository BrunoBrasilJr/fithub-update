export type UserRole = "ADMIN" | "ALUNO";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  primeiroAcesso: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  ativo: boolean;
  createdAt: string;
}

export interface Plano {
  id: string;
  nome: string;
  tipo: "MENSAL" | "TRIMESTRAL" | "SEMESTRAL" | "ANUAL";
  valor: number;
  descricao: string;
}

export interface Matricula {
  id: string;
  alunoId: string;
  planoId: string;
  status: "ATIVA" | "INATIVA" | "PENDENTE";
  dataInicio: string;
  dataFim: string;
  plano?: Plano;
  aluno?: Aluno;
}

export interface Exercicio {
  id: string;
  nome: string;
  series: number;
  repeticoes: string;
  carga?: string;
  observacao?: string;
  concluido?: boolean;
}

export interface Treino {
  id: string;
  nome: string;
  descricao?: string;
  alunoId: string;
  alunoNome: string;
  exercicios: Exercicio[];
  diaSemana: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalAlunos: number;
  alunosAtivos: number;
  alunosInativos: number;
  totalPlanos: number;
  matriculasAtivas: number;
  receitaMensal: number;
}
