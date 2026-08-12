"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-primary btn-md print:hidden"
      type="button"
    >
      Print / Save as PDF
    </button>
  );
}
