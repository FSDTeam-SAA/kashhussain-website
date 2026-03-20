"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." })
    .max(50, { message: "Full name cannot exceed 50 characters." }),

  phoneNumber: z
    .string()
    .min(9, { message: "Phone number must be at least 9 digits." }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),

  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(500, { message: "Message cannot exceed 500 characters." }),
});

const ContactForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      message: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["contact-us"],
    mutationFn: async (values: {
      fullName: string;
      phoneNumber: string;
      message: string;
      email: string;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }

      toast.success(data?.message || "Message sent successfully");
      form.reset();
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm md:text-base font-medium leading-normal text-[#343A40] font-poppins">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="border border-[#C0C3C1] h-[40px] rounded-[4px] placeholder:text-[#6C757D] text-base font-medium leading-normal text-primary"
                    placeholder="enter full name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm md:text-base font-medium leading-normal text-[#343A40] font-poppins">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    className="border border-[#C0C3C1] h-[40px] rounded-[4px] placeholder:text-[#6C757D] text-base font-medium leading-normal text-primary"
                    placeholder="hello@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm md:text-base font-medium leading-normal text-[#343A40] font-poppins">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    className="border border-[#C0C3C1] h-[40px] rounded-[4px] placeholder:text-[#6C757D] text-base font-medium leading-normal text-primary"
                    placeholder="+1234567890"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm md:text-base font-medium leading-normal text-[#343A40] font-poppins">
                  Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="border border-[#C0C3C1] h-[120px] rounded-[4px] placeholder:text-[#6C757D] text-base font-medium leading-normal text-primary"
                    placeholder="Write your message here..."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            type="submit"
            className="mt-2 h-[42px] w-full rounded-[4px] bg-gradient-to-b from-[#3A7AF8] to-[#2248AF] text-[13px] font-medium text-white shadow-[0_8px_18px_rgba(34,72,175,0.18)] hover:opacity-95"
          >
            {isPending ? "Sending..." : "Send Message"}
            {!isPending && <Send className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;