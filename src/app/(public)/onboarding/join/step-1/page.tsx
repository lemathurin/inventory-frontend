"use client";

import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Minus } from "lucide-react";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useAcceptHomeInvite } from "@/domains/home/hooks/useAcceptHomeInvite";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  inviteCode: z.string().min(8, {
    message: "Invite code must have 8 characters.",
  }),
});

export default function OnboardingJoinStep1() {
  const router = useRouter();
  const acceptHomeInvite = useAcceptHomeInvite();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const cleanedCode = data.inviteCode.replace(/-/g, "").toUpperCase();
    const formattedCode = cleanedCode.replace(/^(.{4})(.{4})$/, "$1-$2");
    try {
      const response = await acceptHomeInvite(formattedCode);
      if (response && response.home && response.home.id) {
        router.push(`/home/${response.home.id}`);
      }
    } catch (error) {
      console.error("Failed to join home:", error);
    }
  }

  return (
    <>
      <OnboardingHeader currentStep={1} totalSteps={2} />
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Join a home</CardTitle>
            <CardDescription>Input the invite code to join</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="inviteCode"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={9}
                            {...field}
                            onChange={(value) => {
                              const cleanedValue = value
                                .replace(/-/g, "")
                                .toUpperCase();
                              if (cleanedValue.length <= 8) {
                                field.onChange(cleanedValue);
                              }
                            }}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                            <Minus className="mx-2" />
                            <InputOTPGroup>
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                              <InputOTPSlot index={6} />
                              <InputOTPSlot index={7} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      {fieldState.error && (
                        <div className="pt-3">
                          <ErrorMessage error={fieldState.error.message} />
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Join
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
