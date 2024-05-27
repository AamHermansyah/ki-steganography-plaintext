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
  msgSecret: z.string().min(1, {
    message: 'Pesan rahasia tidak boleh kosong'
  }),
  password: z.string(),
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
  result: z.string(),
  usingPassword: z.boolean().default(true).optional(),
})
  .refine((data) => data.usingPassword ? !!data.password.length : true, {
    message: "Password tidak boleh kosong",
    path: ["password"],
  });

export function HideForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      msgSecret: '',
      msgCover: '',
      password: '',
      result: '',
      usingPassword: true
    },
  });

  const handleReset = () => {
    form.reset();
    form.clearErrors();
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const promise = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let { msgSecret, password, msgCover } = values;
          password = !password.length ? process.env.NEXT_PUBLIC_DEFAULT_PASSWORD as string : password;
          const stegcloak = new StegCloak(true, false);

          const result = stegcloak.hide(msgSecret, password, msgCover);
          form.setValue('result', result);
          setLoading(false);

          resolve('Pesan berhasil disembunyikan!')
        }, 1000);
      });
    };

    toast.promise(promise, {
      loading: 'Loading...',
      success: (message) => {
        return `${message}`;
      },
      error: 'Error',
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sembunyikan Rahasia</CardTitle>
        <CardDescription>
          Pesan yang dirahasiakan tidak akan terlihat dan hanya teks cover saja yang akan ditampilkan!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* @ts-ignore */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid w-full items-center gap-2">
              <FormField
                control={form.control}
                name="msgSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pesan Rahasia</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none"
                        placeholder="Masukan pesan rahasia"
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
                        <FormDescription className="mt-1">
                          Jangan lupakan kata sandinya!
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="msgCover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teks Cover</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none"
                        placeholder="Masukan teks cover"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <CardFooter className="flex justify-end gap-4 pb-0 px-0">
                <Button variant="outline" onClick={handleReset} disabled={loading}>
                  Reset
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Proses...' : 'Sembunyikan'}
                </Button>
              </CardFooter>
              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hasil</FormLabel>
                    <div className="relative">
                      {!!form.getValues('result') && (
                        <CopyButton className="absolute top-1 right-1" text={form.getValues('result')} />
                      )}
                      <FormControl>
                        <Textarea
                          {...field}
                          className="resize-none"
                          placeholder="Pesan yang akan dirahasiakan akan muncul disini!"
                          readOnly
                        />
                      </FormControl>
                      <FormDescription className="mt-1">
                        Gunakan teks ini sebagai pesan rahasia yang disembunyikan.
                      </FormDescription>
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
