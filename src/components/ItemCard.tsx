import { ItemModel } from "@/domains/item/item.types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";

export default function ItemCard({ item }: { item: ItemModel }) {
  return (
    <Link href={`/home/${item.homeId}/item/${item.id}`}>
      <Card className="h-[300px] bg-muted p-3 flex flex-col justify-between">
        <div className="flex gap-2">
          <Badge>{item.rooms?.[0]?.name}</Badge>
          <Badge variant="secondary">€{item.price}</Badge>
        </div>
        <div className="inline-flex bg-sidebar px-1 rounded text-primary text-lg text-semidbold">
          {item.name}
        </div>
      </Card>
    </Link>
  );
}
