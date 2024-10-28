export const TREATMENT_TYPES = [
  "Hemodialysis",
  "Peritoneal Dialysis",
  "Transplant",
  "MRRB",
];

export const SECTOR = [
  "MOH",
  "NGO",
  "Armed Force",
  "Private",
  "University",
  "Others",
];

export const STATES = [
  "Semua Negeri / Wilayah",
  "Selangor",
  "Kuala Lumpur",
  "Pulau Pinang",
  "Johor",
  "Perak",
  "Perlis",
  "Putrajaya",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Sabah",
  "Sarawak",
  "Terengganu",
  "Labuan",
];

export const CITIES: Record<string, string[]> = {
  Johor: [
    "Johor Bahru",
    "Tebrau",
    "Pasir Gudang",
    "Bukit Indah",
    "Skudai",
    "Kluang",
    "Batu Pahat",
    "Muar",
    "Ulu Tiram",
    "Senai",
    "Segamat",
    "Kulai",
    "Kota Tinggi",
    "Pontian Kechil",
    "Tangkak",
    "Bukit Bakri",
    "Yong Peng",
    "Pekan Nenas",
    "Labis",
    "Mersing",
    "Simpang Renggam",
    "Parit Raja",
    "Kelapa Sawit",
    "Buloh Kasap",
    "Chaah",
    "Gelang Patah",
  ],
  Kedah: [
    "Sungai Petani",
    "Alor Setar",
    "Kulim",
    "Jitra / Kubang Pasu",
    "Baling",
    "Pendang",
    "Langkawi",
    "Yan",
    "Sik",
    "Kuala Nerang",
    "Pokok Sena",
    "Bandar Baharu",
    "Kuala Kedah",
  ],
  Kelantan: [
    "Kota Bharu",
    "Pangkal Kalong",
    "Tanah Merah",
    "Peringat",
    "Wakaf Baru",
    "Kadok",
    "Pasir Mas",
    "Gua Musang",
    "Kuala Krai",
    "Tumpat",
  ],
  Melaka: [
    "Bandaraya Melaka",
    "Bukit Baru",
    "Ayer Keroh",
    "Klebang",
    "Masjid Tanah",
    "Sungai Udang",
    "Batu Berendam",
    "Alor Gajah",
    "Bukit Rambai",
    "Ayer Molek",
    "Bemban",
    "Kuala Sungai Baru",
    "Pulau Sebang",
    "Jasin",
    "Bukit Piatu",
    "Bukit Katil",
    "Bacang",
  ],
  "Negeri Sembilan": [
    "Seremban",
    "Port Dickson",
    "Nilai",
    "Bahau",
    "Tampin",
    "Kuala Pilah",
    "Bandar Sri Jempol",
    "Gemencheh",
    "Gemas",
    "Jelebu",
    "Kuala Klawang",
  ],
  Pahang: [
    "Kuantan",
    "Temerloh",
    "Bentong",
    "Mentakab",
    "Raub",
    "Jerantut",
    "Pekan",
    "Kuala Lipis",
    "Bandar Jengka",
    "Bukit Tinggi",
  ],
  Perak: [
    "Ipoh",
    "Taiping",
    "Sitiawan",
    "Simpang Empat",
    "Teluk Intan",
    "Batu Gajah",
    "Lumut",
    "Kampung Koh",
    "Kuala Kangsar",
    "Sungai Siput Utara",
    "Tapah",
    "Bidor",
    "Parit Buntar",
    "Ayer Tawar",
    "Bagan Serai",
    "Tanjung Malim",
    "Lawan Kuda Baharu",
    "Pantai Remis",
    "Kampar",
    "Seri Manjung",
  ],
  Perlis: ["Kangar", "Kuala Perlis"],
  "Pulau Pinang": [
    "Bukit Mertajam",
    "Georgetown",
    "Sungai Ara",
    "Gelugor",
    "Ayer Itam",
    "Butterworth",
    "Perai",
    "Nibong Tebal",
    "Permatang Kucing",
    "Tanjung Tokong",
    "Kepala Batas",
    "Tanjung Bungah",
    "Juru",
    "Bayan Lepas",
  ],
  Sabah: [
    "Kota Kinabalu",
    "Sandakan",
    "Tawau",
    "Lahad Datu",
    "Keningau",
    "Putatan",
    "Donggongon",
    "Semporna",
    "Kudat",
    "Kunak",
    "Papar",
    "Ranau",
    "Beaufort",
    "Kinarut",
    "Kota Belud",
    "Beluran",
    "Nabawan",
    "Pitas",
    "Tambunan",
  ],
  Sarawak: [
    "Kuching",
    "Miri",
    "Sibu",
    "Bintulu",
    "Limbang",
    "Sarikei",
    "Sri Aman",
    "Kapit",
    "Batu Delapan Bazaar",
    "Kota Samarahan",
    "Mukah",
    "Marudi",
  ],
  Selangor: [
    "Subang Jaya",
    "Klang",
    "Ampang Jaya",
    "Shah Alam",
    "Petaling Jaya",
    "Cheras",
    "Kajang",
    "Selayang Baru",
    "Rawang",
    "Taman Greenwood",
    "Semenyih",
    "Banting",
    "Balakong",
    "Gombak Setia",
    "Kuala Selangor",
    "Serendah",
    "Bukit Beruntung",
    "Pengkalan Kundang",
    "Jenjarom",
    "Sungai Besar",
    "Batu Arang",
    "Tanjung Sepat",
    "Kuang",
    "Kuala Kubu Baharu",
    "Batang Berjuntai",
    "Bandar Baru Salak Tinggi",
    "Sekinchan",
    "Sabak",
    "Tanjung Karang",
    "Beranang",
    "Sungai Pelek",
    "Sepang",
    "Telok Panglima Garang",
    "Puchong",
    "Bangi",
  ],
  Terengganu: [
    "Kuala Terengganu",
    "Chukai",
    "Dungun",
    "Kerteh",
    "Kuala Berang",
    "Marang",
    "Paka",
    "Jerteh",
  ],
  "Wilayah Persekutuan": ["Kuala Lumpur", "Labuan", "Putrajaya"],
};