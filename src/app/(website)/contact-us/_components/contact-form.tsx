"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import {Send}  from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." })
    .max(50, { message: "Full name cannot exceed 50 characters." }),

  phone: z
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
            name: "",
            phone: "",
            email: "",
            message: "",
        },
    })


    const {mutate, isPending} = useMutation({
        mutationKey: ["contact-us"],
        mutationFn: async (values: {name:string, phone:string, message:string, email:string})=>{
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contact`,{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(values)
            })
            return res.json()
        },
        onSuccess: (data)=>{
            if(!data?.status){
                toast.error(data?.message || "Something went wrong");
                return 0;
            }
            toast.success(data?.message || "Contact Created successfully")
            form.reset();
        }
    })
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        mutate(values)
    }
    return (
        <div className="">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-normal leading-[150%] text-[#2A2A2A]">Full Name *</FormLabel>
                                    <FormControl>
                                        <Input className="h-[45px] rounded-[8px] border border-[#5A5A5A] py-3 px-4 placeholder:text-[#929292] outline-none ring-0" placeholder="Enter your full name" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-normal leading-[150%] text-[#2A2A2A]">Phone Number *</FormLabel>
                                    <FormControl>
                                        <Input className="h-[45px] rounded-[8px] border border-[#5A5A5A] py-3 px-4 placeholder:text-[#929292] outline-none ring-0" placeholder="Enter your phone number" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-normal leading-[150%] text-[#2A2A2A]">Email Address *</FormLabel>
                                <FormControl>
                                    <Input className="h-[45px] rounded-[8px] border border-[#5A5A5A] py-3 px-4 placeholder:text-[#929292] outline-none ring-0" placeholder="Enter your Email Address" {...field} />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-normal leading-[150%] text-[#2A2A2A]">Message *</FormLabel>
                                <FormControl>
                                    <Textarea className="h-[121px] rounded-[8px] border border-[#5A5A5A] py-3 px-4 placeholder:text-[#929292] outline-none ring-0" placeholder="Tell us how we can help you" {...field} />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isPending} className="w-full h-[48px]  text-base text-white font-normal leading-[120%] rounded-[8px] bg-primary " type="submit"> <Send /> {isPending ? "Sending..." : "Send Message"}</Button>
                </form>
            </Form>
        </div>
    )
}

export default ContactForm