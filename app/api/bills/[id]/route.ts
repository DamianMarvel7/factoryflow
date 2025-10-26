import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET single bill
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ unwrap the Promise

  try {
    const bill = await prisma.bill.findUnique({
      where: { id: Number(id) },
    });
    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }
    return NextResponse.json(bill);
  } catch (error) {
    console.error("Error fetching bill:", error);
    return NextResponse.json({ error: "Failed to fetch bill" }, { status: 500 });
  }
}

// PATCH update bill
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await req.json();

  try {
    const updated = await prisma.bill.update({
      where: { id: Number(id) },
      data: {
        ...(data.paidAmount !== undefined && { paidAmount: Number(data.paidAmount) }),
        ...(data.productionProgress !== undefined && {
          productionProgress: data.productionProgress,
        }),
        ...(data.status && { status: data.status }), 
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating bill:", error);
    return NextResponse.json({ error: "Failed to update bill" }, { status: 500 });
  }
}

// DELETE bill
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.bill.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error("Error deleting bill:", error);
    return NextResponse.json({ error: "Failed to delete bill" }, { status: 500 });
  }
}