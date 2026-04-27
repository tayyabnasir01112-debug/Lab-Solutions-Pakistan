import {
  Beaker,
  Microscope,
  Dna,
  HeartPulse,
  TestTube,
  FlaskConical,
  Cpu,
  ShieldCheck,
} from "lucide-react";

export type Brand = {
  id: string;
  name: string;
  short: string;
  blurb: string;
  accent: string;
};

export type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  featured?: boolean;
  tags?: string[];
};

export const brands: Brand[] = [
  { id: "merck", name: "Merck Sigma-Aldrich", short: "Merck", blurb: "Reagents, antibodies, and research chemicals — life-science gold standard.", accent: "#003366" },
  { id: "thermo", name: "Thermo Fisher / One Lambda", short: "Thermo Fisher", blurb: "Transplant diagnostics, PCR systems, and lab automation.", accent: "#D71920" },
  { id: "luminex", name: "Luminex Corp", short: "Luminex", blurb: "xMAP® multiplex assay technology for high-throughput labs.", accent: "#2EA3F2" },
  { id: "diasorin", name: "DiaSorin", short: "DiaSorin", blurb: "Immunoassays and molecular diagnostics powered by LIAISON® systems.", accent: "#0F4C81" },
  { id: "cytek", name: "CytekBio", short: "Cytek", blurb: "Full-spectrum flow cytometry redefining cellular analysis.", accent: "#5E2A84" },
  { id: "ngene", name: "NgeneBio", short: "NgeneBio", blurb: "NGS-based precision oncology diagnostics.", accent: "#00A19A" },
  { id: "hkm", name: "HKM Bio", short: "HKM", blurb: "Reliable laboratory equipment — centrifuges, incubators, and safety cabinets.", accent: "#7A8B99" },
  { id: "biolegend", name: "BioLegend", short: "BioLegend", blurb: "World-class antibodies and reagents for flow cytometry and ELISA.", accent: "#E94B3C" },
];

export const categories: Category[] = [
  { id: "multiplex", name: "Multiplex Analyzers", icon: <Cpu className="h-4 w-4" /> },
  { id: "flow", name: "Flow Cytometers", icon: <Microscope className="h-4 w-4" /> },
  { id: "transplant", name: "Transplant Diagnostics", icon: <HeartPulse className="h-4 w-4" /> },
  { id: "molecular", name: "Molecular Diagnostics", icon: <Dna className="h-4 w-4" /> },
  { id: "immuno", name: "Immunoassays", icon: <ShieldCheck className="h-4 w-4" /> },
  { id: "ngs", name: "NGS / Sequencing", icon: <FlaskConical className="h-4 w-4" /> },
  { id: "antibodies", name: "Antibodies & Reagents", icon: <TestTube className="h-4 w-4" /> },
  { id: "equipment", name: "Lab Equipment & Consumables", icon: <Beaker className="h-4 w-4" /> },
];

export const products: Product[] = [
  // Luminex
  { id: "luminex-labscan3d", name: "LABScan3D™ Multiplex Analyzer", brand: "luminex", category: "multiplex", description: "500-region multiplex analyzer optimized for HLA antibody detection and transplant diagnostics.", featured: true, tags: ["xmap", "transplant", "hla"] },
  { id: "luminex-magpix", name: "MAGPIX® System", brand: "luminex", category: "multiplex", description: "Compact magnetic-bead multiplex platform delivering up to 50-plex per well.", featured: true, tags: ["xmap", "compact"] },
  { id: "luminex-flexmap3d", name: "FLEXMAP 3D® System", brand: "luminex", category: "multiplex", description: "High-throughput xMAP analyzer with 500-plex capability for biomarker discovery.", tags: ["xmap", "research"] },
  { id: "luminex-intelliflex", name: "xMAP INTELLIFLEX™", brand: "luminex", category: "multiplex", description: "Next-generation flow-based multiplexer with dual reporter channels.", tags: ["xmap"] },
  { id: "luminex-magplex", name: "xMAP® MagPlex® Microspheres", brand: "luminex", category: "equipment", description: "Magnetic carboxylated microspheres — the foundation of xMAP multiplexing.", tags: ["beads", "consumable"] },

  // Thermo Fisher / One Lambda
  { id: "thermo-labscreen-sa", name: "LABScreen™ Single Antigen", brand: "thermo", category: "transplant", description: "Solid-phase single-antigen bead assay for high-resolution HLA antibody identification.", featured: true, tags: ["hla", "transplant"] },
  { id: "thermo-alltype-ngs", name: "AllType™ NGS HLA Typing", brand: "thermo", category: "ngs", description: "Long-amplicon NGS-based HLA typing across 11 loci in a single workflow.", tags: ["hla", "ngs"] },
  { id: "thermo-microssp", name: "Micro SSP™ HLA DNA Typing", brand: "thermo", category: "transplant", description: "Sequence-specific primer kits for rapid low-resolution HLA typing." },
  { id: "thermo-suretyper", name: "SureTyper™ SBT Kits", brand: "thermo", category: "transplant", description: "Sequence-based HLA typing for high-resolution allele-level resolution." },
  { id: "thermo-quantstudio5", name: "Applied Biosystems QuantStudio 5", brand: "thermo", category: "molecular", description: "Real-time PCR system supporting up to 384-well plates with TaqMan chemistry.", featured: true },
  { id: "thermo-nanodrop", name: "NanoDrop™ One Spectrophotometer", brand: "thermo", category: "equipment", description: "Microvolume UV-Vis spectrophotometer for nucleic-acid and protein quantification." },
  { id: "thermo-trizol", name: "Invitrogen™ TRIzol™ Reagent", brand: "thermo", category: "antibodies", description: "Ready-to-use total RNA isolation reagent for cells and tissues." },

  // Merck
  { id: "merck-cd3", name: "Anti-CD3 Monoclonal Antibody", brand: "merck", category: "antibodies", description: "Mouse monoclonal targeting human CD3 — validated for FC, IHC, and WB." },
  { id: "merck-trizma", name: "Trizma® Base Buffer", brand: "merck", category: "antibodies", description: "Ultra-pure tris(hydroxymethyl)aminomethane for buffer preparation." },
  { id: "merck-millex", name: "Millex® Syringe Filter Units", brand: "merck", category: "equipment", description: "Sterile single-use filters for sample prep and sterilization." },
  { id: "merck-stericup", name: "Stericup® Filter Units", brand: "merck", category: "equipment", description: "Vacuum-driven 0.22 µm bottle-top filters for tissue culture media." },
  { id: "merck-phalloidin", name: "Phalloidin–FITC Stain", brand: "merck", category: "antibodies", description: "Fluorescent F-actin probe for cytoskeletal imaging." },
  { id: "merck-sybr", name: "SYBR® Green qPCR Master Mix", brand: "merck", category: "molecular", description: "Optimized 2× master mix for high-sensitivity real-time PCR.", featured: true },
  { id: "merck-kpl-wb", name: "KPL Western Blot Detection Kit", brand: "merck", category: "antibodies", description: "Chemiluminescent HRP substrate for highly sensitive Western blots." },

  // DiaSorin
  { id: "diasorin-liaison-xl", name: "LIAISON® XL Immunoassay Analyzer", brand: "diasorin", category: "immuno", description: "Fully automated chemiluminescent platform with up to 180 tests/hour.", featured: true },
  { id: "diasorin-liaison-mdx", name: "LIAISON® MDX Molecular System", brand: "diasorin", category: "molecular", description: "Real-time PCR analyzer for syndromic infectious-disease testing." },
  { id: "diasorin-sars", name: "LIAISON® SARS-CoV-2 IgG Assay", brand: "diasorin", category: "immuno", description: "CLIA assay for qualitative IgG detection against SARS-CoV-2." },
  { id: "diasorin-vitd", name: "LIAISON® Vitamin D Total Assay", brand: "diasorin", category: "immuno", description: "Fully automated 25-OH vitamin D quantification — clinical reference standard." },
  { id: "diasorin-simplexa", name: "Simplexa™ Direct PCR Kits", brand: "diasorin", category: "molecular", description: "Sample-to-answer real-time PCR kits — no nucleic-acid extraction required." },

  // Cytek
  { id: "cytek-aurora", name: "Cytek® Aurora Flow Cytometer", brand: "cytek", category: "flow", description: "Up to 5-laser, 64-color full-spectrum flow cytometer for complex panels.", featured: true },
  { id: "cytek-northernlights", name: "Cytek® Northern Lights™", brand: "cytek", category: "flow", description: "Compact spectral flow cytometer purpose-built for clinical research." },
  { id: "cytek-aurora-cs", name: "Aurora CS Cell Sorter", brand: "cytek", category: "flow", description: "Full-spectrum sorting platform with up to 6-way bulk separation." },
  { id: "cytek-cfluor", name: "cFluor® Reagent Panels", brand: "cytek", category: "antibodies", description: "Optimized antibody-fluorochrome conjugates for spectral cytometry." },
  { id: "cytek-spectroflo", name: "SpectroFlo® Software", brand: "cytek", category: "equipment", description: "Acquisition and unmixing software for full-spectrum cytometry." },

  // NgeneBio
  { id: "ngene-onco", name: "ONCOaccuPanel™ Pan-Cancer NGS", brand: "ngene", category: "ngs", description: "323-gene targeted panel covering all major solid-tumor biomarkers.", featured: true },
  { id: "ngene-brca", name: "BRCAaccuTest™", brand: "ngene", category: "ngs", description: "BRCA1/2 NGS panel for hereditary breast and ovarian cancer screening." },
  { id: "ngene-heme", name: "HEMEaccuTest™", brand: "ngene", category: "ngs", description: "Comprehensive panel for hematological malignancies and MRD monitoring." },
  { id: "ngene-analysis", name: "NGeneAnalySys® Software", brand: "ngene", category: "equipment", description: "Cloud-based bioinformatics pipeline for somatic and germline variant calling." },

  // HKM
  { id: "hkm-centrifuge", name: "HKM High-Speed Refrigerated Centrifuge", brand: "hkm", category: "equipment", description: "Up to 22,000 rpm with smart-touch interface and rotor auto-recognition." },
  { id: "hkm-co2", name: "HKM CO₂ Incubator", brand: "hkm", category: "equipment", description: "Direct-heat 170 L incubator with HEPA-filtered chamber." },
  { id: "hkm-bsc", name: "HKM Class II Biosafety Cabinet", brand: "hkm", category: "equipment", description: "Type A2 cabinet with EN-12469 certification for BSL-2 handling." },
  { id: "hkm-pcr", name: "HKM PCR Workstation", brand: "hkm", category: "equipment", description: "UV-decontamination cabinet engineered for amplification workflows." },
  { id: "hkm-vortex", name: "HKM Digital Vortex Mixer", brand: "hkm", category: "equipment", description: "Touch-mode vortex with adjustable speeds up to 3,000 rpm." },
  { id: "hkm-dryblock", name: "HKM Dry Block Heater", brand: "hkm", category: "equipment", description: "Programmable dual-block thermal incubator with ±0.1 °C precision." },

  // BioLegend
  { id: "bl-cd4-pe", name: "PE Anti-Human CD4 (Clone OKT4)", brand: "biolegend", category: "antibodies", description: "Phycoerythrin-conjugated antibody validated for flow cytometry.", featured: true },
  { id: "bl-cd8a-apc", name: "APC Anti-Mouse CD8a (53-6.7)", brand: "biolegend", category: "antibodies", description: "APC-conjugated mouse-CD8a antibody for cytotoxic T-cell phenotyping." },
  { id: "bl-elisa-max", name: "ELISA MAX™ Standard Set", brand: "biolegend", category: "immuno", description: "Pre-titered antibody pairs for ELISA development across hundreds of analytes." },
  { id: "bl-bv421", name: "Brilliant Violet 421™ Antibodies", brand: "biolegend", category: "antibodies", description: "Bright UV-excitable conjugates for high-parameter cytometry." },
  { id: "bl-il6", name: "LEGEND MAX™ Human IL-6 ELISA", brand: "biolegend", category: "immuno", description: "Pre-coated, ready-to-use ELISA kit for IL-6 quantification." },
  { id: "bl-zombie", name: "Zombie UV™ Fixable Viability Kit", brand: "biolegend", category: "antibodies", description: "Amine-reactive viability dye compatible with fix/perm workflows." },
];

export function brandById(id: string) {
  return brands.find((b) => b.id === id)!;
}
export function categoryById(id: string) {
  return categories.find((c) => c.id === id)!;
}
export function productsByBrand(id: string) {
  return products.filter((p) => p.brand === id);
}
export function productsByCategory(id: string) {
  return products.filter((p) => p.category === id);
}
export function featuredProducts() {
  return products.filter((p) => p.featured);
}
