import { NextResponse } from "next/server";

type CsvValue = string | number | null | undefined;

function escapeCell(value: CsvValue): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCsv(rows: CsvValue[][]): string {
  const body = rows.map((row) => row.map(escapeCell).join(",")).join("\r\n");
  // UTF-8 BOM so Excel renders accented/Swahili characters correctly.
  return "\uFEFF" + body;
}

export function csvResponse(csv: string, filename: string): NextResponse {
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
