import { HideForm } from "@/components/HideForm";
import { RevealForm } from "@/components/RevealForm";
import Team from "@/components/Team";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Home() {
  return (
    <>
      <main className="min-h-screen w-full max-w-7xl flex flex-col items-center justify-center mx-auto gap-6 sm:gap-10 px-4 sm:px-10 pt-6 pb-10 sm:py-10">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl tracking-tight text-primary font-bold uppercase text-center">
          Steganografi
          <br />
          Pesan Rahasia Dalam Teks Biasa
        </h1>
        <Tabs defaultValue="hide" className="w-full max-w-xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hide">Sembunyikan</TabsTrigger>
            <TabsTrigger value="reveal">Pecahkan</TabsTrigger>
          </TabsList>
          <TabsContent value="hide">
            <HideForm />
          </TabsContent>
          <TabsContent value="reveal">
            <RevealForm />
          </TabsContent>
        </Tabs>
      </main>
      <Team />
    </>
  );
}
