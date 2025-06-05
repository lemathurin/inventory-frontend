"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateItem } from "@/domains/item/hooks/useCreateItem";
import { useHome } from "@/contexts/home.context";
import { useGetRoomsByHomeId } from "@/domains/home/hooks/useGetRoomsByHomeId";
import { RoomModel } from "@/domains/room/room.types";
import { z } from "zod";

// Define the schema for form validation
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().optional(),
  date: z.date().optional(),
  roomId: z.string().optional(),
  isPublic: z.boolean().optional(),
  hasWarranty: z.boolean().optional(),
  warrantyType: z.string().optional(),
  warrantyLength: z.number().optional(),
});

export default function CreateItemForm() {
  const { homeData } = useHome();
  const createItem = useCreateItem();
  const getRoomsByHomeId = useGetRoomsByHomeId();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | undefined>();
  const [date, setDate] = useState<Date>();
  const [rooms, setRooms] = useState<RoomModel[]>([]);
  const [roomId, setRoomId] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [hasWarranty, setHasWarranty] = useState(false);
  const [warrantyType, setWarrantyType] = useState("");
  const [warrantyLength, setWarrantyLength] = useState<number | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (homeData) {
      getRoomsByHomeId(homeData.id)
        .then(setRooms)
        .catch((error) => console.error("Failed to fetch rooms"));
    }
  }, [homeData]);

  if (!homeData) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Validate the form data using zod
      const formData = {
        name,
        description,
        price,
        date,
        roomId,
        isPublic,
        hasWarranty,
        warrantyType,
        warrantyLength,
      };
      formSchema.parse(formData);
      setErrors({});
      await createItem(
        homeData!.id,
        name,
        roomId,
        description,
        isPublic,
        date?.toISOString(),
        price,
        hasWarranty,
        warrantyType,
        warrantyLength,
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Failed to create item:", error);
      }
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="mb-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            className="mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <div className="text-sm text-muted-foreground">Or notes</div>
          <Textarea
            id="description"
            className="mt-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-muted-foreground mr-2">€</span>
              </div>
              <Input
                id="price"
                className="pl-8"
                type="number"
                step="0.01"
                value={price || ""}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="date">Purchase date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1 justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {date ? format(date, "dd/MM/yyyy") : "dd/mm/yyyy"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="room">Room</Label>
            <div className="text-sm text-muted-foreground">
              Where this item is kept
            </div>
            <Select onValueChange={setRoomId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="visibility">Visibility</Label>
            <div className="text-sm text-muted-foreground">
              Who can see this item?
            </div>
            <Select
              value={isPublic ? "public" : "private"}
              onValueChange={(value) => setIsPublic(value === "public")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Only me</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className=" flex-col rounded-md border p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Label htmlFor="has-warranty">Warranty</Label>
              <div className="text-sm text-muted-foreground">
                Does this item come with a warranty?
              </div>
            </div>
            <Switch
              id="has-warranty"
              checked={hasWarranty}
              onCheckedChange={setHasWarranty}
            />
          </div>

          {hasWarranty && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room">Warranty type</Label>
                <Select onValueChange={setWarrantyType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="extendedWarranty">
                      Extended warranty
                    </SelectItem>
                    <SelectItem value="liftimeWarranty">
                      Lifetime warranty
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="visibility">Warranty length in years</Label>
                <Input
                  id="warrantyLength"
                  className="mt-1"
                  type="number"
                  step="1"
                  value={warrantyLength || ""}
                  onChange={(e) => setWarrantyLength(Number(e.target.value))}
                  disabled={warrantyType === "liftimeWarranty"}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="files">Images and files</Label>
          <div className="text-sm text-muted-foreground">
            Upload images and PDFs
          </div>
          <div className="mt-1 border border-dashed rounded-md p-6 flex justify-center items-center">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <div className="mt-2">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-sm text-primary hover:text-primary/80"
                >
                  Click to upload file
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit">Create Item</Button>
      </form>
    </Card>
  );
}
