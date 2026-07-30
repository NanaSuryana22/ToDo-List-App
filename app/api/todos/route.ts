import { NextResponse } from "next/server";
import { todos } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  // Ambil hanya todo yang userId-nya cocok
  const userTodos = todos.filter((t) => t.userId === userId);
  return NextResponse.json(userTodos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, text } = body;

  const newTodo = { id: Date.now().toString(), userId, text };
  todos.push(newTodo);

  return NextResponse.json(newTodo);
}
