"use client";

import { SnackbarContainer, useSnackbar } from "@/components/snackbar";

export function SnackbarHost() {
  const { messages, removeMessage } = useSnackbar();
  return <SnackbarContainer messages={messages} onRemove={removeMessage} />;
}
