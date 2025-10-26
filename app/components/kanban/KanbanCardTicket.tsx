// components/kanban/KanbanCardTicket.tsx
import React from "react";

interface KanbanCardTicketProps {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
}

export default function KanbanCardTicket({
  title,
  description,
  priority,
  status,
}: KanbanCardTicketProps) {
  const priorityColor =
    {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700",
    }[priority ?? "medium"];

  return (
    <div className="p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer">
      <div className="font-semibold text-gray-800">{title}</div>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className={`px-2 py-0.5 rounded-full font-medium ${priorityColor}`}>
          {priority}
        </span>
        <span className="text-gray-500">{status}</span>
      </div>
    </div>
  );
}
