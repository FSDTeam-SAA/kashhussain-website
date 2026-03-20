"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters." })
      .trim(),

    email: z
      .string()
      .trim()
      .email({ message: "Please enter a valid email address." }),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),

    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters long.",
    }),

    rememberMe: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type FormValues = z.infer<typeof formSchema>;

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });

const { mutate, isPending } = useMutation({
  mutationKey: ["signup"],

  mutationFn: async (values: {fullName:string, email:string, password:string}) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Registration failed");
    }

    return data;
  },

  onSuccess: (data) => {
    if (!data?.success) {
      toast.error(data?.message || "Something went wrong!");
      return;
    }

    toast.success(data?.message || "Registration successful");

    form.reset();

    setTimeout(() => {
      router.push("/login");
    }, 1200);
  },

  onError: (error: Error) => {
    toast.error(error.message || "Something went wrong");
  },
});

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const payload = {
      fullName: values.fullName,
      email : values.email,
      password : values.password
    }
    mutate(payload)
  }

  return (
    <div>
      <div className="w-full md:w-[570px] rounded-[16px] border-[2px] border-[#E7E7E7] bg-white p-5 md:p-6 shadow-[0px_0px_32px_0px_#0000001F]">
        <div className="flex w-full items-center justify-center pb-5">
          <Link href="/">
            <Image
              src="/assets/images/logo.png"
              alt="auth logo"
              width={500}
              height={500}
              className="h-94px] w-[154px] object-contain"
            />
          </Link>
        </div>
        <h3 className="text-2xl md:text-[32px] lg:text-[40px] font-bold text-[#131313] text-center leading-[120%] ">
          Create an account
        </h3>
        <p className="text-base md:text-lg font-normal text-[#616161] leading-[150%] text-center pb-1">
          Please enter your email and password to continue
        </p>
        

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-6 "
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-[#2A2A2A] leading-[120%]">
                    Full Name <sup className="text-[#8C311E]">*</sup>
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="h-[48px] bg-[#EAEAEA] !rounded-[8px] text-base font-medium text-[#131313] py-3 px-4 border-none placeholder:text-[#787878]"
                      placeholder="Enter your full name"
                      {...field}
                    />
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
                  <FormLabel className="text-base font-semibold text-[#2A2A2A] leading-[120%]">
                    Email <sup className="text-[#8C311E]">*</sup>
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="h-[48px] bg-[#EAEAEA] !rounded-[8px] text-base font-medium text-[#131313] py-3 px-4 border-none placeholder:text-[#787878]"
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-[#2A2A2A] leading-[120%]">
                    Password <sup className="text-[#8C311E]">*</sup>
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        className="h-[48px] bg-[#EAEAEA] !rounded-[8px] text-base font-medium text-[#131313] py-3 px-4 border-none placeholder:text-[#787878]"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        {...field}
                      />

                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <Eye className="text-[#787878]" />
                        ) : (
                          <EyeOff className="text-[#787878]" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-[#2A2A2A] leading-[120%]">
                    Confirm Password <sup className="text-[#8C311E]">*</sup>
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        className="h-[48px] bg-[#EAEAEA] !rounded-[8px] text-base font-medium text-[#131313] py-3 px-4 border-none placeholder:text-[#787878]"
                        type={confirmShowPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        {...field}
                      />

                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        onClick={() => setConfirmShowPassword((prev) => !prev)}
                      >
                        {confirmShowPassword ? (
                          <Eye className="text-[#787878]" />
                        ) : (
                          <EyeOff className="text-[#787878]" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>

                  <Label className="text-[#2A2A2A] text-sm font-medium leading-[120%]">
                    I agree to the{" "}
                    <span className="text-[#8C311E]">
                      terms &amp; conditions
                    </span>
                  </Label>
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button disabled={isPending} className="h-[48px] w-full rounded-[8px]" type="submit">
                {isPending ? "Creating..." : "Create Account"}
              </Button>
            </div>

            <p className="text-sm text-[#363636] font-medium text-center pt-2 leading-[120%]">
              Don’t have an account?{" "}
              <Link className="text-[#23547B] underline" href="/login">
                Log in
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
