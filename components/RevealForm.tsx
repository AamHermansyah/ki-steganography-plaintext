"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import StegCloak from "stegcloak"
import { useState } from "react"
import { toast } from "sonner"
import CopyButton from "./CopyButton"
import { Switch } from "./ui/switch"

const formSchema = z.object({
  msgCover: z.string()
    .min(1, {
      message: 'Teks cover tidak boleh kosong'
    })
    .refine((value) => {
      const words = value.trim().split(/\s+/);
      return words.length >= 2;
    }, {
      message: 'Teks cover harus terdiri dari minimal 2 kata'
    }),
  password: z.string(),
  result: z.string(),
  usingPassword: z.boolean().default(false).optional(),
})
  .refine((data) => data.usingPassword ? !!data.password.length : true, {
    message: "Password tidak boleh kosong",
    path: ["password"],
  });

export function RevealForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      msgCover: '',
      password: '',
      result: '',
      usingPassword: false
    },
  });

  const handleReset = () => {
    form.reset();
    form.clearErrors();
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const promise = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let { password, msgCover } = values;
          password = !password.length ? process.env.NEXT_PUBLIC_DEFAULT_PASSWORD as string : password;
          const stegcloak = new StegCloak(true, false);

          try {
            const result = stegcloak.reveal(msgCover, password);
            form.setValue('result', result);
            setLoading(false);
            resolve('Pesan rahasia berhasil dipecahkan!');
          } catch (error) {
            setLoading(false);
            reject(error);
          }
        }, 1000);
      });
    };

    toast.promise(promise, {
      loading: 'Loading...',
      success: (message) => {
        return `${message}`;
      },
      error: 'Pesan rahasia tidak ditemukan!',
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pecahkan Pesan Rahasia</CardTitle>
        <CardDescription>
          Pesan biasa yang terkunci akan dipecahkan untuk mengetahui pesan rahasia didalamnya!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* @ts-ignore */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid w-full items-center gap-2">
              <FormField
                control={form.control}
                name="msgCover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pesan Biasa</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none"
                        placeholder="Masukan pesan biasa"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usingPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>
                        Gunakan Kata Sandi?
                      </FormLabel>
                      <FormDescription>
                        Untuk perlindungan pesan yang lebih terenkripsi.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (!checked) form.clearErrors('password');
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.getValues('usingPassword') && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kata Sandi</FormLabel>
                      <div>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="resize-none"
                            placeholder="Masukan kata sandi"
                            disabled={loading || !form.getValues('usingPassword')}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="space-y-2">
              <CardFooter className="flex justify-end gap-4 pb-0 px-0">
                <Button variant="outline" onClick={handleReset} disabled={loading}>
                  Reset
                </Button>
                <Button disabled={loading}>
                  {loading ? 'Proses...' : 'Pecahkan'}
                </Button>
              </CardFooter>
              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pesan Rahasia</FormLabel>
                    <div className="relative">
                      {!!form.getValues('result') && (
                        <CopyButton className="absolute top-1 right-1" text={form.getValues('result')} />
                      )}
                      <FormControl>
                        <Textarea
                          {...field}
                          className="resize-none"
                          placeholder="Pesan rahasia akan muncul disini!"
                          readOnly
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
