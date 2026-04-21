import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const ticket = await (prisma.ticket as any).create({
      data: {
        title: data.title || "New project",
        customerName: data.customerName || "",
        orderType: data.orderType || "Embroidery",
        quantity: Number(data.quantity) || 1,
        unitPrice: Number(data.unitPrice) || 0,
        description: data.description || "",
        priority: data.priority || "med",
        status: data.status || "open",
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        ownerInitials: data.ownerInitials || "AR",
        notes: data.notes || "",
        driveLink: data.driveLink || "",
        billAttachment: data.billAttachment || "",
      },
    });
    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
