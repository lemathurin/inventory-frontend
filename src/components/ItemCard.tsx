import { ItemModel } from "@/domains/item/item.types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { EyeOff } from "lucide-react";

export default function ItemCard({ item }: { item: ItemModel }) {
  return (
    <Link href={`/home/${item.homeId}/item/${item.id}`}>
      <Card className="h-[300px] bg-muted p-3 flex flex-col justify-between">
        <div className="flex gap-2 flex-wrap">
          <Badge>{item.rooms?.[0]?.name}</Badge>
          {item.owner?.name && (
            <Badge variant="outline">{item.owner?.name}</Badge>
          )}
          {!item.public && (
            <Badge variant="outline" className="gap-1">
              <EyeOff className="h-3 w-3" /> Private
            </Badge>
          )}
          {item.price != null && item.price !== 0 && (
            <Badge variant="secondary">€{item.price}</Badge>
          )}
        </div>
        <div className="w-fit inline-flex bg-background px-2 py-1 rounded text-primary text-lg text-semidbold">
          {item.name}
        </div>
      </Card>
    </Link>
  );
}
