

import { useState } from "react";
import CreateButton from "../ui/CreateButton";
import Form from "../layout/Form";

export default function CreateSlotDialog({ onSlotCreated }) {
  const [open, setOpen] = useState(false);

  function showForm() {
    setOpen(true);
  }

  function hideForm() {
    setOpen(false);
  }

  return (
    <>
      <CreateButton openForm={showForm} />
      {open && <Form onClose={hideForm} onSlotCreated={onSlotCreated} />}
    </>
  );
}