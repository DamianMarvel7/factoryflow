"use client";

import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface KanbanBoardProps<T extends { id: number; status?: string }> {
  columns: { title: string; items: T[] }[];
  renderCard: (item: T) => React.ReactNode;
  onStatusChange?: (id: number, newStatus: string) => void;
}

export default function KanbanBoard<
  T extends { id: number; status?: string }
>({ columns, renderCard, onStatusChange }: KanbanBoardProps<T>) {
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const id = Number(draggableId);
    const newStatus = destination.droppableId;
    console.log(`📦 Moving bill ${id} → ${newStatus}`);

    if (onStatusChange) {
      await onStatusChange(id, newStatus);
    } else {
      await fetch(`/api/bills/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* Full height board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-100px)]">
        {columns.map((col) => (
          <div
            key={col.title}
            className="flex flex-col rounded-lg border border-gray-300 bg-gray-50 p-3 h-full"
          >
            <h2 className="font-semibold text-gray-800 mb-2 border-b pb-1">
              {col.title.charAt(0).toUpperCase() + col.title.slice(1)}
            </h2>

            <Droppable droppableId={col.title}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 overflow-y-auto rounded-md transition-colors duration-200 
                    ${
                      snapshot.isDraggingOver
                        ? "bg-blue-50 border-blue-300"
                        : "bg-white"
                    }
                    border border-dashed border-gray-200 p-2`}
                >
                  {/* Placeholder when empty */}
                  {col.items.length === 0 && !snapshot.isDraggingOver && (
                    <div className="text-xs text-gray-400 text-center py-6 select-none">
                      Drop here
                    </div>
                  )}

                  {/* Cards */}
                  {col.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={String(item.id)}
                      index={index}
                    >
                      {(prov, snap) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className={`mb-2 transform transition-all ${
                            snap.isDragging
                              ? "scale-[1.03] shadow-lg cursor-grabbing"
                              : "cursor-grab"
                          }`}
                        >
                          {renderCard(item)}
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
