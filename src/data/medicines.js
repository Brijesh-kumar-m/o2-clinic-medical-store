export const medicines = [
  {
    id: "med_001",
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    brand: "Calpol",
    manufacturer: { name: "GSK Pharmaceuticals", logo: "/logos/gsk.png" },
    category: "Pain Relief",
    subCategory: "Analgesic & Antipyretic",
    composition: "Paracetamol 500mg",
    dosageForm: "Tablet",
    packSizes: [
      { size: "10 tablets", price: 45, mrp: 60, discount: 25 },
      { size: "15 tablets", price: 65, mrp: 85, discount: 24 },
      { size: "100 tablets", price: 380, mrp: 550, discount: 31 }
    ],
    prescriptionRequired: false,
    schedule: "OTC",
    stock: 500,
    expiryDate: "2026-12-31",
    rating: 4.8,
    reviewCount: 1240,
    featured: true,
    description: "Effective relief from fever and mild to moderate pain.",
    indications: ["Fever", "Headache", "Muscle pain"],
    sideEffects: ["Nausea", "Digestive upset"],
    storage: "Store in a cool dry place below 30°C"
  },
  {
    id: "med_002",
    name: "Amoxicillin 500mg",
    genericName: "Amoxicillin",
    brand: "Mox-500",
    manufacturer: { name: "Sun Pharma", logo: "/logos/sunpharma.png" },
    category: "Antibiotics",
    subCategory: "Penicillins",
    composition: "Amoxicillin 500mg",
    dosageForm: "Capsule",
    packSizes: [
      { size: "10 capsules", price: 120, mrp: 160, discount: 25 },
      { size: "30 capsules", price: 320, mrp: 450, discount: 29 }
    ],
    prescriptionRequired: true,
    schedule: "H",
    stock: 250,
    expiryDate: "2025-06-30",
    rating: 4.5,
    reviewCount: 850,
    featured: true,
    description: "Antibiotic used to treat various bacterial infections.",
    indications: ["Throat infections", "Pneumonia", "Ear infections"]
  },
  {
    id: "med_003",
    name: "Amlodipine 5mg",
    genericName: "Amlodipine",
    brand: "Amlokind",
    manufacturer: { name: "Mankind Pharma", logo: "/logos/mankind.png" },
    category: "Cardiovascular",
    subCategory: "Calcium Channel Blockers",
    composition: "Amlodipine Besylate 5mg",
    dosageForm: "Tablet",
    packSizes: [
      { size: "15 tablets", price: 85, mrp: 120, discount: 29 }
    ],
    prescriptionRequired: true,
    schedule: "H",
    stock: 1200,
    expiryDate: "2027-01-15",
    rating: 4.6,
    reviewCount: 420,
    featured: true,
    description: "Used to treat high blood pressure and chest pain (angina)."
  },
  {
    id: "med_004",
    name: "Metformin 500mg",
    genericName: "Metformin",
    brand: "Glycomet",
    manufacturer: { name: "USV Private Limited", logo: "/logos/usv.png" },
    category: "Diabetes",
    subCategory: "Biguanides",
    composition: "Metformin Hydrochloride 500mg",
    dosageForm: "Tablet",
    packSizes: [
      { size: "20 tablets", price: 55, mrp: 75, discount: 26 },
      { size: "50 tablets", price: 125, mrp: 175, discount: 28 }
    ],
    prescriptionRequired: true,
    schedule: "H",
    stock: 2000,
    expiryDate: "2026-10-20",
    rating: 4.7,
    reviewCount: 1540,
    featured: true,
    description: "Anti-diabetic medication used to treat type 2 diabetes."
  },
  {
    id: "med_005",
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    brand: "Omez",
    manufacturer: { name: "Dr. Reddy's Laboratories", logo: "/logos/drreddys.png" },
    category: "Gastric",
    subCategory: "Proton Pump Inhibitors",
    composition: "Omeprazole 20mg",
    dosageForm: "Capsule",
    packSizes: [
      { size: "15 capsules", price: 95, mrp: 140, discount: 32 }
    ],
    prescriptionRequired: false,
    schedule: "OTC",
    stock: 800,
    expiryDate: "2026-03-12",
    rating: 4.8,
    reviewCount: 2310,
    featured: true,
    description: "Reduces the amount of acid produced in your stomach."
  },
  {
    id: "med_006",
    name: "Azithromycin 500mg",
    genericName: "Azithromycin",
    brand: "Azithral",
    manufacturer: { name: "Alembic Pharmaceuticals", logo: "/logos/alembic.png" },
    category: "Antibiotics",
    subCategory: "Macrolides",
    composition: "Azithromycin 500mg",
    dosageForm: "Tablet",
    packSizes: [
      { size: "3 tablets", price: 65, mrp: 85, discount: 24 },
      { size: "5 tablets", price: 105, mrp: 140, discount: 25 }
    ],
    prescriptionRequired: true,
    schedule: "H",
    stock: 450,
    expiryDate: "2025-11-30",
    rating: 4.4,
    featured: true,
    description: "Used to treat many different types of infections caused by bacteria."
  },
  {
    id: "med_007",
    name: "Montelukast 10mg",
    genericName: "Montelukast",
    brand: "Montair",
    manufacturer: { name: "Cipla", logo: "/logos/cipla.png" },
    category: "Respiratory",
    subCategory: "Leukotriene Receptor Antagonists",
    composition: "Montelukast Sodium 10mg",
    dosageForm: "Tablet",
    packSizes: [
      { size: "15 tablets", price: 175, mrp: 240, discount: 27 }
    ],
    prescriptionRequired: true,
    schedule: "H",
    stock: 600,
    expiryDate: "2026-08-15",
    rating: 4.7,
    featured: true,
    description: "Used to prevent asthma symptoms and treat allergic rhinitis."
  },
  {
    id: "med_008",
    name: "Cetirizine 10mg",
    genericName: "Cetirizine",
    brand: "Okacet",
    manufacturer: { name: "Cipla", logo: "/logos/cipla.png" },
    category: "Respiratory",
    subCategory: "Antihistamines",
    composition: "Cetirizine Hydrochloride 10mg",
    dosageForm: "Tablet",
    packSizes: [
      { size: "10 tablets", price: 18, mrp: 25, discount: 28 }
    ],
    prescriptionRequired: false,
    schedule: "OTC",
    stock: 3000,
    expiryDate: "2027-04-20",
    rating: 4.9,
    featured: true,
    description: "Relieves allergy symptoms like watery eyes, runny nose, and sneezing."
  },
  {
    id: "med_009",
    name: "Atorvastatin 10mg",
    genericName: "Atorvastatin",
    brand: "Lipvas",
    manufacturer: { name: "Cipla", logo: "/logos/cipla.png" },
    category: "Cardiovascular",
    subCategory: "Statins",
    composition: "Atorvastatin 10mg",
    dosageForm: "Tablet",
    packSizes: [
      { size: "15 tablets", price: 210, mrp: 300, discount: 30 }
    ],
    prescriptionRequired: true,
    schedule: "H",
    stock: 1500,
    expiryDate: "2026-12-10",
    rating: 4.5,
    featured: true,
    description: "Used to lower cholesterol and reduce the risk of heart attack or stroke."
  },
  {
    id: "med_010",
    name: "Pantoprazole 40mg",
    genericName: "Pantoprazole",
    brand: "Pan 40",
    manufacturer: { name: "Alkem Laboratories", logo: "/logos/alkem.png" },
    category: "Gastric",
    subCategory: "Proton Pump Inhibitors",
    composition: "Pantoprazole 40mg",
    dosageForm: "Tablet",
    packSizes: [
      { size: "15 tablets", price: 135, mrp: 195, discount: 30 }
    ],
    prescriptionRequired: false,
    schedule: "OTC",
    stock: 1000,
    expiryDate: "2026-06-25",
    rating: 4.8,
    featured: true,
    description: "Treats certain stomach and esophagus problems (such as acid reflux)."
  }
];

// Replicating more medicines to reach 50+
const categories = ["Neurology", "Ophthalmology", "Dermatology", "Vitamins & Supplements", "Pediatric", "Gynecology"];
const manufacturers = ["Sun Pharma", "Lupin", "Zydus Cadila", "Glenmark", "Torrent Pharma", "Cipla"];

for (let i = 11; i <= 60; i++) {
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const mfr = manufacturers[Math.floor(Math.random() * manufacturers.length)];
  medicines.push({
    id: `med_${String(i).padStart(3, '0')}`,
    name: `Medicine ${i}`,
    genericName: `Generic Name ${i}`,
    brand: `Brand ${i}`,
    manufacturer: { name: mfr, logo: `/logos/${mfr.replace(' ', '').toLowerCase()}.png` },
    category: cat,
    subCategory: `SubCategory ${cat}`,
    composition: `Active Ingredient ${i} mg`,
    dosageForm: i % 3 === 0 ? "Capsule" : (i % 3 === 1 ? "Tablet" : "Syrup"),
    packSizes: [
      { size: "10 units", price: 50 + (i * 2), mrp: 70 + (i * 2), discount: 28 }
    ],
    prescriptionRequired: i % 2 === 0,
    schedule: i % 2 === 0 ? "H" : "OTC",
    stock: 100 + (i * 10),
    expiryDate: `202${6 + (i % 3)}-${String((i % 12) + 1).padStart(2, '0')}-28`,
    rating: 4.0 + (Math.random() * 1.0),
    reviewCount: 50 + (i * 5),
    description: `Detailed description for medicine ${i}. This is a quality pharmaceutical product.`,
    indications: [`Condition ${i}A`, `Condition ${i}B`]
  });
}
