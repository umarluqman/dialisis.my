import { Button } from "@/components/ui/button";
import { Mail, MapPin } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description:
    "Hubungi kami untuk sebarang pertanyaan mengenai pusat dialisis di Malaysia.",
};

export default function HubungiKamiPage() {
  return (
    <main className="container max-w-4xl py-6 space-y-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Hubungi Kami</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Kami sedia membantu anda. Sila isi borang di bawah atau hubungi
              kami melalui maklumat yang disediakan.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  johari.workk@gmail.com
                </span>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Putrajaya, Malaysia
                </span>
              </div>
              <Button variant="default" asChild>
                <div className="flex items-center space-x-1">
                  <Image
                    src="/whatsapp.svg"
                    alt="WhatsApp"
                    width={20}
                    height={20}
                    className="text-muted-foreground"
                  />
                  <a
                    href="https://wa.me/+60117275599"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline"
                  >
                    WhatsApp +60 11727 5599
                  </a>{" "}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
