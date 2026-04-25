"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Plano } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import styles from "./planos.module.css";

export default function PlanosPage() {
  useAuth("ADMIN");
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalDeletar, setModalDeletar] = useState<Plano | null>(null);
  const [modalEditar, setModalEditar] = useState<Plano | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    tipo: "MENSAL",
    valor: "",
    descricao: "",
  });

  function fetchPlanos() {
    api
      .get<Plano[]>("/admin/planos")
      .then(setPlanos)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchPlanos();
  }, []);

  function openEditar(plano: Plano) {
    setForm({
      nome: plano.nome,
      tipo: plano.tipo,
      valor: String(plano.valor),
      descricao: plano.descricao || "",
    });
    setModalEditar(plano);
  }

  function openCriar() {
    setForm({ nome: "", tipo: "MENSAL", valor: "", descricao: "" });
    setModalCriar(true);
  }

  async function handleSalvar() {
    setSaving(true);
    try {
      const body = { ...form, valor: parseFloat(form.valor) };
      if (modalEditar) {
        await api.put(`/admin/planos/${modalEditar.id}`, body);
        setModalEditar(null);
      } else {
        await api.post("/admin/planos", body);
        setModalCriar(false);
      }
      fetchPlanos();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletar() {
    if (!modalDeletar) return;
    setSaving(true);
    try {
      await api.delete(`/admin/planos/${modalDeletar.id}`);
      fetchPlanos();
      setModalDeletar(null);
    } finally {
      setSaving(false);
    }
  }

  const tipoLabel: Record<string, string> = {
    MENSAL: "Mensal",
    TRIMESTRAL: "Trimestral",
    SEMESTRAL: "Semestral",
    ANUAL: "Anual",
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Planos</h1>
          <p className={styles.subtitle}>
            {planos.length} plano{planos.length !== 1 ? "s" : ""} cadastrado
            {planos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={openCriar}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3V13M3 8H13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Novo Plano
        </Button>
      </div>

      {loading ? (
        <div className={styles.empty}>Carregando...</div>
      ) : planos.length === 0 ? (
        <div className={styles.empty}>Nenhum plano cadastrado</div>
      ) : (
        <div className={styles.grid}>
          {planos.map((plano) => (
            <div key={plano.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <p className={styles.cardName}>{plano.nome}</p>
                <Badge label={tipoLabel[plano.tipo]} variant="ativa" />
              </div>
              <p className={styles.cardValue}>
                R$ {Number(plano.valor).toFixed(2)}
              </p>
              <p className={styles.cardDesc}>
                {plano.descricao || "Sem descrição"}
              </p>
              <div className={styles.cardActions}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditar(plano)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setModalDeletar(plano)}
                >
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(modalCriar || modalEditar) && (
        <Modal
          title={modalCriar ? "Novo Plano" : "Editar Plano"}
          onClose={() => {
            setModalCriar(false);
            setModalEditar(null);
          }}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setModalCriar(false);
                  setModalEditar(null);
                }}
              >
                Cancelar
              </Button>
              <Button loading={saving} onClick={handleSalvar}>
                Salvar
              </Button>
            </>
          }
        >
          <div className={styles.form}>
            <div className={styles.formRow}>
              <Input
                label="Nome do Plano"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Plano Básico"
              />
              <Select
                label="Tipo"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              >
                <option value="MENSAL">Mensal</option>
                <option value="TRIMESTRAL">Trimestral</option>
                <option value="SEMESTRAL">Semestral</option>
                <option value="ANUAL">Anual</option>
              </Select>
            </div>
            <Input
              label="Valor (R$)"
              type="number"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
              placeholder="0.00"
            />
            <Input
              label="Descrição"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Descrição do plano"
            />
          </div>
        </Modal>
      )}

      {modalDeletar && (
        <Modal
          title="Remover Plano"
          onClose={() => setModalDeletar(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalDeletar(null)}>
                Cancelar
              </Button>
              <Button variant="danger" loading={saving} onClick={handleDeletar}>
                Remover
              </Button>
            </>
          }
        >
          <p className={styles.confirmText}>
            Tem certeza que deseja remover o plano{" "}
            <span className={styles.confirmName}>{modalDeletar.nome}</span>?
          </p>
        </Modal>
      )}
    </div>
  );
}
