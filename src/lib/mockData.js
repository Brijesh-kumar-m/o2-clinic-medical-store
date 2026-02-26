
export const mockProducts = [
  {
    id: '1',
    name: "Paracetamol 500mg",
    generic_name: "Paracetamol",
    brand: "Dolo 650",
    manufacturer: { name: "Micro Labs Ltd", logo: "" },
    category: "Analgesic",
    sub_category: "Fever & Pain",
    composition: "Paracetamol IP 650mg",
    dosage_form: "Tablet",
    pack_sizes: [
      { size: "15 Tabs", price: 30.00, mrp: 35.00, discount: 14 }
    ],
    stock: 5000,
    prescription_required: false,
    description: "Effective for fever and mild to moderate pain relief.",
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"],
    featured: true
  },
  {
    id: '2',
    name: "Amoxycillin 500mg",
    generic_name: "Amoxycillin",
    brand: "Mox 500",
    manufacturer: { name: "Sun Pharma", logo: "" },
    category: "Antibiotic",
    sub_category: "Penicillin",
    composition: "Amoxycillin Trihydrate IP 500mg",
    dosage_form: "Capsule",
    pack_sizes: [
      { size: "10 Caps", price: 65.00, mrp: 85.00, discount: 23 }
    ],
    stock: 2000,
    prescription_required: true,
    description: "Broad-spectrum antibiotic used to treat bacterial infections.",
    images: ["https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400"],
    featured: true
  },
  {
    id: '3',
    name: "Azithromycin 500mg",
    generic_name: "Azithromycin",
    brand: "Azithral 500",
    manufacturer: { name: "Alembic", logo: "" },
    category: "Antibiotic",
    sub_category: "Macrolide",
    composition: "Azithromycin IP 500mg",
    dosage_form: "Tablet",
    pack_sizes: [
      { size: "5 Tabs", price: 105.00, mrp: 130.00, discount: 19 }
    ],
    stock: 1500,
    prescription_required: true,
    description: "Used for various bacterial infections including respiratory infections.",
    images: ["https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400"],
    featured: true
  },
  {
    id: '4',
    name: "Cetirizine 10mg",
    generic_name: "Cetirizine",
    brand: "Cetzine",
    manufacturer: { name: "Dr. Reddy's", logo: "" },
    category: "Antihistamine",
    sub_category: "Allergy",
    composition: "Cetirizine Hydrochloride IP 10mg",
    dosage_form: "Tablet",
    pack_sizes: [
      { size: "10 Tabs", price: 18.00, mrp: 22.00, discount: 18 }
    ],
    stock: 8000,
    prescription_required: false,
    description: "Relief from allergy symptoms like runny nose, sneezing, and itching.",
    images: ["https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=400"],
    featured: false
  },
  {
    id: '5',
    name: "Pantoprazole 40mg",
    generic_name: "Pantoprazole",
    brand: "Pan 40",
    manufacturer: { name: "Alkem", logo: "" },
    category: "Gastrointestinal",
    sub_category: "Acid Reflux",
    composition: "Pantoprazole Sodium IP 40mg",
    dosage_form: "Tablet",
    pack_sizes: [
      { size: "15 Tabs", price: 140.00, mrp: 165.00, discount: 15 }
    ],
    stock: 3000,
    prescription_required: true,
    description: "Reduces stomach acid, used for GERD and ulcers.",
    images: ["https://images.unsplash.com/photo-1550572017-4fcdbb560207?auto=format&fit=crop&q=80&w=400"],
    featured: true
  },
  {
    id: '6',
    name: "Metformin 500mg",
    generic_name: "Metformin",
    brand: "Glycomet 500",
    manufacturer: { name: "USV Ltd", logo: "" },
    category: "Antidiabetic",
    sub_category: "Type 2 Diabetes",
    composition: "Metformin Hydrochloride IP 500mg",
    dosage_form: "Tablet",
    pack_sizes: [
      { size: "20 Tabs", price: 45.00, mrp: 55.00, discount: 18 }
    ],
    stock: 4000,
    prescription_required: true,
    description: "First-line medication for the treatment of type 2 diabetes.",
    images: ["https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400"],
    featured: false
  },
  {
    id: '7',
    name: "Atorvastatin 10mg",
    generic_name: "Atorvastatin",
    brand: "Atorva 10",
    manufacturer: { name: "Zydus Cadila", logo: "" },
    category: "Cardiovascular",
    sub_category: "Cholesterol",
    composition: "Atorvastatin Calcium IP 10mg",
    dosage_form: "Tablet",
    pack_sizes: [
      { size: "15 Tabs", price: 90.00, mrp: 110.00, discount: 18 }
    ],
    stock: 2500,
    prescription_required: true,
    description: "Lowers bad cholesterol and fats (triglycerides) in the blood.",
    images: ["https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400"],
    featured: false
  },
  {
    id: '8',
    name: "Vitamin C 500mg",
    generic_name: "Ascorbic Acid",
    brand: "Limcee",
    manufacturer: { name: "Abbott", logo: "" },
    category: "Supplement",
    sub_category: "Vitamins",
    composition: "Ascorbic Acid IP 500mg",
    dosage_form: "Chewable Tablet",
    pack_sizes: [
      { size: "15 Tabs", price: 25.00, mrp: 30.00, discount: 16 }
    ],
    stock: 6000,
    prescription_required: false,
    description: "Vitamin C supplement for immune support.",
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"],
    featured: true
  },
  {
    id: '9',
    name: "Ibuprofen 400mg",
    generic_name: "Ibuprofen",
    brand: "Brufen 400",
    manufacturer: { name: "Abbott", logo: "" },
    category: "Analgesic",
    sub_category: "NSAID",
    composition: "Ibuprofen IP 400mg",
    dosage_form: "Tablet",
    pack_sizes: [
      { size: "15 Tabs", price: 35.00, mrp: 45.00, discount: 22 }
    ],
    stock: 3500,
    prescription_required: false,
    description: "Pain reliever and anti-inflammatory medication.",
    images: ["https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400"],
    featured: false
  },
  {
    id: '10',
    name: "Telmisartan 40mg",
    generic_name: "Telmisartan",
    brand: "Telma 40",
    manufacturer: { name: "Glenmark", logo: "" },
    category: "Cardiovascular",
    sub_category: "Hypertension",
    composition: "Telmisartan IP 40mg",
    dosage_form: "Tablet",
    pack_sizes: [
      { size: "15 Tabs", price: 110.00, mrp: 140.00, discount: 21 }
    ],
    stock: 2200,
    prescription_required: true,
    description: "Used to treat high blood pressure (hypertension).",
    images: ["https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400"],
    featured: true
  },
  {
    id: '11',
    name: "Montelukast 10mg",
    generic_name: "Montelukast",
    brand: "Montek LC",
    manufacturer: { name: "Sun Pharma", logo: "" },
    category: "Respiratory",
    sub_category: "Asthma/Allergy",
    composition: "Montelukast Sodium IP 10mg + Levocetirizine 5mg",
    dosage_form: "Tablet",
    pack_sizes: [
      { size: "10 Tabs", price: 160.00, mrp: 190.00, discount: 15 }
    ],
    stock: 1800,
    prescription_required: true,
    description: "Used to prevent asthma attacks and treat allergy symptoms.",
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"],
    featured: true
  },
  {
    id: '12',
    name: "Calcium + Vitamin D3",
    generic_name: "Calcium Carbonate + Vitamin D3",
    brand: "Shelcal 500",
    manufacturer: { name: "Torrent Pharma", logo: "" },
    category: "Supplement",
    sub_category: "Calcium",
    composition: "Elemental Calcium 500mg + Vitamin D3 250 IU",
    dosage_form: "Tablet",
    pack_sizes: [
      { size: "15 Tabs", price: 115.00, mrp: 135.00, discount: 14 }
    ],
    stock: 4500,
    prescription_required: false,
    description: "Calcium supplement for bone health.",
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"],
    featured: true
  },
  {
    id: '13',
    name: "Thyroxine 100mcg",
    generic_name: "Thyroxine Sodium",
    brand: "Thyronorm 100",
    manufacturer: { name: "Abbott", logo: "" },
    category: "Hormonal",
    sub_category: "Thyroid",
    composition: "Thyroxine Sodium IP 100mcg",
    dosage_form: "Tablet",
    pack_sizes: [
      { size: "120 Tabs (Bottle)", price: 180.00, mrp: 220.00, discount: 18 }
    ],
    stock: 1200,
    prescription_required: true,
    description: "Used to treat hypothyroidism (low thyroid hormone).",
    images: ["https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400"],
    featured: false
  },
  {
    id: '14',
    name: "Domperidone 10mg",
    generic_name: "Domperidone",
    brand: "Domstal",
    manufacturer: { name: "Torrent Pharma", logo: "" },
    category: "Gastrointestinal",
    sub_category: "Antiemetic",
    composition: "Domperidone IP 10mg",
    dosage_form: "Tablet",
    pack_sizes: [
      { size: "10 Tabs", price: 35.00, mrp: 42.00, discount: 16 }
    ],
    stock: 3000,
    prescription_required: true,
    description: "Used to relieve nausea and vomiting.",
    images: ["https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400"],
    featured: false
  },
  {
    id: '15',
    name: "Pregabalin 75mg",
    generic_name: "Pregabalin",
    brand: "Lyrica 75",
    manufacturer: { name: "Pfizer", logo: "" },
    category: "Neurology",
    sub_category: "Neuropathic Pain",
    composition: "Pregabalin IP 75mg",
    dosage_form: "Capsule",
    pack_sizes: [
      { size: "14 Caps", price: 210.00, mrp: 260.00, discount: 19 }
    ],
    stock: 800,
    prescription_required: true,
    description: "Used to treat nerve pain and seizures.",
    images: ["https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400"],
    featured: true
  }
];

export const mockStats = {
  products: '15+',
  doctors: '100+',
  delivery: '24hr'
};
