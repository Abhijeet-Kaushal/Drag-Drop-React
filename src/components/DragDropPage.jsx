import "./DragDropStyle.css";
import { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  onDragEnd,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities"; // only for using 'transform' from useDraggable hook.

export default function DragDropPage() {
  const item1Array = [
    { id: "Abhijeet", className: "item1-1", name: "Abhijeet" },
    { id: "Kaushal", className: "item1-2", name: "Kaushal" },
    { id: "Software Engineer", className: "item1-1", name: "Millionaire" },
  ];
  const item2Array = [];
  const [leftItems, setLeftItems] = useState(item1Array);
  const [rightItems, setRightItems] = useState(item2Array);
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const draggedId = active.id;

    // Case 1: Move left → right
    if (over.id === "dropzone") {
      const draggedItem = leftItems.find((item) => item.id === draggedId);
      if (draggedItem) {
        setLeftItems((prev) => prev.filter((item) => item.id !== draggedId));
        setRightItems((prev) => [...prev, draggedItem]);
      }
    }

    // Case 2: Move right → left
    if (over.id === "leftzone") {
      const draggedItem = rightItems.find((item) => item.id === draggedId);
      if (draggedItem) {
        setRightItems((prev) => prev.filter((item) => item.id !== draggedId));
        setLeftItems((prev) => [...prev, draggedItem]);
      }
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="container">
        <div className="heading">2 Way Drag & Drop using dndkit</div>
        <div className="parent">
          <DropZone id="leftzone" className="item1">
            {leftItems.map((item) => (
              <DraggableItem
                key={item.id}
                id={item.id}
                className={item.className}
                name={item.name}
              />
            ))}
          </DropZone>
          {/* id is required to know what is dragged and what is dropped */}
          <DropZone id="dropzone" className="item2">
            {rightItems.map((item) => (
              <DraggableItem
                key={item.id}
                id={item.id}
                className={item.className}
                name={item.name}
              />
            ))}
          </DropZone>
        </div>
      </div>
    </DndContext>
  );
}

function DraggableItem({ id, className, name }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none", //for mobile devices
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={className}
    >
      {name}
    </div>
  );
}

function DropZone({ id, className, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}
