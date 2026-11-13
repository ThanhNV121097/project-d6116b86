import { Link } from "react-router-dom";
import { Badge } from "./admin";
import { nameIn } from "./admin/fields";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import type { Product } from "../lib/shop";

/**
 * What is running low, on the overview: a short table, least first, each row
 * opening the product. Not a <DataTable> — that is a whole list with its
 * paging and its export, and this is seven rows that answer one question.
 */
export default function AdminLowStock({ rows, labels }: {
  rows: readonly Product[];
  /** The three column headings, from content.json so the owner can change them. */
  labels: readonly [string, string, string];
}) {
  const sorted = [...rows].sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0)).slice(0, 8);
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>{labels[0]}</TableHead>
          <TableHead>{labels[1]}</TableHead>
          <TableHead className="text-right">{labels[2]}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              <Link to={`/admin/products/${p.id}`} className="font-medium text-ink hover:underline">{p.name}</Link>
            </TableCell>
            <TableCell className="text-ink-soft">{nameIn("categories", p.category)}</TableCell>
            <TableCell className="text-right">
              <Badge tone={(p.stock ?? 0) === 0 ? "danger" : "neutral"}>{p.stock ?? 0}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
