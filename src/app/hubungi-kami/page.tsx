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
            <div>
              <h2 className="text-xl font-bold">Kolaborasi</h2>
              <p className="text-muted-foreground">
                Untuk sebarang kolaborasi. Hubungi kami melalui maklumat
                dibawah.
              </p>
            </div>

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
              <Button variant="default" className="text-white" asChild>
                <div className="flex items-center space-x-1">
                  <Image
                    src="/whatsapp.svg"
                    alt="WhatsApp"
                    width={20}
                    height={20}
                    className="text-muted-foreground"
                  />
                  <a
                    href="https://wa.me/+601172755299"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline"
                  >
                    WhatsApp +60 11727 55299
                  </a>{" "}
                </div>
              </Button>
              {/* <div>
                <h2 className="text-xl font-bold mt-8 mb-2">
                  Perlukan bantuan membina laman web pusat dialisis?
                </h2>
                <p className="text-muted-foreground mb-4">
                  Hubungi kami melalui WhatsApp dibawah.
                </p>
                <Button asChild className="my-3">
                  <div className="flex items-center space-x-1">
                    <Image
                      src="/whatsapp.svg"
                      alt="WhatsApp"
                      width={20}
                      height={20}
                      className="text-white"
                    />
                    <a
                      href="https://wa.me/+601137902425"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline"
                    >
                      WhatsApp +60 113790 2425
                    </a>{" "}
                  </div>
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
