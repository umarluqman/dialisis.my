import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terma dan Syarat",
  description:
    "Terma dan syarat penggunaan platform Dialisis.my. Sila baca dengan teliti sebelum menggunakan perkhidmatan kami.",
  alternates: {
    canonical: "https://dialisis.my/terma-dan-syarat",
  },
  openGraph: {
    title: "Terma dan Syarat | Dialisis MY",
    description:
      "Terma dan syarat penggunaan platform Dialisis.my. Sila baca dengan teliti sebelum menggunakan perkhidmatan kami.",
    url: "https://dialisis.my/terma-dan-syarat",
    type: "website",
    siteName: "Dialisis.my",
    locale: "ms_MY",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terma dan Syarat | Dialisis.my",
    description:
      "Terma dan syarat penggunaan platform Dialisis.my. Sila baca dengan teliti sebelum menggunakan perkhidmatan kami.",
  },
};

export default function TermaPage() {
  return (
    <main className="container py-8 md:py-12">
      <div className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-bold mb-8">Terma dan Syarat</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Pengenalan</h2>
          <p>
            Selamat datang ke Dialisis.my. Dengan mengakses dan menggunakan
            laman web ini, anda bersetuju untuk terikat dengan terma dan syarat
            yang dinyatakan di bawah.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Penggunaan Kandungan
          </h2>
          <p>
            Semua kandungan yang terdapat di Dialisis.my adalah dilindungi oleh
            hak cipta. Anda dibenarkan untuk melihat dan memuat turun kandungan
            untuk kegunaan peribadi dan bukan komersial sahaja.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Maklumat Pusat Dialisis
          </h2>
          <p>
            Maklumat mengenai pusat dialisis yang dipaparkan di laman web ini
            adalah untuk tujuan informasi sahaja. Kami berusaha untuk memastikan
            ketepatan maklumat, tetapi tidak menjamin kesempurnaan atau
            ketepatannya.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Penafian</h2>
          <p>
            Dialisis.my tidak bertanggungjawab atas sebarang kerugian atau
            kerosakan yang timbul daripada penggunaan maklumat yang terdapat di
            laman web ini. Pengguna disarankan untuk mengesahkan maklumat secara
            langsung dengan pusat dialisis yang berkenaan.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Perubahan pada Terma
          </h2>
          <p>
            Kami berhak untuk mengubah terma dan syarat ini pada bila-bila masa.
            Perubahan akan berkuat kuasa serta-merta selepas dipaparkan di laman
            web ini.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Undang-undang yang Terpakai
          </h2>
          <p>
            Terma dan syarat ini tertakluk kepada undang-undang Malaysia dan
            sebarang pertikaian akan diselesaikan di mahkamah Malaysia.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Hubungi Kami</h2>
          <p>
            Jika anda mempunyai sebarang pertanyaan mengenai terma dan syarat
            ini, sila hubungi kami melalui halaman Hubungi Kami.
          </p>
        </section>
      </div>
    </main>
  );
}
