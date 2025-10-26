// components/kanban/KanbanColumn.tsx
import React from "react";

interface KanbanColumnProps {
  title: string;
  children: React.ReactNode;
}

export default function KanbanColumn({ title, children }: KanbanColumnProps) {
  return (
    <div className="bg-gray-50 rounded-lg border p-3 min-h-[400px]">
      <h2 className="text-lg font-semibold mb-3 border-b pb-1 capitalize">{title}</h2>
      {children}
    </div>
  );
}
