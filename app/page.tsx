import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <Card className="mt-8 w-full">
          <CardHeader>
            <CardTitle>Bienvenue</CardTitle>
            <CardDescription>
              Composants shadcn/ui intégrés avec Tailwind v4.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600 dark:text-zinc-400">
              Ceci est un exemple de carte utilisant les composants shadcn/ui.
            </p>
          </CardContent>
          <CardFooter>
            <Button>Action principale</Button>
            <Button variant="outline" className="ml-2">
              Secondaire
            </Button>
          </CardFooter>
        </Card>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Button asChild>
            <a
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Déployer maintenant
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
}
