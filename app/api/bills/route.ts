import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db"; // make sure you have prisma client

// GET /api/bills  →  Fetch all bills
export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 }
    );
  }
}

// POST /api/bills  →  Create new bill
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const bill = await prisma.bill.create({
      data: {
        vendorName: data.vendorName,
        amount: Number(data.amount),
        paidAmount: Number(data.paidAmount),
        productionProgress: Number(data.productionProgress),
        dueDate: new Date(data.dueDate),
        status: data.status || "unpaid",
      },
    });
    return NextResponse.json(bill);
  } catch (error) {
    console.error("Error creating bill:", error);
    return NextResponse.json({ error: "Failed to create bill" }, { status: 500 });
  }
}
