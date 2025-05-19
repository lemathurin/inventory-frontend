"use client";

import { useState } from "react";
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

export default function CreateItemForm() {
  const [date, setDate] = useState<Date>();
  const [hasWarranty, setHasWarranty] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Handle form submission logic here
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="mb-4">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" className="mt-1" />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <div className="text-sm text-muted-foreground">Or notes</div>
        <Textarea id="description" className="mt-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-muted-foreground mr-2">€</span>
            </div>
            <Input id="price" className="pl-8" type="number" step="0.01" />
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
            Where this item is kept in your home
          </div>
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="livingroom">Living Room</SelectItem>
              <SelectItem value="bedroom">Bedroom</SelectItem>
              <SelectItem value="kitchen">Kitchen</SelectItem>
              <SelectItem value="bathroom">Bathroom</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="garage">Garage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="visibility">Visibility</Label>
          <div className="text-sm text-muted-foreground">
            Who can see this item?
          </div>
          <Select defaultValue="private">
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">only me</SelectItem>
              <SelectItem value="family">family</SelectItem>
              <SelectItem value="friends">friends</SelectItem>
              <SelectItem value="public">public</SelectItem>
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
              <Select>
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
    </form>
  );
}
