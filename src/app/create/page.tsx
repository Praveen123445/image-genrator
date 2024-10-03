"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  prompt: z.string().min(7, { message: "Prompt must be at least 7 characters long!" }),
});

export default function Page() {
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.status === 200) {
        setOutputImage(data.url);
      } else {
        console.error(data.error);
        toast({ variant: "destructive", description: data.error });
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", description: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-dvh flex justify-start items-center pt-[72px] flex-col">
      <div className="w-full p-3">
        <h1 className="text-center font-bold text-white text-4xl">Create</h1>
        <p className="text-white/60 text-center">
          Generate Stunning Images from Text for FREE
        </p>
      </div>
      <div className="flex w-full gap-3 h-full md:flex-row flex-col">
        <div className="__form flex-[2] gap-2 flex justify-center items-start flex-col">
          <p className="text-center w-full lg:text-left text-sm text-white/80">
            Type your prompt below to create any image you can imagine!
          </p>
          <div className="flex gap-2 w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex gap-2">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-full lg:max-w-[70%]">
                      <FormControl>
                        <Input
                          placeholder="a cat sitting over a sofa..."
                          className="w-full transition-all border-white"
                          disabled={loading} // Disable input when loading
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button loading={loading} type="submit" disabled={loading}>
                  Generate
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="__output min-h-[300px] lg:min-h-full lg:h-full flex-[1] bg-white/5 rounded-lg relative overflow-hidden">
          {outputImage ? (
            <Image
              alt="output"
              className="w-full h-full object-contain"
              src={outputImage}
              width={300}
              height={300}
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center text-white/70 text-center p-3">
              Enter your prompt and hit Generate!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
