import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polisi Privasi | Dialisis.my",
  description:
    "Polisi privasi Dialisis.my menjelaskan bagaimana kami mengumpul, menggunakan dan melindungi maklumat peribadi anda.",
};

export default function PrivacyPage() {
  return (
    <main className="container py-8 md:py-12">
      <div className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-bold mb-8">Polisi Privasi</h1>

        <section className="mb-8">
          <p className="text-gray-600 mb-8">
            Dikemas kini terakhir: {new Date().toLocaleDateString("ms-MY")}
          </p>

          <p>
            Dialisis.my komited untuk melindungi privasi anda. Polisi privasi
            ini menerangkan bagaimana kami mengumpul, menggunakan, dan
            melindungi maklumat peribadi anda apabila anda menggunakan laman web
            kami.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Pengumpulan Maklumat
          </h2>
          <p>
            Kami mengumpul maklumat yang anda berikan secara langsung kepada
            kami melalui:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Borang hubungi</li>
            <li>Pertanyaan melalui e-mel</li>
            <li>Maklumat penggunaan laman web</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Penggunaan Maklumat
          </h2>
          <p>Kami menggunakan maklumat yang dikumpul untuk:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Memberikan maklumat tentang pusat dialisis</li>
            <li>Menjawab pertanyaan anda</li>
            <li>Menambah baik laman web dan perkhidmatan kami</li>
            <li>Menghantar kemas kini dan maklumat berkaitan</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Perlindungan Data</h2>
          <p>
            Kami mengambil langkah-langkah keselamatan yang sesuai untuk
            melindungi maklumat anda daripada akses, pengubahan, atau pendedahan
            yang tidak dibenarkan.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Perkongsian Maklumat
          </h2>
          <p>
            Kami tidak akan menjual, menyewa, atau menukar maklumat peribadi
            anda dengan pihak ketiga tanpa kebenaran anda, kecuali apabila
            diperlukan oleh undang-undang.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Kuki dan Teknologi Penjejakan
          </h2>
          <p>
            Kami menggunakan kuki dan teknologi penjejakan yang serupa untuk
            mengumpul maklumat tentang penggunaan laman web kami dan untuk
            meningkatkan pengalaman pengguna.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Hak Pengguna</h2>
          <p>Anda mempunyai hak untuk:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Mengakses maklumat peribadi anda</li>
            <li>Membetulkan maklumat yang tidak tepat</li>
            <li>Meminta penghapusan maklumat anda</li>
            <li>Membantah pemprosesan maklumat anda</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Perubahan pada Polisi Privasi
          </h2>
          <p>
            Kami berhak untuk mengubah polisi privasi ini pada bila-bila masa.
            Sebarang perubahan akan dimaklumkan melalui laman web ini.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Hubungi Kami</h2>
          <p>
            Jika anda mempunyai sebarang pertanyaan mengenai polisi privasi ini
            atau amalan privasi kami, sila hubungi kami melalui halaman Hubungi
            Kami.
          </p>
        </section>
      </div>
    </main>
  );
}
