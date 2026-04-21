import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function GET() {
  try {
    const items = await prisma.inventory.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await (prisma.inventory as any).create({
      data: {
        itemName: data.itemName || "New item",
        quantity: Number(data.quantity) || 0,
        unit: data.unit || "pcs",
        unitPrice: Number(data.unitPrice) || 0,
        threshold: Number(data.threshold) || 0,
        lastUpdated: new Date(),
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
