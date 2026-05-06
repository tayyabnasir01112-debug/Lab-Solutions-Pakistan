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
  // Detail page fields
  highlights?: string[];
  features?: string[];
  applications?: string[];
  specs?: Record<string, string>;
  catalogueNumber?: string;
  relatedProducts?: string[];
};

export const brands: Brand[] = [
  { id: "onelambda", name: "One Lambda (Thermo Fisher Scientific)", short: "One Lambda", blurb: "The global leader in transplant diagnostics — HLA typing, antibody detection, and crossmatch solutions trusted by transplant centres worldwide.", accent: "#D71920" },
  { id: "merck", name: "Merck Sigma-Aldrich", short: "Merck", blurb: "Reagents, antibodies, and research chemicals — life-science gold standard.", accent: "#003366" },
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

  // ── ONE LAMBDA ──────────────────────────────────────────────────────────────

  {
    id: "ol-labscan3d",
    name: "LABScan3D™ Multiplex Analyzer",
    brand: "onelambda",
    category: "multiplex",
    description: "The LABScan3D™ is One Lambda's flagship multiplex flow analyser, purpose-built for transplant diagnostics. It reads Luminex xMAP® beads and delivers high-resolution HLA antibody identification with unmatched precision.",
    featured: true,
    tags: ["analyzer", "hla", "transplant", "luminex"],
    highlights: [
      "500-plex xMAP® bead technology",
      "Purpose-built for transplant HLA diagnostics",
      "Integrated with HLA Fusion™ software",
      "High-throughput — up to 96 wells per run",
    ],
    features: [
      "Three-laser optical system with 10 fluorescent channels",
      "500 distinct bead regions for maximum multiplexing",
      "Compatible with all LABScreen™ and LABType™ kits",
      "Automated data acquisition via LABScan3D™ Manager software",
      "Built-in barcode reader for sample tracking",
      "FDA 510(k) cleared for in vitro diagnostic use",
    ],
    applications: [
      "Pre-transplant HLA antibody screening",
      "Post-transplant monitoring for donor-specific antibodies (DSA)",
      "Virtual crossmatch",
      "Solid-phase immunoassay (SPI) testing",
      "HLA antibody identification — Class I & Class II",
    ],
    specs: {
      "Bead Regions": "500 distinct regions",
      "Lasers": "3 (Red 633nm, Green 532nm, Violet 405nm)",
      "Fluorescent Channels": "10",
      "Sample Throughput": "Up to 96 samples per run",
      "Read Volume": "50–100 µL per well",
      "Plate Format": "Standard 96-well microplate",
      "Software": "LABScan3D™ Manager",
      "Regulatory Status": "FDA 510(k) cleared, CE marked",
      "Dimensions": "38 × 58 × 56 cm",
      "Weight": "32 kg",
    },
    catalogueNumber: "LABScan3D",
    relatedProducts: ["ol-labscreen-sa1", "ol-labscreen-sa2", "ol-fusion"],
  },

  {
    id: "ol-labscreen-sa1",
    name: "LABScreen™ Single Antigen HLA Class I",
    brand: "onelambda",
    category: "transplant",
    description: "The LABScreen™ Single Antigen Class I kit provides high-resolution identification of HLA Class I antibodies (A, B, C loci) in patient serum using Luminex xMAP® bead technology. Each bead is coated with a single purified HLA antigen, enabling precise antibody specificity determination.",
    featured: true,
    tags: ["hla", "transplant", "antibody", "class-i"],
    highlights: [
      "Single-antigen resolution for HLA Class I (A, B, C)",
      "Detects and identifies HLA-specific antibodies with high accuracy",
      "Comprehensive antigen coverage — over 90 HLA-A, B, C specificities",
      "Compatible with LABScan3D™ and FLEXMAP 3D® analyzers",
    ],
    features: [
      "Each bead coated with a single purified recombinant HLA antigen",
      "Covers HLA-A, B, and C loci",
      "Fluorescent secondary antibody detection (PE-conjugated anti-human IgG)",
      "Ready-to-use kit format with all reagents included",
      "Interpretable with HLA Fusion™ software",
      "High inter-assay reproducibility",
    ],
    applications: [
      "Pre-transplant HLA antibody identification",
      "Determination of unacceptable antigens for transplant listing",
      "Virtual crossmatch — Class I",
      "Post-transplant DSA monitoring",
      "PRA (Panel Reactive Antibody) determination",
    ],
    specs: {
      "HLA Loci Covered": "HLA-A, B, C (Class I)",
      "Antigen Specificities": "> 90",
      "Detection Method": "PE-conjugated anti-human IgG",
      "Analyzer Compatibility": "LABScan3D™, FLEXMAP 3D®",
      "Sample Type": "Human serum",
      "Sample Volume": "20 µL per reaction",
      "Kit Format": "96-well microplate",
      "Incubation Time": "30 minutes",
      "Regulatory Status": "FDA cleared, CE marked",
    },
    catalogueNumber: "LS1A04",
    relatedProducts: ["ol-labscreen-sa2", "ol-labscreen-mixed", "ol-labscan3d"],
  },

  {
    id: "ol-labscreen-sa2",
    name: "LABScreen™ Single Antigen HLA Class II",
    brand: "onelambda",
    category: "transplant",
    description: "LABScreen™ Single Antigen Class II provides definitive identification of HLA Class II antibodies (DR, DQ, DP loci) using single-antigen bead technology on the Luminex xMAP® platform. Ideal for pre- and post-transplant monitoring with superior resolution.",
    featured: true,
    tags: ["hla", "transplant", "antibody", "class-ii"],
    highlights: [
      "Single-antigen resolution for HLA Class II (DR, DQ, DP)",
      "Comprehensive DRB1, DRB3/4/5, DQA1, DQB1, DPA1, DPB1 coverage",
      "Detects rare specificities missed by screening assays",
      "Integrates with HLA Fusion™ for automated interpretation",
    ],
    features: [
      "Single purified recombinant HLA Class II antigen per bead",
      "Coverage of DRB1, DRB3, DRB4, DRB5, DQA1, DQB1, DPA1, DPB1",
      "Alpha-beta antigen pairs for DQ and DP loci",
      "Detects antibodies against low-frequency specificities",
      "PE-conjugated anti-human IgG detection",
      "HLA Fusion™ software compatible",
    ],
    applications: [
      "Pre-transplant HLA Class II antibody identification",
      "DQ and DP antibody identification",
      "Virtual crossmatch — Class II",
      "Post-transplant DSA monitoring",
      "High-resolution antibody specificity determination",
    ],
    specs: {
      "HLA Loci Covered": "DRB1, DRB3/4/5, DQA1, DQB1, DPA1, DPB1 (Class II)",
      "Antigen Specificities": "> 100",
      "Detection Method": "PE-conjugated anti-human IgG",
      "Analyzer Compatibility": "LABScan3D™, FLEXMAP 3D®",
      "Sample Type": "Human serum",
      "Sample Volume": "20 µL per reaction",
      "Kit Format": "96-well microplate",
      "Incubation Time": "30 minutes",
      "Regulatory Status": "FDA cleared, CE marked",
    },
    catalogueNumber: "LS2A04",
    relatedProducts: ["ol-labscreen-sa1", "ol-labscreen-mixed", "ol-labscan3d"],
  },

  {
    id: "ol-labscreen-mixed",
    name: "LABScreen™ Mixed",
    brand: "onelambda",
    category: "transplant",
    description: "LABScreen™ Mixed is a screening assay that simultaneously detects HLA Class I and Class II antibodies in a single test. Using a cocktail of beads coated with multiple HLA antigens, it provides a rapid and cost-effective first-line screen before single-antigen testing.",
    featured: false,
    tags: ["hla", "transplant", "screening", "class-i", "class-ii"],
    highlights: [
      "Simultaneous Class I and Class II HLA antibody screening",
      "Single-well, one-hour workflow",
      "Ideal as a cost-effective first-line screening tool",
      "High sensitivity — detects low-titer antibodies",
    ],
    features: [
      "Mixed bead cocktail covering HLA-A, B, C, DR, DQ, DP antigens",
      "Single reaction detects both Class I and Class II simultaneously",
      "Semiquantitative results (MFI values)",
      "Compatible with LABScan3D™ and FLEXMAP 3D®",
      "Guides decisions on whether single antigen testing is needed",
    ],
    applications: [
      "Initial HLA antibody screening for transplant candidates",
      "Pre-transplant sensitisation assessment",
      "Periodic re-screening of wait-listed patients",
      "Post-transfusion sensitisation monitoring",
    ],
    specs: {
      "HLA Loci Covered": "Class I (A, B, C) and Class II (DR, DQ, DP)",
      "Test Format": "Mixed-antigen bead screening",
      "Analyzer Compatibility": "LABScan3D™, FLEXMAP 3D®",
      "Sample Type": "Human serum",
      "Sample Volume": "20 µL per reaction",
      "Total Assay Time": "~60 minutes",
      "Regulatory Status": "FDA cleared, CE marked",
    },
    catalogueNumber: "LSMA04",
    relatedProducts: ["ol-labscreen-sa1", "ol-labscreen-sa2", "ol-labscan3d"],
  },

  {
    id: "ol-labscreen-complement",
    name: "LABScreen™ Complement (C1q & C3d)",
    brand: "onelambda",
    category: "transplant",
    description: "LABScreen™ Complement assays (C1q and C3d) identify complement-binding HLA antibodies — a key risk factor for antibody-mediated rejection (AMR). Distinguishing complement-fixing from non-complement-fixing DSA provides critical clinical stratification for transplant recipients.",
    featured: false,
    tags: ["hla", "transplant", "complement", "amr"],
    highlights: [
      "Identifies complement-fixing HLA antibodies (C1q and C3d)",
      "Predicts risk of antibody-mediated rejection (AMR)",
      "Clinically validated in kidney, heart, and lung transplantation",
      "Used alongside standard IgG single-antigen testing",
    ],
    features: [
      "C1q assay: detects antibodies that bind complement component C1q",
      "C3d assay: detects antibodies that activate the complement cascade to C3d",
      "Single-antigen bead format for HLA Class I and Class II",
      "Compatible with LABScan3D™ and FLEXMAP 3D®",
      "Results in MFI values for direct comparison",
    ],
    applications: [
      "Risk stratification of donor-specific antibodies (DSA)",
      "Pre-transplant donor selection for sensitised patients",
      "Post-transplant AMR diagnosis and monitoring",
      "Clinical research on complement-activating antibodies",
    ],
    specs: {
      "Assay Variants": "C1q-binding, C3d-binding",
      "HLA Coverage": "Class I and Class II (single antigen)",
      "Analyzer Compatibility": "LABScan3D™, FLEXMAP 3D®",
      "Sample Type": "Human serum",
      "Sample Volume": "20 µL per reaction",
      "Regulatory Status": "CE marked (research use in some regions)",
    },
    catalogueNumber: "LSC1Q04 / LSC3D04",
    relatedProducts: ["ol-labscreen-sa1", "ol-labscreen-sa2", "ol-fusion"],
  },

  {
    id: "ol-alltype",
    name: "AllType™ NGS HLA Typing Kit",
    brand: "onelambda",
    category: "ngs",
    description: "AllType™ is One Lambda's next-generation sequencing (NGS) solution for comprehensive HLA typing across 11 loci in a single amplification and sequencing run. It delivers allele-level, high-resolution HLA typing from a single DNA sample.",
    featured: true,
    tags: ["hla", "typing", "ngs", "allele-level"],
    highlights: [
      "11-locus HLA typing in one run (HLA-A, B, C, DRB1/3/4/5, DQA1, DQB1, DPA1, DPB1)",
      "Allele-level, high-resolution typing from a single amplification",
      "Compatible with Illumina® MiSeq and Ion Torrent™",
      "Turnover time under 24 hours",
    ],
    features: [
      "Long-range PCR amplification covering full exonic regions",
      "High-resolution, phased allele assignment",
      "Built-in quality control metrics",
      "Compatible with TypeStream™ Visual NGS Analysis Software",
      "Scalable from 8 to 96 samples per run",
      "HLA Fusion™ software compatible for result review",
    ],
    applications: [
      "Donor and recipient HLA typing for transplantation",
      "Bone marrow and stem cell donor registry typing",
      "High-resolution research typing",
      "Rare allele and novel allele discovery",
    ],
    specs: {
      "HLA Loci": "HLA-A, B, C, DRB1, DRB3, DRB4, DRB5, DQA1, DQB1, DPA1, DPB1",
      "Resolution": "Allele-level (4-field, phased)",
      "Sequencer Compatibility": "Illumina® MiSeq, Ion Torrent™",
      "Samples per Run": "8–96",
      "Turnaround Time": "< 24 hours",
      "Input DNA": "25–50 ng",
      "Software": "TypeStream™ Visual Software",
      "Regulatory Status": "CE marked, RUO",
    },
    catalogueNumber: "OLI8A / OLI96A",
    relatedProducts: ["ol-microssp", "ol-fusion", "ol-labscan3d"],
  },

  {
    id: "ol-microssp",
    name: "Micro SSP™ Generic HLA Class I & II DNA Typing",
    brand: "onelambda",
    category: "transplant",
    description: "Micro SSP™ (Sequence-Specific Primer) typing kits provide rapid, low-to-intermediate resolution HLA typing for Class I and Class II loci. The tray format enables simple PCR-based typing without specialised equipment beyond a standard thermocycler and gel system.",
    featured: false,
    tags: ["hla", "typing", "ssp", "class-i", "class-ii"],
    highlights: [
      "Simple SSP-based HLA typing — no specialist equipment required",
      "Low-to-intermediate resolution for Class I and Class II",
      "Ready-to-use tray format with lyophilised primers",
      "Results available in under 3 hours",
    ],
    features: [
      "Lyophilised SSP primer mixes in ready-to-use tray",
      "Standard PCR thermocycler compatible",
      "Agarose gel electrophoresis readout",
      "UniMatch™ software for automated result interpretation",
      "Stable room-temperature storage",
    ],
    applications: [
      "Transplant donor and recipient HLA typing",
      "Routine laboratory HLA typing",
      "Confirmatory typing following serological screening",
    ],
    specs: {
      "Method": "Sequence-Specific Primer (SSP) PCR",
      "Resolution": "Low to intermediate",
      "HLA Loci": "HLA-A, B, C, DRB1, DQB1 (kit dependent)",
      "Equipment Required": "Standard PCR thermocycler, gel electrophoresis",
      "Result Time": "< 3 hours",
      "Storage": "Room temperature (lyophilised)",
      "Software": "UniMatch™",
    },
    catalogueNumber: "MSSPA004",
    relatedProducts: ["ol-alltype", "ol-labscreen-sa1", "ol-fusion"],
  },

  {
    id: "ol-fusion",
    name: "HLA Fusion™ Software",
    brand: "onelambda",
    category: "transplant",
    description: "HLA Fusion™ is One Lambda's comprehensive laboratory information and analysis software for transplant diagnostics. It integrates data from LABScreen™ antibody assays, LABType™ typing kits, and all LABScan3D™ results into a single, streamlined workflow.",
    featured: false,
    tags: ["software", "hla", "transplant", "lims"],
    highlights: [
      "Centralised analysis for all One Lambda assays",
      "Automated result interpretation and reporting",
      "Virtual crossmatch and compatibility scoring",
      "Bidirectional LIS/HIS interface",
    ],
    features: [
      "Automated MFI analysis and cut-off application for LABScreen™ assays",
      "Side-by-side comparison of Class I and Class II antibody profiles",
      "PIRCHE-II and EPLET analysis integration",
      "Virtual crossmatch module",
      "Patient cumulative history tracking",
      "Customisable report templates",
      "Bidirectional HL7 interface for LIS/HIS connectivity",
      "21 CFR Part 11 compliant audit trail",
    ],
    applications: [
      "Transplant laboratory data management",
      "HLA antibody result interpretation and reporting",
      "Virtual crossmatch for donor-recipient compatibility",
      "Cumulative patient sensitisation tracking",
      "Regulatory-compliant documentation",
    ],
    specs: {
      "Platform": "Windows-based desktop application",
      "Compatibility": "All One Lambda LABScreen™, LABType™, and LABScan3D™",
      "LIS Interface": "HL7 bidirectional",
      "Compliance": "21 CFR Part 11 audit trail",
      "Reporting": "PDF, CSV, HL7 export",
      "Language Support": "Multiple",
    },
    catalogueNumber: "HLA Fusion 4.x",
    relatedProducts: ["ol-labscan3d", "ol-labscreen-sa1", "ol-labscreen-sa2"],
  },

  // ── LUMINEX ──────────────────────────────────────────────────────────────
  { id: "luminex-labscan3d", name: "LABScan3D™ Multiplex Analyzer", brand: "luminex", category: "multiplex", description: "500-region multiplex analyzer optimized for HLA antibody detection and transplant diagnostics.", featured: true, tags: ["xmap", "transplant", "hla"] },
  { id: "luminex-magpix", name: "MAGPIX® System", brand: "luminex", category: "multiplex", description: "Compact magnetic-bead multiplex platform delivering up to 50-plex per well.", featured: true, tags: ["xmap", "compact"] },
  { id: "luminex-flexmap3d", name: "FLEXMAP 3D® System", brand: "luminex", category: "multiplex", description: "High-throughput xMAP analyzer with 500-plex capability for biomarker discovery.", tags: ["xmap", "research"] },
  { id: "luminex-intelliflex", name: "xMAP INTELLIFLEX™", brand: "luminex", category: "multiplex", description: "Next-generation flow-based multiplexer with dual reporter channels.", tags: ["xmap"] },
  { id: "luminex-magplex", name: "xMAP® MagPlex® Microspheres", brand: "luminex", category: "equipment", description: "Magnetic carboxylated microspheres — the foundation of xMAP multiplexing.", tags: ["beads", "consumable"] },

  // ── MERCK ────────────────────────────────────────────────────────────────
  { id: "merck-cd3", name: "Anti-CD3 Monoclonal Antibody", brand: "merck", category: "antibodies", description: "Mouse monoclonal targeting human CD3 — validated for FC, IHC, and WB." },
  { id: "merck-trizma", name: "Trizma® Base Buffer", brand: "merck", category: "antibodies", description: "Ultra-pure tris(hydroxymethyl)aminomethane for buffer preparation." },
  { id: "merck-millex", name: "Millex® Syringe Filter Units", brand: "merck", category: "equipment", description: "Sterile single-use filters for sample prep and sterilization." },
  { id: "merck-stericup", name: "Stericup® Filter Units", brand: "merck", category: "equipment", description: "Vacuum-driven 0.22 µm bottle-top filters for tissue culture media." },
  { id: "merck-phalloidin", name: "Phalloidin–FITC Stain", brand: "merck", category: "antibodies", description: "Fluorescent F-actin probe for cytoskeletal imaging." },
  { id: "merck-sybr", name: "SYBR® Green qPCR Master Mix", brand: "merck", category: "molecular", description: "Optimized 2× master mix for high-sensitivity real-time PCR.", featured: true },
  { id: "merck-kpl-wb", name: "KPL Western Blot Detection Kit", brand: "merck", category: "antibodies", description: "Chemiluminescent HRP substrate for highly sensitive Western blots." },

  // ── DIASORIN ─────────────────────────────────────────────────────────────
  { id: "diasorin-liaison-xl", name: "LIAISON® XL Immunoassay Analyzer", brand: "diasorin", category: "immuno", description: "Fully automated chemiluminescent platform with up to 180 tests/hour.", featured: true },
  { id: "diasorin-liaison-mdx", name: "LIAISON® MDX Molecular System", brand: "diasorin", category: "molecular", description: "Real-time PCR analyzer for syndromic infectious-disease testing." },
  { id: "diasorin-sars", name: "LIAISON® SARS-CoV-2 IgG Assay", brand: "diasorin", category: "immuno", description: "CLIA assay for qualitative IgG detection against SARS-CoV-2." },
  { id: "diasorin-vitd", name: "LIAISON® Vitamin D Total Assay", brand: "diasorin", category: "immuno", description: "Fully automated 25-OH vitamin D quantification — clinical reference standard." },
  { id: "diasorin-simplexa", name: "Simplexa™ Direct PCR Kits", brand: "diasorin", category: "molecular", description: "Sample-to-answer real-time PCR kits — no nucleic-acid extraction required." },

  // ── CYTEK ────────────────────────────────────────────────────────────────
  { id: "cytek-aurora", name: "Cytek® Aurora Flow Cytometer", brand: "cytek", category: "flow", description: "Up to 5-laser, 64-color full-spectrum flow cytometer for complex panels.", featured: true },
  { id: "cytek-northernlights", name: "Cytek® Northern Lights™", brand: "cytek", category: "flow", description: "Compact spectral flow cytometer purpose-built for clinical research." },
  { id: "cytek-aurora-cs", name: "Aurora CS Cell Sorter", brand: "cytek", category: "flow", description: "Full-spectrum sorting platform with up to 6-way bulk separation." },
  { id: "cytek-cfluor", name: "cFluor® Reagent Panels", brand: "cytek", category: "antibodies", description: "Optimized antibody-fluorochrome conjugates for spectral cytometry." },
  { id: "cytek-spectroflo", name: "SpectroFlo® Software", brand: "cytek", category: "equipment", description: "Acquisition and unmixing software for full-spectrum cytometry." },

  // ── NGENEBIO ─────────────────────────────────────────────────────────────
  { id: "ngene-onco", name: "ONCOaccuPanel™ Pan-Cancer NGS", brand: "ngene", category: "ngs", description: "323-gene targeted panel covering all major solid-tumor biomarkers.", featured: true },
  { id: "ngene-brca", name: "BRCAaccuTest™", brand: "ngene", category: "ngs", description: "BRCA1/2 NGS panel for hereditary breast and ovarian cancer screening." },
  { id: "ngene-hrd", name: "HRD Solution™", brand: "ngene", category: "ngs", description: "Homologous recombination deficiency scoring for ovarian and breast cancer." },
  { id: "ngene-cfDNA", name: "cfDNA Pan-Cancer Liquid Biopsy", brand: "ngene", category: "ngs", description: "Cell-free DNA panel for non-invasive tumour mutation monitoring." },

  // ── HKM ──────────────────────────────────────────────────────────────────
  { id: "hkm-centrifuge", name: "HKM High-Speed Refrigerated Centrifuge", brand: "hkm", category: "equipment", description: "Up to 21,000 × g, 12-rotor interchangeable system with ±1 °C temperature control." },
  { id: "hkm-co2", name: "HKM CO₂ Incubator", brand: "hkm", category: "equipment", description: "Direct-heat 170 L incubator with HEPA-filtered chamber." },
  { id: "hkm-bsc", name: "HKM Class II Biosafety Cabinet", brand: "hkm", category: "equipment", description: "Type A2 cabinet with EN-12469 certification for BSL-2 handling." },
  { id: "hkm-pcr", name: "HKM PCR Workstation", brand: "hkm", category: "equipment", description: "UV-decontamination cabinet engineered for amplification workflows." },
  { id: "hkm-vortex", name: "HKM Digital Vortex Mixer", brand: "hkm", category: "equipment", description: "Touch-mode vortex with adjustable speeds up to 3,000 rpm." },
  { id: "hkm-dryblock", name: "HKM Dry Block Heater", brand: "hkm", category: "equipment", description: "Programmable dual-block thermal incubator with ±0.1 °C precision." },

  // ── BIOLEGEND ────────────────────────────────────────────────────────────
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
export function productById(id: string) {
  return products.find((p) => p.id === id);
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
