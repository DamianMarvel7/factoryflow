import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await req.json();
  try {
    const updated = await (prisma.inventory as any).update({
      where: { id: Number(id) },
      data: {
        ...(data.itemName !== undefined && { itemName: data.itemName }),
        ...(data.quantity !== undefined && { quantity: Number(data.quantity) }),
        ...(data.unit !== undefined && { unit: data.unit }),
        ...(data.unitPrice !== undefined && { unitPrice: Number(data.unitPrice) }),
        ...(data.threshold !== undefined && { threshold: Number(data.threshold) }),
        lastUpdated: new Date(),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await prisma.inventory.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Item deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
