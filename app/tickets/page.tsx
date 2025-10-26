"use client";
import { useEffect, useState } from "react";
import KanbanBoard from "@/app/components/kanban/KanbanBoard";
import KanbanCardTicket from "@/app/components/kanban/KanbanCardTicket";

const STATUSES = ["open", "in progress", "closed"];

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch("/api/tickets").then((res) => res.json()).then(setTickets);
  }, []);

  const columns = STATUSES.map((status) => ({
    title: status,
    items: tickets.filter((t) => t.status === status),
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Tickets</h1>
      <KanbanBoard
        columns={columns}
        renderCard={(ticket) => (
          <KanbanCardTicket
            key={ticket.id}
            title={ticket.title}
            description={ticket.description}
            priority={ticket.priority}
            status={ticket.status}
          />
        )}
      />
    </div>
  );
}
