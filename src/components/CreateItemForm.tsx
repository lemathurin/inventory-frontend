"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { format } from "date-fns";
import { CalendarIcon, CirclePlus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useCreateItem } from "@/domains/item/hooks/useCreateItem";
import { useHome } from "@/domains/home/home.context";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useUser } from "@/domains/user/user.context";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  date: z.date().optional(),
  roomId: z.string().min(1, "Room is required"),
  isPublic: z.boolean().default(false),
  hasWarranty: z.boolean().default(false),
  warrantyType: z.string().optional(),
  warrantyLength: z
    .number()
    .min(1, "Warranty length must be at least 1 year")
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateItemForm() {
  const { homeData } = useHome();
  const { userData } = useUser();
  const createItem = useCreateItem();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      date: undefined,
      roomId: "",
      isPublic: false,
      hasWarranty: false,
      warrantyType: "",
      warrantyLength: undefined,
    },
  });

  const hasWarranty = form.watch("hasWarranty");
  const warrantyType = form.watch("warrantyType");

  if (!homeData) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Card>
    );
  }

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      await createItem(
        homeData!.id,
        data.name,
        data.roomId,
        data.description || "",
        data.isPublic,
        data.date?.toISOString(),
        data.price || 0,
        data.hasWarranty,
        data.warrantyType || "",
        data.warrantyLength,
      );
      form.reset();
    } catch (err) {
      console.error("Failed to create item:", err);
      setError("An error occurred while creating the item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Create New Item</CardTitle>
        <CardDescription>Add a new item to your home inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Error creating item
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item name" {...field} />
                  </FormControl>
                  <ErrorMessage error={form.formState.errors.name?.message} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormDescription>Or notes</FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description or notes"
                      {...field}
                    />
                  </FormControl>
                  <ErrorMessage
                    error={form.formState.errors.description?.message}
                  />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-muted-foreground">€</span>
                        </div>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseFloat(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </div>
                    </FormControl>
                    <ErrorMessage
                      error={form.formState.errors.price?.message}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>dd/mm/yyyy</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <ErrorMessage error={form.formState.errors.date?.message} />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <FormDescription>Where this item is kept</FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {homeData.rooms
                          ?.filter((room) =>
                            room.users?.some(
                              (user) => user.userId === userData?.userId,
                            ),
                          )
                          .map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.name}
                            </SelectItem>
                          )) ?? []}
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      error={form.formState.errors.roomId?.message}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <FormDescription>Who can see this item?</FormDescription>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "public")
                      }
                      defaultValue={field.value ? "public" : "private"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="private">Only me</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      error={form.formState.errors.isPublic?.message}
                    />
                  </FormItem>
                )}
              />
            </div>

            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="hasWarranty"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Warranty</FormLabel>
                        <FormDescription>
                          Does this item come with a warranty?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {hasWarranty && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="warrantyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warranty Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="extended">
                                Extended warranty
                              </SelectItem>
                              <SelectItem value="lifetime">
                                Lifetime warranty
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <ErrorMessage
                            error={form.formState.errors.warrantyType?.message}
                          />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="warrantyLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warranty Length (Years)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="1"
                              placeholder="e.g., 2"
                              disabled={warrantyType === "lifetime"}
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number.parseInt(e.target.value)
                                    : undefined,
                                )
                              }
                            />
                          </FormControl>
                          <ErrorMessage
                            error={
                              form.formState.errors.warrantyLength?.message
                            }
                          />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div>
              <FormLabel>Images and Files</FormLabel>
              <FormDescription>Upload images and PDFs</FormDescription>
              <div className="mt-2 border border-dashed rounded-md p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <div className="mt-2">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-sm text-primary hover:text-primary/80"
                    >
                      Click to upload files
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*,.pdf"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, PDF up to 10MB each
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              <CirclePlus />
              {isSubmitting ? "Creating Item..." : "Create Item"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
