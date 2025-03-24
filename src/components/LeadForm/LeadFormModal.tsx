"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

interface LeadFormModalProps {
  onClose: () => void;
}

export function LeadFormModal({ onClose }: LeadFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    zipCode: "",
    insuranceType: "",
    message: "",
    urgency: "normal",
    contactPreference: "email",
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, consent: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Reset form or close after delay
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        // Handle error
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Terima Kasih!
            </h3>
            <p className="text-gray-500">
              Kami telah menerima maklumat anda dan akan menghubungi anda dalam
              masa terdekat.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-1">
              Cari Pusat Dialisis Yang Sesuai
            </h2>
            <p className="text-gray-500 mb-6">
              Isi borang ini dan kami akan membantu menghubungkan anda dengan
              pilihan terbaik.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Penuh</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Emel</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Nombor Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="zipCode">Poskod</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="insuranceType">Jenis Insurans (Pilihan)</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("insuranceType", value)
                  }
                  value={formData.insuranceType}
                >
                  <SelectTrigger id="insuranceType">
                    <SelectValue placeholder="Pilih jenis insurans" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicare">Medicare</SelectItem>
                    <SelectItem value="medicaid">Medicaid</SelectItem>
                    <SelectItem value="private">Insurans Swasta</SelectItem>
                    <SelectItem value="other">Lain-lain</SelectItem>
                    <SelectItem value="none">Tiada Insurans</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="urgency">
                  Seberapa segera anda memerlukan rawatan?
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("urgency", value)
                  }
                  value={formData.urgency}
                >
                  <SelectTrigger id="urgency">
                    <SelectValue placeholder="Pilih keterdesakan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Segera</SelectItem>
                    <SelectItem value="soon">Dalam masa seminggu</SelectItem>
                    <SelectItem value="normal">Dalam masa sebulan</SelectItem>
                    <SelectItem value="planning">
                      Hanya merancang untuk masa hadapan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Maklumat Tambahan</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Beritahu kami tentang keperluan khusus atau pertanyaan anda..."
                  className="h-24"
                />
              </div>

              <div>
                <Label htmlFor="contactPreference">
                  Kaedah Hubungan Pilihan
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("contactPreference", value)
                  }
                  value={formData.contactPreference}
                >
                  <SelectTrigger id="contactPreference">
                    <SelectValue placeholder="Pilih kaedah hubungan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Emel</SelectItem>
                    <SelectItem value="phone">Telefon</SelectItem>
                    <SelectItem value="text">Pesanan Teks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={handleCheckboxChange}
                  required
                />
                <Label htmlFor="consent" className="text-sm">
                  Saya bersetuju untuk dihubungi mengenai perkhidmatan dialisis.
                  Saya faham data saya akan diproses mengikut Dasar Privasi.
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Menghantar..." : "Hantar Permintaan"}
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
