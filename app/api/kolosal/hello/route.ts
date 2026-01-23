import { NextResponse } from "next/server";

type Data = {
  name: string;
};

export async function GET() {
  return NextResponse.json({ name: "John Doe" });
}
