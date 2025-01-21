"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nama mestilah sekurang-kurangnya 2 aksara.",
  }),
  email: z.string().email({
    message: "Sila masukkan alamat emel yang sah.",
  }),
  message: z.string().min(10, {
    message: "Mesej mestilah sekurang-kurangnya 10 aksara.",
  }),
  // Honeypot field
  website: z.string().max(0, "Field ini tidak sepatutnya diisi."),
});

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      website: "", // Honeypot field
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Ralat semasa menghantar mesej");
      }

      form.reset();
      toast({
        title: "Mesej berjaya dihantar!",
        description: "Kami akan menghubungi anda secepat mungkin.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ralat",
        description: "Maaf, terdapat masalah semasa menghantar mesej anda.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Nama anda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emel</FormLabel>
              <FormControl>
                <Input type="email" placeholder="emel@contoh.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mesej</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Sila tulis mesej anda di sini..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot field - hidden from real users */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem style={{ display: "none" }}>
              <FormControl>
                <Input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menghantar...
            </>
          ) : (
            "Hantar Mesej"
          )}
        </Button>
      </form>
    </Form>
  );
}
function zodResolver(
  formSchema: z.ZodObject<
    {
      name: z.ZodString;
      email: z.ZodString;
      message: z.ZodString;
      // Honeypot field
      website: z.ZodString;
    },
    "strip",
    z.ZodTypeAny,
    { message: string; name: string; email: string; website: string },
    { message: string; name: string; email: string; website: string }
  >
):
  | import("react-hook-form").Resolver<
      { message: string; name: string; email: string; website: string },
      any
    >
  | undefined {
  throw new Error("Function not implemented.");
}
