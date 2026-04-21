import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await req.json();
  try {
    const updated = await (prisma.ticket as any).update({
      where: { id: Number(id) },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.customerName !== undefined && { customerName: data.customerName }),
        ...(data.orderType !== undefined && { orderType: data.orderType }),
        ...(data.quantity !== undefined && { quantity: Number(data.quantity) }),
        ...(data.unitPrice !== undefined && { unitPrice: Number(data.unitPrice) }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
        ...(data.ownerInitials !== undefined && { ownerInitials: data.ownerInitials }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.driveLink !== undefined && { driveLink: data.driveLink }),
        ...(data.billAttachment !== undefined && { billAttachment: data.billAttachment }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await prisma.ticket.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Ticket deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
  }
}
