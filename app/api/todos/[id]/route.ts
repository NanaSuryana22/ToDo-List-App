import { NextResponse } from "next/server";
import { todos } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // 1. Ubah tipe params menjadi Promise
) {
  // 2. Gunakan await untuk membuka (unwrap) params
  const { id } = await params;

  const index = todos.findIndex((t) => t.id === id);

  if (index !== -1) {
    todos.splice(index, 1);
  }

  return NextResponse.json({ success: true });
}
