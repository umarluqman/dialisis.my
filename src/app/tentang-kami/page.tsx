import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Ketahui lebih lanjut mengenai misi kami untuk membantu pesakit buah pinggang di Malaysia mencari pusat dialisis yang sesuai.",
};

export default function TentangKamiPage() {
  return (
    <main className="container max-w-4xl py-6 space-y-8 mb-20">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tentang Kami</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Misi Kami</h2>
          <p className="text-muted-foreground">
            Dialisis.MY ditubuhkan dengan misi untuk memudahkan pesakit buah
            pinggang di Malaysia mencari pusat dialisis yang sesuai dengan
            keperluan mereka. Kami percaya bahawa akses kepada maklumat yang
            tepat dan lengkap adalah penting dalam membuat keputusan berkaitan
            kesihatan.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Apa Yang Kami Tawarkan</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              Direktori pusat dialisis yang komprehensif di seluruh Malaysia
            </li>
            <li>
              Maklumat terperinci tentang setiap pusat termasuk lokasi,
              kemudahan, dan perkhidmatan
            </li>
            <li>Carian mudah mengikut lokasi dan keperluan khusus</li>
            <li>Panduan berguna untuk pesakit dialisis</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Komitmen Kami</h2>
          <p className="text-muted-foreground">Kami komited untuk:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Menyediakan maklumat yang tepat dan terkini</li>
            <li>Membantu pesakit membuat keputusan termaklum</li>
            <li>Meningkatkan akses kepada perkhidmatan dialisis berkualiti</li>
            <li>Menyokong komuniti pesakit buah pinggang di Malaysia</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
