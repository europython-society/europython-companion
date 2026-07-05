import React from "react";

import StateMessage from "./StateMessage";

type Props = {
  loading?: boolean;
  loadingMessage?: string;
  error?: Error | null;
  errorMessage?: string;
  errorSubtitle?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  renderEmpty?: () => React.ReactNode;
  children: React.ReactNode;
  header?: React.ReactNode;
};

/**
 * Simple guard component for data-driven screens.
 * Renders loading/error/empty states consistently before showing children.
 */
export default function DataBoundary({
  loading,
  loadingMessage = "Loading…",
  error,
  errorMessage = "Unable to load content.",
  errorSubtitle,
  isEmpty,
  emptyMessage = "Nothing to show.",
  renderEmpty,
  children,
  header,
}: Props) {
  if (loading) {
    return (
      <>
        {header}
        <StateMessage title={loadingMessage} loading />
      </>
    );
  }

  if (error) {
    return (
      <>
        {header}
        <StateMessage title={errorMessage} subtitle={errorSubtitle ?? error.message} />
      </>
    );
  }

  if (isEmpty) {
    return (
      <>
        {header}
        {renderEmpty ? renderEmpty() : <StateMessage title={emptyMessage} />}
      </>
    );
  }

  return (
    <>
      {header}
      {children}
    </>
  );
}
