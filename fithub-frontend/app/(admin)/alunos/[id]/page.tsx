"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AlunoDetailPage() {
  const router = useRouter();

  return (
    <div>
      <Button onClick={() => router.back()}>Voltar</Button>
    </div>
  );
}