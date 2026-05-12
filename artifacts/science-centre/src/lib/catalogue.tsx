import {
  Beaker, Microscope, Dna, HeartPulse, TestTube,
  FlaskConical, Cpu, ShieldCheck, Activity, Layers,
} from "lucide-react";

export type Brand = { id: string; name: string; short: string; blurb: string; accent: string; };
export type Category = { id: string; name: string; icon: React.ReactNode; };

export type PackagingVariant = {
  name: string;
  catalogueNumber: string;
  units: string;
  format?: string;
};

export type Product = {
  id: string; name: string; brand: string; category: string;
  subcategory?: string; description: string; featured?: boolean; tags?: string[];
  image?: string;
  highlights?: string[]; features?: string[]; applications?: string[];
  specs?: Record<string, string>; catalogueNumber?: string;
  packaging?: PackagingVariant[];
  relatedProducts?: string[];
};

export const brands: Brand[] = [
  { id: "onelambda", name: "One Lambda (Thermo Fisher Scientific)", short: "One Lambda", blurb: "Global leader in transplant diagnostics — HLA typing, antibody detection, and crossmatch solutions trusted worldwide.", accent: "#D71920" },
  { id: "merck", name: "Merck Sigma-Aldrich", short: "Merck", blurb: "Reagents, antibodies and research chemicals — life-science gold standard.", accent: "#003366" },
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
  { id: "serological", name: "Serological Typing", icon: <Activity className="h-4 w-4" /> },
  { id: "posttransplant", name: "Post-Transplant Monitoring", icon: <Layers className="h-4 w-4" /> },
];

// Navigation tree mirroring vhbio.com One Lambda structure exactly
export const oneLambdaNav: Record<string, Record<string, string[]>> = {
  "Antibody Detection": {
    "Luminex-based HLA Antibody Identification": ["ol-labscreen-sa1","ol-labscreen-sa2","ol-labscreen-mixed","ol-labscreen-pra","ol-labscreen-multi","ol-labscreen-mica","ol-labscreen-explex","ol-labscreen-supplement","ol-labscreen-ancillary"],
    "Complement Binding HLA Antibody Identification": ["ol-c1qscreen"],
    "Flow Cytometry Based HLA Antibody Identification": ["ol-flowpra-sa","ol-flowpra-specific","ol-flowpra-ancillary"],
    "Advanced Crossmatch Testing": ["ol-flowdsa-xm"],
    "Advanced Antibody Testing": ["ol-magsort"],
    "ELISA-Based HLA Antibody Identification": ["ol-lat","ol-lat-mixed","ol-lat-class1"],
    "ELISA-Based Non-HLA Antibody Identification": ["ol-at1r-etar"],
    "Non-HLA Luminex Based Antibody Identification": ["ol-labscreen-autoantibody"],
    "Serological-based HLA Antibody Identification": ["ol-lambda-cell-trays"],
  },
  "Molecular Typing": {
    "Next-Generation Sequencing": ["ol-alltype-ngs","ol-alltype-fastplex","ol-alltype-rapid","ol-hybritype"],
    "Sequence-Specific Primer Typing": ["ol-microssp-generic","ol-microssp-highres","ol-bulk-primers"],
    "Reverse SSO Typing": ["ol-labtype-sso","ol-labtype-ancillary"],
    "Sequence Based Typing": ["ol-secore-sbt","ol-secore-gssp"],
    "LinkSeq Real-Time PCR": ["ol-linkseq-hla-kir","ol-linkseq-hpa-abo","ol-linkseq-ancillary"],
    "Non-HLA Genotyping": ["ol-cytokine-genotyping","ol-hna-genotyping","ol-kir-sso"],
    "Molecular Biology Instrumentation": ["ol-qubit","ol-veritiPro"],
  },
  "Serological Typing": {
    "HLA Tissue Typing Trays": ["ol-terasaki-trays","ol-terasaki-supplement","ol-lmt"],
    "Serological Reagents": ["ol-b27-antibody","ol-cytotoxic-controls","ol-dynabeads","ol-fluoroquench","ol-bulk-monoclonal"],
  },
  "Instruments & Software": {
    "Readers & Analysers": ["ol-labscan3d","ol-labscan100"],
    "Software": ["ol-typestream","ol-fusion"],
    "Automated Pipettor": ["ol-hla-pro"],
  },
  "Post-Transplant Monitoring": {
    "Chimerism Monitoring": ["ol-chimerism-ngs","ol-chimerism"],
    "Donor-Derived Cell-Free DNA": ["ol-accept-cfdna"],
  },
};

export const products: Product[] = [
  // ═══ ONE LAMBDA — ANTIBODY DETECTION ═══════════════════════════════════════

  { id:"ol-labscreen-sa1", name:"LABScreen™ Single Antigen HLA Class I", brand:"onelambda", category:"transplant", subcategory:"Luminex-based HLA Antibody Identification",
    description:"High-resolution identification of HLA Class I antibodies (HLA-A, B, C) using Luminex xMAP® single-antigen bead technology. Each bead is coated with a single purified HLA antigen for precise antibody specificity determination.", featured:true,
    tags:["hla","transplant","antibody","class-i","luminex"],
    highlights:["Single-antigen resolution for HLA-A, B, C","Over 90 HLA Class I specificities covered","FDA 510(k) cleared, CE marked","Compatible with LABScan3D™ and FLEXMAP 3D®"],
    features:["Single purified recombinant HLA Class I antigen per bead","PE-conjugated anti-human IgG fluorescent detection","High inter-assay reproducibility","HLA Fusion™ software compatible","Interpretable with automated cut-off application"],
    applications:["Pre-transplant HLA antibody identification","Unacceptable antigen determination for transplant listing","Virtual crossmatch — Class I","Post-transplant donor-specific antibody (DSA) monitoring","Panel Reactive Antibody (PRA) assessment"],
    specs:{"HLA Loci":"HLA-A, B, C (Class I)","Specificities":"> 90","Detection Method":"PE anti-human IgG","Sample Type":"Human serum","Sample Volume":"20 µL per reaction","Incubation Time":"30 minutes","Regulatory Status":"FDA 510(k) cleared, CE marked"},
    packaging:[
      {name:"LABScreen™ Single Antigen Class I",catalogueNumber:"LS1A04",units:"1 Kit",format:"96-well microplate"},
      {name:"LABScreen™ Single Antigen Class I HD",catalogueNumber:"LS1A04HD",units:"1 Kit",format:"96-well microplate, High Definition"},
    ],
    relatedProducts:["ol-labscreen-sa2","ol-labscreen-mixed","ol-labscan3d","ol-c1qscreen"] },

  { id:"ol-labscreen-sa2", name:"LABScreen™ Single Antigen HLA Class II", brand:"onelambda", category:"transplant", subcategory:"Luminex-based HLA Antibody Identification",
    description:"Definitive identification of HLA Class II antibodies (DRB1, DRB3/4/5, DQA1, DQB1, DPA1, DPB1) using single-antigen bead technology on the Luminex xMAP® platform.", featured:true,
    tags:["hla","transplant","antibody","class-ii","luminex"],
    highlights:["Full DRB1, DRB3/4/5, DQA1, DQB1, DPA1, DPB1 coverage","Alpha-beta heterodimer pairs for DQ and DP loci","Detects rare and low-frequency specificities","FDA 510(k) cleared, CE marked"],
    features:["Single purified recombinant HLA Class II antigen per bead","Alpha-beta heterodimer pairs for DQ and DP","PE-conjugated anti-human IgG detection","HLA Fusion™ software compatible"],
    applications:["Pre-transplant HLA Class II antibody identification","DQ and DP antibody specificity determination","Virtual crossmatch — Class II","Post-transplant DSA monitoring"],
    specs:{"HLA Loci":"DRB1, DRB3/4/5, DQA1, DQB1, DPA1, DPB1","Specificities":"> 100","Detection Method":"PE anti-human IgG","Sample Volume":"20 µL per reaction","Regulatory Status":"FDA 510(k) cleared, CE marked"},
    packaging:[
      {name:"LABScreen™ Single Antigen Class II",catalogueNumber:"LS2A04",units:"1 Kit",format:"96-well microplate"},
      {name:"LABScreen™ Single Antigen Class II HD",catalogueNumber:"LS2A04HD",units:"1 Kit",format:"96-well microplate, High Definition"},
    ],
    relatedProducts:["ol-labscreen-sa1","ol-labscreen-mixed","ol-labscan3d","ol-c1qscreen"] },

  { id:"ol-labscreen-mixed", name:"LABScreen™ Mixed Class I & II Antibody Screening", brand:"onelambda", category:"transplant", subcategory:"Luminex-based HLA Antibody Identification",
    description:"Simultaneously screens for HLA Class I and Class II antibodies in a single well. Cost-effective first-line screening before single-antigen testing.",
    tags:["hla","transplant","screening"],
    packaging:[{name:"LABScreen™ Mixed",catalogueNumber:"LSMA04",units:"1 Kit",format:"96-well microplate"}],
    relatedProducts:["ol-labscreen-sa1","ol-labscreen-sa2"] },

  { id:"ol-labscreen-pra", name:"LABScreen™ PRA", brand:"onelambda", category:"transplant", subcategory:"Luminex-based HLA Antibody Identification",
    description:"Panel Reactive Antibody (PRA) determination using Luminex xMAP® bead technology. Provides percentage PRA calculation for Class I and Class II.",
    tags:["hla","transplant","pra","screening"],
    packaging:[
      {name:"LABScreen™ PRA Class I",catalogueNumber:"LSPRA1A04",units:"1 Kit",format:"96-well microplate"},
      {name:"LABScreen™ PRA Class II",catalogueNumber:"LSPRA2A04",units:"1 Kit",format:"96-well microplate"},
    ] },

  { id:"ol-labscreen-multi", name:"LABScreen™ Multi", brand:"onelambda", category:"transplant", subcategory:"Luminex-based HLA Antibody Identification",
    description:"Screens for HLA antibodies against a broad panel of common HLA specificities. Ideal for initial sensitization assessment.",
    tags:["hla","transplant","screening"],
    packaging:[{name:"LABScreen™ Multi",catalogueNumber:"LSMULIA4",units:"1 Kit",format:"96-well microplate"}] },

  { id:"ol-labscreen-mica", name:"LABScreen™ MICA Single Antigen Group 1", brand:"onelambda", category:"transplant", subcategory:"Luminex-based HLA Antibody Identification",
    description:"Detects and identifies antibodies against MICA antigens using Luminex bead technology — important for non-HLA antibody assessment in transplant.",
    tags:["mica","non-hla","transplant"],
    packaging:[{name:"LABScreen™ MICA Single Antigen Group 1",catalogueNumber:"LSM12A04",units:"1 Kit",format:"96-well microplate"}] },

  { id:"ol-labscreen-explex", name:"LABScreen™ Single Antigen ExPlex Assay", brand:"onelambda", category:"transplant", subcategory:"Luminex-based HLA Antibody Identification",
    description:"Extended single antigen panels with additional HLA specificities beyond standard SAB kits, improving resolution for complex patient profiles.",
    tags:["hla","transplant","antibody"],
    packaging:[
      {name:"LABScreen™ SA ExPlex Class I",catalogueNumber:"LSA1EPXA04",units:"1 Kit",format:"96-well microplate"},
      {name:"LABScreen™ SA ExPlex Class II",catalogueNumber:"LSA2EPXA04",units:"1 Kit",format:"96-well microplate"},
    ] },

  { id:"ol-labscreen-supplement", name:"LABScreen™ Single Antigen Supplement", brand:"onelambda", category:"transplant", subcategory:"Luminex-based HLA Antibody Identification",
    description:"Supplementary single antigen beads providing additional HLA specificities to complement standard LABScreen™ SAB kits.",
    tags:["hla","transplant","supplement"],
    packaging:[{name:"LABScreen™ SA Supplement Class I",catalogueNumber:"LS1SUPPA04",units:"1 Kit",format:"96-well microplate"}] },

  { id:"ol-labscreen-ancillary", name:"LABScreen™ Ancillary Reagents", brand:"onelambda", category:"transplant", subcategory:"Luminex-based HLA Antibody Identification",
    description:"Supporting reagents for LABScreen™ assays: wash buffer, positive/negative controls, and serum diluent.",
    tags:["ancillary","reagents","labscreen"],
    packaging:[
      {name:"LABScreen™ Control Sera",catalogueNumber:"LSCONTXA",units:"1 Kit",format:"Control sera"},
      {name:"LABScreen™ Wash Buffer",catalogueNumber:"LSWASH0X",units:"1 Bottle",format:"Concentrate"},
    ] },

  { id:"ol-c1qscreen", name:"C1qScreen™ HLA Antibody Detection", brand:"onelambda", category:"transplant", subcategory:"Complement Binding HLA Antibody Identification",
    description:"Identifies complement-fixing HLA antibodies via C1q binding. Distinguishes clinically relevant complement-activating DSA — a key predictor of antibody-mediated rejection (AMR).", featured:true,
    tags:["complement","c1q","amr","transplant","dsa"],
    highlights:["Identifies complement-fixing (C1q-binding) HLA antibodies","Predicts risk of antibody-mediated rejection (AMR)","Single antigen bead format — Class I and Class II"],
    specs:{"Method":"C1q-binding Luminex bead assay","HLA Coverage":"Class I and Class II","Regulatory":"CE marked"},
    packaging:[
      {name:"C1qScreen™ Class I",catalogueNumber:"C1QSA1HD04",units:"1 Kit",format:"96-well microplate"},
      {name:"C1qScreen™ Class II",catalogueNumber:"C1QSA2HD04",units:"1 Kit",format:"96-well microplate"},
    ],
    relatedProducts:["ol-labscreen-sa1","ol-labscreen-sa2"] },

  { id:"ol-flowpra-sa", name:"FlowPRA™ Single Antigen", brand:"onelambda", category:"transplant", subcategory:"Flow Cytometry Based HLA Antibody Identification",
    description:"Identifies HLA Class I and Class II antibodies by flow cytometry using beads coated with individual HLA antigens. Designed for high-PRA patients.",
    tags:["hla","flow-cytometry","pra","transplant"],
    packaging:[
      {name:"FlowPRA™ Single Antigen Class I",catalogueNumber:"03FL1HD",units:"1 Kit",format:"Flow cytometry"},
      {name:"FlowPRA™ Single Antigen Class II",catalogueNumber:"03FL2HD",units:"1 Kit",format:"Flow cytometry"},
    ] },

  { id:"ol-flowpra-specific", name:"FlowPRA™ Specific", brand:"onelambda", category:"transplant", subcategory:"Flow Cytometry Based HLA Antibody Identification",
    description:"Flow cytometry-based screening using microbeads coated with pooled HLA antigens for rapid antibody screening.",
    tags:["hla","flow-cytometry","screening"],
    packaging:[
      {name:"FlowPRA™ Specific Class I",catalogueNumber:"03FLC1S",units:"1 Kit",format:"Flow cytometry"},
      {name:"FlowPRA™ Specific Class II",catalogueNumber:"03FLC2S",units:"1 Kit",format:"Flow cytometry"},
    ] },

  { id:"ol-flowpra-ancillary", name:"FlowPRA™ Ancillary Products", brand:"onelambda", category:"transplant", subcategory:"Flow Cytometry Based HLA Antibody Identification",
    description:"Supporting reagents for FlowPRA™ assays: control beads, wash buffer, and reagent packs.",
    tags:["ancillary","flow-cytometry"],
    packaging:[{name:"FlowPRA™ Control Beads",catalogueNumber:"03FLCB",units:"1 Vial",format:"Control beads"}] },

  { id:"ol-flowdsa-xm", name:"FlowDSA-XM™ Advanced Crossmatch", brand:"onelambda", category:"transplant", subcategory:"Advanced Crossmatch Testing",
    description:"Advanced flow cytometry crossmatch for specific detection of donor-directed HLA antibodies. Greater sensitivity than standard CDC crossmatch.",
    tags:["crossmatch","dsa","flow-cytometry","transplant"],
    packaging:[{name:"FlowDSA-XM™",catalogueNumber:"FLOWDSA",units:"1 Kit",format:"Flow cytometry"}] },

  { id:"ol-magsort", name:"One Lambda™ MagSort™", brand:"onelambda", category:"transplant", subcategory:"Advanced Antibody Testing",
    description:"Magnetic bead-based technology for advanced HLA antibody testing and prozone/hook effect removal. Improves antibody detection accuracy.",
    tags:["antibody","magsort","prozone"],
    packaging:[{name:"MagSort™ Class I & II",catalogueNumber:"MAGSORT04",units:"1 Kit",format:"Magnetic beads"}] },

  { id:"ol-lat", name:"Lambda Antigen Tray (LAT™)", brand:"onelambda", category:"transplant", subcategory:"ELISA-Based HLA Antibody Identification",
    description:"ELISA-based Terasaki trays coated with HLA antigens for detecting HLA antibodies and PRA screening.",
    tags:["elisa","hla","transplant","lat"],
    packaging:[{name:"Lambda Antigen Tray",catalogueNumber:"03LATMHD",units:"20 Tests",format:"Terasaki tray"}] },

  { id:"ol-lat-mixed", name:"Lambda Antigen Tray Mixed", brand:"onelambda", category:"transplant", subcategory:"ELISA-Based HLA Antibody Identification",
    description:"ELISA Terasaki trays with comprehensive mixture of Class I and Class II HLA antigens for broad antibody screening.",
    tags:["elisa","hla","transplant"],
    packaging:[{name:"Lambda Antigen Tray Mixed",catalogueNumber:"03LATMHD",units:"20 Tests",format:"Terasaki tray"}] },

  { id:"ol-lat-class1", name:"Lambda Antigen Tray™ Class I Single Antigen", brand:"onelambda", category:"transplant", subcategory:"ELISA-Based HLA Antibody Identification",
    description:"ELISA Terasaki trays coated with individual HLA Class I antigens for high-resolution antibody identification in high-PRA patients.",
    tags:["elisa","hla","class-i","transplant"],
    packaging:[{name:"Lambda Antigen Tray Class I Single Antigen",catalogueNumber:"03LAT1HD",units:"20 Tests",format:"Terasaki tray"}] },

  { id:"ol-at1r-etar", name:"AT1R and ETAR Non-HLA Antibody Assays", brand:"onelambda", category:"transplant", subcategory:"ELISA-Based Non-HLA Antibody Identification",
    description:"ELISA assays for quantitative determination of anti-AT1R and anti-ETAR antibodies — non-HLA antibodies associated with poor transplant outcomes.",
    tags:["non-hla","at1r","etar","elisa"],
    packaging:[
      {name:"EIA for Anti-AT1R Antibodies",catalogueNumber:"AT1REIA",units:"96 Tests",format:"ELISA plate"},
      {name:"EIA for Anti-ETAR Antibodies",catalogueNumber:"ETAREIA",units:"96 Tests",format:"ELISA plate"},
    ] },

  { id:"ol-labscreen-autoantibody", name:"LABScreen™ Autoantibody", brand:"onelambda", category:"transplant", subcategory:"Non-HLA Luminex Based Antibody Identification",
    description:"Luminex-based assay for detecting autoantibodies relevant to transplant outcomes. Complements HLA antibody testing for comprehensive pre-transplant assessment.",
    tags:["autoantibody","non-hla","luminex"],
    packaging:[{name:"LABScreen™ Autoantibody",catalogueNumber:"LSAUTO04",units:"1 Kit",format:"96-well microplate"}] },

  { id:"ol-lambda-cell-trays", name:"Lambda Cell Trays", brand:"onelambda", category:"transplant", subcategory:"Serological-based HLA Antibody Identification",
    description:"Cell-based trays for serological HLA antibody identification using complement-dependent cytotoxicity (CDC) methodology.",
    tags:["cdc","serological","hla"],
    packaging:[{name:"Lambda Cell Trays",catalogueNumber:"LCELL",units:"Varies",format:"Serological tray"}] },

  // ═══ ONE LAMBDA — MOLECULAR TYPING ═════════════════════════════════════════

  { id:"ol-alltype-ngs", name:"AllType™ NGS HLA Typing Kit", brand:"onelambda", category:"ngs", subcategory:"Next-Generation Sequencing",
    description:"Comprehensive HLA typing across 11 loci in a single amplification and sequencing run. Delivers allele-level, high-resolution HLA typing from 50 ng DNA. Completed on-bench within one workday.", featured:true,
    tags:["hla","typing","ngs","allele-level"],
    highlights:["11-locus typing: A, B, C, DRB1/3/4/5, DQA1, DQB1, DPA1, DPB1","Allele-level phased typing from 50 ng DNA","Illumina® MiSeq and Ion Torrent™ compatible","Turnaround under 24 hours — single workday"],
    features:["Long-range PCR covering full exonic regions","High-resolution phased allele assignment","TypeStream™ Visual software for automated analysis","Scalable 8 to 96 samples per run","CE-IVD marked for in vitro diagnostic use"],
    applications:["Donor and recipient HLA typing for transplantation","Bone marrow / stem cell donor registry typing","High-resolution research typing","Novel allele discovery"],
    specs:{"Loci":"HLA-A,B,C,DRB1,DRB3/4/5,DQA1,DQB1,DPA1,DPB1","Resolution":"Allele-level (4-field, phased)","DNA Input":"50 ng","Platforms":"Illumina® MiSeq, Ion Torrent™","Turnaround":"< 24 hours","Software":"TypeStream™ Visual","Regulatory":"CE-IVD marked"},
    packaging:[
      {name:"AllType™ NGS 8-Sample Kit",catalogueNumber:"OLI8A",units:"8 Samples",format:"NGS amplification kit"},
      {name:"AllType™ NGS 24-Sample Kit",catalogueNumber:"OLI24A",units:"24 Samples",format:"NGS amplification kit"},
      {name:"AllType™ NGS 96-Sample Kit",catalogueNumber:"OLI96A",units:"96 Samples",format:"NGS amplification kit"},
    ],
    relatedProducts:["ol-alltype-fastplex","ol-typestream","ol-labscan3d"] },

  { id:"ol-alltype-fastplex", name:"AllType™ FASTplex™ NGS", brand:"onelambda", category:"ngs", subcategory:"Next-Generation Sequencing",
    description:"Accelerated AllType™ NGS with streamlined amplification for faster turnaround. Optimised for Illumina short-read platforms.",
    tags:["hla","ngs","typing","fast"],
    packaging:[
      {name:"AllType™ FASTplex™ 24-Sample",catalogueNumber:"OLIFPX24A",units:"24 Samples",format:"NGS amplification kit"},
      {name:"AllType™ FASTplex™ 96-Sample",catalogueNumber:"OLIFPX96A",units:"96 Samples",format:"NGS amplification kit"},
    ],
    relatedProducts:["ol-alltype-ngs","ol-typestream"] },

  { id:"ol-alltype-rapid", name:"AllType™ Rapid 11 Loci Kit", brand:"onelambda", category:"ngs", subcategory:"Next-Generation Sequencing",
    description:"Rapid 11-loci HLA typing with the same comprehensive coverage as AllType™ NGS in an accelerated workflow.",
    tags:["hla","ngs","rapid","typing"],
    packaging:[{name:"AllType™ Rapid 11 Loci",catalogueNumber:"OLIRAP24A",units:"24 Samples",format:"NGS amplification kit"}] },

  { id:"ol-hybritype", name:"One Lambda™ HybriType™ NGS Hybrid Capture Assay", brand:"onelambda", category:"ngs", subcategory:"Next-Generation Sequencing",
    description:"Probe-based NGS hybrid capture for classical HLA, non-classical HLA, MICA/MICB, and ABO blood groups. Full gene or exon coverage with high read balance. Workflow completes in under 5.5 hours.",
    tags:["hla","ngs","hybrid-capture","abo","mica"],
    packaging:[{name:"HybriType™ HLA Plus ABO Flex Kit 96",catalogueNumber:"03HYB18ABOFX",units:"96 Samples",format:"Hybrid capture NGS kit"}],
    relatedProducts:["ol-alltype-ngs","ol-typestream"] },

  { id:"ol-microssp-generic", name:"Micro SSP™ Generic HLA Typing Trays", brand:"onelambda", category:"molecular", subcategory:"Sequence-Specific Primer Typing",
    description:"Ready-to-use lyophilised SSP trays for low-to-intermediate resolution HLA typing of Class I and Class II. Results in under 3 hours using a standard thermocycler.", featured:true,
    tags:["hla","ssp","typing","class-i","class-ii"],
    packaging:[
      {name:"Micro SSP™ Generic Class I Tray",catalogueNumber:"MSSPA004",units:"10 Trays",format:"96-well SSP tray"},
      {name:"Micro SSP™ Generic Class II Tray",catalogueNumber:"MSSPA2004",units:"10 Trays",format:"96-well SSP tray"},
    ],
    relatedProducts:["ol-microssp-highres","ol-alltype-ngs"] },

  { id:"ol-microssp-highres", name:"Micro SSP™ High Resolution Typing Trays", brand:"onelambda", category:"molecular", subcategory:"Sequence-Specific Primer Typing",
    description:"High-resolution SSP trays for allele-level discrimination at critical HLA loci, suitable for cases requiring greater resolution than generic trays.",
    tags:["hla","ssp","typing","high-resolution"],
    packaging:[
      {name:"Micro SSP™ HLA-A High Resolution",catalogueNumber:"MSSHRESA",units:"10 Trays",format:"96-well SSP tray"},
      {name:"Micro SSP™ HLA-B High Resolution",catalogueNumber:"MSSHRESB",units:"10 Trays",format:"96-well SSP tray"},
      {name:"Micro SSP™ HLA-DRB High Resolution",catalogueNumber:"MSSHRDRB",units:"10 Trays",format:"96-well SSP tray"},
    ],
    relatedProducts:["ol-microssp-generic"] },

  { id:"ol-bulk-primers", name:"Bulk Primer Sets", brand:"onelambda", category:"molecular", subcategory:"Sequence-Specific Primer Typing",
    description:"Individual HLA SSP primer sets in bulk format for large-scale typing or custom panel configuration.",
    tags:["ssp","primers","typing"],
    packaging:[{name:"Bulk Primer Set",catalogueNumber:"BULKPRIM",units:"Varies",format:"Individual primer sets"}] },

  { id:"ol-labtype-sso", name:"LABType™ SSO HLA Typing", brand:"onelambda", category:"molecular", subcategory:"Reverse SSO Typing",
    description:"Reverse sequence-specific oligonucleotide (rSSO) typing using Luminex xMAP® beads. Intermediate-to-high resolution HLA typing compatible with LABScan3D™ and LABScan™ 100.", featured:true,
    tags:["hla","sso","typing","luminex"],
    highlights:["Intermediate-to-high resolution HLA typing","Luminex xMAP® bead-based rSSO method","Compatible with LABScan3D™ and LABScan™ 100","Fast 6-hour turnaround"],
    packaging:[
      {name:"LABType™ SSO HLA-A",catalogueNumber:"LABTYPA04",units:"1 Kit",format:"96-well microplate"},
      {name:"LABType™ SSO HLA-B",catalogueNumber:"LABTYPB04",units:"1 Kit",format:"96-well microplate"},
      {name:"LABType™ SSO HLA-C",catalogueNumber:"LABTYPCC04",units:"1 Kit",format:"96-well microplate"},
      {name:"LABType™ SSO HLA-DRB1",catalogueNumber:"LABTYPDRB04",units:"1 Kit",format:"96-well microplate"},
      {name:"LABType™ SSO HLA-DQB1",catalogueNumber:"LABTYPD04",units:"1 Kit",format:"96-well microplate"},
    ],
    relatedProducts:["ol-labtype-ancillary","ol-labscan3d","ol-alltype-ngs"] },

  { id:"ol-labtype-ancillary", name:"LABType™ Ancillary Reagents", brand:"onelambda", category:"molecular", subcategory:"Reverse SSO Typing",
    description:"Supporting reagents for LABType™ SSO assays: DNA denaturation reagent, hybridisation buffer, and wash reagents.",
    tags:["ancillary","labtype","sso"],
    packaging:[{name:"LABType™ Ancillary Kit",catalogueNumber:"LABTYP-ANC",units:"1 Kit",format:"Ancillary reagents"}] },

  { id:"ol-secore-sbt", name:"SeCore™ SBT HLA Typing Kits", brand:"onelambda", category:"molecular", subcategory:"Sequence Based Typing",
    description:"Sequence-based typing (SBT) kits for high-resolution allele-level HLA genotyping using Sanger sequencing — the gold standard for unambiguous allele assignment.",
    tags:["hla","sbt","typing","sanger"],
    packaging:[
      {name:"SeCore™ SBT HLA-A",catalogueNumber:"SECSBT-A",units:"1 Kit",format:"SBT amplification kit"},
      {name:"SeCore™ SBT HLA-B",catalogueNumber:"SECSBT-B",units:"1 Kit",format:"SBT amplification kit"},
      {name:"SeCore™ SBT HLA-DRB1",catalogueNumber:"SECSBT-DRB",units:"1 Kit",format:"SBT amplification kit"},
    ] },

  { id:"ol-secore-gssp", name:"SeCore™ GSSP Kit", brand:"onelambda", category:"molecular", subcategory:"Sequence Based Typing",
    description:"Group-specific sequencing primer (GSSP) kits for resolving HLA sequence ambiguities during SBT typing.",
    tags:["hla","sbt","gssp","ambiguity"],
    packaging:[{name:"SeCore™ GSSP Kit",catalogueNumber:"SECGSSP04",units:"1 Kit",format:"GSSP primers"}] },

  { id:"ol-linkseq-hla-kir", name:"LinkSēq™ HLA and KIR Typing Kits", brand:"onelambda", category:"molecular", subcategory:"LinkSeq Real-Time PCR",
    description:"Real-time PCR kits for rapid presence/absence testing of HLA and KIR genes.",
    tags:["hla","kir","real-time-pcr","typing"],
    packaging:[
      {name:"LinkSēq HLA Typing Kit",catalogueNumber:"LSEQ-HLA",units:"1 Kit",format:"Real-time PCR kit"},
      {name:"LinkSēq KIR Typing Kit",catalogueNumber:"LSEQ-KIR",units:"1 Kit",format:"Real-time PCR kit"},
    ] },

  { id:"ol-linkseq-hpa-abo", name:"LinkSēq™ HPA and ABO Typing Kits", brand:"onelambda", category:"molecular", subcategory:"LinkSeq Real-Time PCR",
    description:"Real-time PCR kits for Human Platelet Antigen (HPA) and ABO blood group genotyping.",
    tags:["hpa","abo","real-time-pcr"],
    packaging:[
      {name:"LinkSēq HPA Typing Kit",catalogueNumber:"LSEQ-HPA",units:"1 Kit",format:"Real-time PCR kit"},
      {name:"LinkSēq ABO Typing Kit",catalogueNumber:"LSEQ-ABO",units:"1 Kit",format:"Real-time PCR kit"},
    ] },

  { id:"ol-linkseq-ancillary", name:"LinkSēq™ Ancillary Products", brand:"onelambda", category:"molecular", subcategory:"LinkSeq Real-Time PCR",
    description:"Supporting reagents for LinkSēq real-time PCR typing workflows.",
    tags:["ancillary","linkseq","pcr"],
    packaging:[{name:"LinkSēq Ancillary Kit",catalogueNumber:"LSEQ-ANC",units:"1 Kit",format:"Ancillary"}] },

  { id:"ol-cytokine-genotyping", name:"Cytokine Genotyping Kits", brand:"onelambda", category:"molecular", subcategory:"Non-HLA Genotyping",
    description:"Kits for genotyping cytokine gene polymorphisms relevant to transplant rejection and immune response.",
    tags:["cytokine","genotyping","non-hla"],
    packaging:[{name:"Cytokine Genotyping Kit",catalogueNumber:"CYTOKGENO",units:"1 Kit",format:"SSP typing"}] },

  { id:"ol-hna-genotyping", name:"HNA Genotyping", brand:"onelambda", category:"molecular", subcategory:"Non-HLA Genotyping",
    description:"Human Neutrophil Antigen (HNA) genotyping for transfusion medicine and transplant applications.",
    tags:["hna","genotyping","non-hla"],
    packaging:[{name:"HNA Genotyping Kit",catalogueNumber:"HNAGENO",units:"1 Kit",format:"SSP typing"}] },

  { id:"ol-kir-sso", name:"KIR SSO Genotyping", brand:"onelambda", category:"molecular", subcategory:"Non-HLA Genotyping",
    description:"SSO genotyping for Killer Immunoglobulin-like Receptor (KIR) genes — critical for NK cell biology and transplant outcomes.",
    tags:["kir","sso","genotyping"],
    packaging:[{name:"KIR SSO Genotyping Kit",catalogueNumber:"KIRSSO04",units:"1 Kit",format:"Luminex bead kit"}] },

  { id:"ol-qubit", name:"Qubit™ Fluorometric Quantitation", brand:"onelambda", category:"equipment", subcategory:"Molecular Biology Instrumentation",
    description:"Fluorometric DNA quantitation system for accurate DNA concentration measurement before NGS library preparation.",
    tags:["dna-quantitation","fluorometric","qubit"],
    packaging:[
      {name:"Qubit™ dsDNA HS Assay Kit",catalogueNumber:"Q32851",units:"100 Assays",format:"Fluorometric assay"},
      {name:"Qubit™ dsDNA BR Assay Kit",catalogueNumber:"Q32850",units:"100 Assays",format:"Fluorometric assay"},
    ] },

  { id:"ol-veritiPro", name:"VeritiPro™ Thermal Cycler", brand:"onelambda", category:"equipment", subcategory:"Molecular Biology Instrumentation",
    description:"High-performance thermal cycler compatible with Micro SSP™, SeCore™, and all PCR-based One Lambda typing assays.",
    tags:["thermal-cycler","pcr","instrumentation"],
    packaging:[{name:"VeritiPro™ 96-Well Thermal Cycler",catalogueNumber:"A48138",units:"1 Instrument",format:"Thermal cycler"}] },

  // ═══ ONE LAMBDA — SEROLOGICAL TYPING ═══════════════════════════════════════

  { id:"ol-terasaki-trays", name:"Terasaki HLA Tissue Typing Trays", brand:"onelambda", category:"serological", subcategory:"HLA Tissue Typing Trays",
    description:"Complement-dependent cytotoxicity (CDC) Terasaki trays for serological HLA tissue typing — the classic method for pre-transplant crossmatch and HLA antigen identification.", featured:true,
    tags:["serological","cdc","terasaki","hla","tissue-typing"],
    highlights:["Classic CDC method for HLA tissue typing","Class I and Class II formats available","72-well tray format","High antigen coverage"],
    packaging:[
      {name:"Terasaki HLA Class II Tissue Typing Tray, 72 Well",catalogueNumber:"O3DR72",units:"10 Trays",format:"72-well format"},
      {name:"Terasaki HLA Class II Dry Tissue Typing Tray",catalogueNumber:"O3DR72D",units:"10 Trays",format:"72-well format"},
      {name:"Terasaki Special Class I Tissue Typing Set",catalogueNumber:"O3TM144",units:"20 Tests",format:""},
    ],
    relatedProducts:["ol-terasaki-supplement","ol-lmt"] },

  { id:"ol-terasaki-supplement", name:"Terasaki Supplement HLA Tissue Typing Trays", brand:"onelambda", category:"serological", subcategory:"HLA Tissue Typing Trays",
    description:"Supplementary Terasaki trays with additional HLA specificities to extend the standard typing panel.",
    tags:["serological","cdc","terasaki","supplement"],
    packaging:[{name:"Terasaki Supplement Tray",catalogueNumber:"O3SUPPL",units:"10 Trays",format:"72-well format"}],
    relatedProducts:["ol-terasaki-trays"] },

  { id:"ol-lmt", name:"Lambda Monoclonal Trays (LMT™)", brand:"onelambda", category:"serological", subcategory:"HLA Tissue Typing Trays",
    description:"Trays containing highly specific monoclonal antibodies for accurate HLA antigen identification by CDC. Greater specificity than polyclonal antisera.",
    tags:["serological","monoclonal","cdc","hla"],
    packaging:[{name:"Lambda Monoclonal Trays (LMT)",catalogueNumber:"LMTMONO",units:"10 Trays",format:"Serological tray"}],
    relatedProducts:["ol-terasaki-trays"] },

  { id:"ol-b27-antibody", name:"B27 Monoclonal Antibody", brand:"onelambda", category:"serological", subcategory:"Serological Reagents",
    description:"Highly specific monoclonal antibody for HLA-B27 antigen identification — key marker for ankylosing spondylitis and HLA-B27 associated disorders.",
    tags:["b27","monoclonal","serological"],
    packaging:[{name:"B27 Monoclonal Antibody",catalogueNumber:"B27MONO",units:"1 Vial",format:"Monoclonal antibody"}] },

  { id:"ol-cytotoxic-controls", name:"Cytotoxic Controls", brand:"onelambda", category:"serological", subcategory:"Serological Reagents",
    description:"Positive and negative cytotoxic control sera for quality assurance in CDC crossmatch testing.",
    tags:["cdc","controls","serological"],
    packaging:[
      {name:"Positive Cytotoxic Control",catalogueNumber:"CYTPOS",units:"1 Vial",format:"Control serum"},
      {name:"Negative Cytotoxic Control",catalogueNumber:"CYTNEG",units:"1 Vial",format:"Control serum"},
    ] },

  { id:"ol-dynabeads", name:"Dynabeads™ for Cell Isolation", brand:"onelambda", category:"serological", subcategory:"Serological Reagents",
    description:"Magnetic bead reagents for isolating T and B lymphocytes for use in CDC crossmatch assays.",
    tags:["dynabeads","cell-isolation","serological"],
    packaging:[
      {name:"Dynabeads™ Pan T (CD2)",catalogueNumber:"DYNAPAT",units:"1 Vial",format:"Magnetic beads"},
      {name:"Dynabeads™ Pan B (CD19)",catalogueNumber:"DYNAPAB",units:"1 Vial",format:"Magnetic beads"},
    ] },

  { id:"ol-fluoroquench", name:"FluoroQuench™ Staining/Quenching Reagent", brand:"onelambda", category:"serological", subcategory:"Serological Reagents",
    description:"Fluorescent quenching reagent for differentiating live from dead cells in CDC crossmatch assays.",
    tags:["fluoroquench","cdc","staining"],
    packaging:[{name:"FluoroQuench™",catalogueNumber:"FLUROQUENCH",units:"1 Vial",format:"Reagent"}] },

  { id:"ol-bulk-monoclonal", name:"Bulk Monoclonal Antibody", brand:"onelambda", category:"serological", subcategory:"Serological Reagents",
    description:"Bulk monoclonal antibodies for HLA antigen identification in high-throughput serological laboratories.",
    tags:["monoclonal","bulk","serological"],
    packaging:[{name:"Bulk Monoclonal Antibody",catalogueNumber:"BULKMONO",units:"Varies",format:"Bulk antibody"}] },

  // ═══ ONE LAMBDA — INSTRUMENTS & SOFTWARE ═══════════════════════════════════

  { id:"ol-labscan3d", name:"LABScan3D™ Multiplex Analyzer", brand:"onelambda", category:"multiplex", subcategory:"Readers & Analysers",
    description:"One Lambda's flagship multiplex flow analyser purpose-built for transplant diagnostics. Reads Luminex xMAP® beads to deliver high-resolution HLA antibody identification and typing.", featured:true,
    tags:["analyzer","hla","transplant","luminex","instrument"],
    highlights:["500-plex xMAP® bead technology","FDA 510(k) cleared, CE marked","Integrated with HLA Fusion™ software","Compatible with all LABScreen™ and LABType™ kits"],
    features:["Three-laser optical system with 10 fluorescent channels","Automated data acquisition via LABScan3D™ Manager software","Built-in barcode reader for sample tracking","Compatible with 96-well microplates"],
    applications:["HLA antibody detection using LABScreen™ assays","HLA typing using LABType™ SSO kits","Post-transplant DSA monitoring","Virtual crossmatch support"],
    specs:{"Bead Regions":"500","Lasers":"3 (Red 633nm, Green 532nm, Violet 405nm)","Fluorescent Channels":"10","Sample Throughput":"Up to 96 samples per run","Plate Format":"Standard 96-well microplate","Regulatory Status":"FDA 510(k) cleared, CE marked"},
    packaging:[{name:"LABScan3D™ Analyzer",catalogueNumber:"LABScan3D",units:"1 Instrument",format:"Benchtop analyser"}],
    relatedProducts:["ol-labscreen-sa1","ol-labscreen-sa2","ol-labtype-sso","ol-fusion"] },

  { id:"ol-labscan100", name:"LABScan™ 100 Analyser", brand:"onelambda", category:"multiplex", subcategory:"Readers & Analysers",
    description:"Entry-level Luminex bead reader for lower-throughput laboratories. Compatible with all One Lambda Luminex-based assays.",
    tags:["analyzer","luminex","instrument"],
    packaging:[{name:"LABScan™ 100",catalogueNumber:"LABScan100",units:"1 Instrument",format:"Benchtop analyser"}],
    relatedProducts:["ol-labscan3d"] },

  { id:"ol-fusion", name:"HLA Fusion™ Software", brand:"onelambda", category:"transplant", subcategory:"Software",
    description:"Comprehensive laboratory information and analysis software for transplant diagnostics. Integrates LABScreen™ antibody assays, LABType™ typing, and LABScan3D™ data into a single workflow.",
    tags:["software","hla","transplant","lims"],
    highlights:["Centralised analysis for all One Lambda assays","Virtual crossmatch module","HL7 bidirectional LIS/HIS interface","21 CFR Part 11 compliant audit trail"],
    specs:{"Platform":"Windows desktop application","LIS Interface":"HL7 bidirectional","Compliance":"21 CFR Part 11"},
    packaging:[{name:"HLA Fusion™ Software",catalogueNumber:"HLAFusion4",units:"1 License",format:"Software license"}],
    relatedProducts:["ol-labscan3d","ol-labscreen-sa1"] },

  { id:"ol-typestream", name:"TypeStream™ Visual NGS Analysis Software", brand:"onelambda", category:"ngs", subcategory:"Software",
    description:"Intelligent standalone software for AllType™ NGS and HybriType™ data analysis. Automates processing of Illumina FASTQ and Ion Torrent BAM files with quality metrics and reporting.",
    tags:["software","ngs","analysis","hla"],
    packaging:[{name:"TypeStream™ Visual Software",catalogueNumber:"TYPESTREAM",units:"1 License",format:"Software license"}],
    relatedProducts:["ol-alltype-ngs","ol-alltype-fastplex"] },

  { id:"ol-hla-pro", name:"One Lambda™ HLA PRO Automated Pipettor", brand:"onelambda", category:"equipment", subcategory:"Automated Pipettor",
    description:"Automated modular pipetting system for streamlining HLA typing and antibody detection workflows. Accommodates multiple technologies on a single instrument for maximum flexibility.",
    tags:["automation","pipettor","instrument"],
    packaging:[{name:"One Lambda™ HLA PRO",catalogueNumber:"HLA-PRO",units:"1 Instrument",format:"Automated pipettor"}],
    relatedProducts:["ol-labscan3d","ol-labtype-sso"] },

  // ═══ ONE LAMBDA — POST-TRANSPLANT MONITORING ═══════════════════════════════

  { id:"ol-accept-cfdna", name:"One Lambda Devyser Accept cfDNA Assay", brand:"onelambda", category:"posttransplant", subcategory:"Donor-Derived Cell-Free DNA",
    description:"CE-IVD marked NGS solution for monitoring donor-derived cell-free DNA (dd-cfDNA) in solid organ transplant recipients. Enables earlier detection of allograft injury with 0.1% limit of detection.", featured:true,
    tags:["cfdna","post-transplant","ngs","monitoring","allograft"],
    highlights:["0.1% limit of detection — industry-leading sensitivity","All-in-one: PCR amplification, indexing, sequencing-ready library","< 45 minutes hands-on time","CE-IVD marked"],
    specs:{"LOD":"0.1% dd-cfDNA","Method":"50-indel multiplex PCR + NGS","Platforms":"Illumina","Hands-on Time":"< 45 minutes","Workflow":"~1 day","Regulatory":"CE-IVD marked"},
    packaging:[{name:"Devyser Accept cfDNA Assay Kit",catalogueNumber:"ACCEPT-CFDNA",units:"24 Samples",format:"NGS library prep kit"}],
    relatedProducts:["ol-chimerism-ngs","ol-alltype-ngs"] },

  { id:"ol-chimerism-ngs", name:"One Lambda Devyser Chimerism NGS Assay", brand:"onelambda", category:"posttransplant", subcategory:"Chimerism Monitoring",
    description:"NGS-based post-transplant chimerism monitoring for accurate quantification of donor and recipient cell populations after haematopoietic stem cell transplantation.",
    tags:["chimerism","post-transplant","ngs","monitoring"],
    packaging:[{name:"Devyser Chimerism NGS Kit",catalogueNumber:"CHIM-NGS",units:"24 Samples",format:"NGS kit"}],
    relatedProducts:["ol-chimerism","ol-accept-cfdna"] },

  { id:"ol-chimerism", name:"One Lambda Devyser Chimerism Assay", brand:"onelambda", category:"posttransplant", subcategory:"Chimerism Monitoring",
    description:"PCR-based chimerism monitoring using STR markers for post-transplant engraftment and relapse monitoring.",
    tags:["chimerism","post-transplant","str","monitoring"],
    packaging:[{name:"Devyser Chimerism STR Kit",catalogueNumber:"CHIM-STR",units:"24 Samples",format:"PCR kit"}],
    relatedProducts:["ol-chimerism-ngs"] },

  // ═══ OTHER BRANDS ══════════════════════════════════════════════════════════

  { id:"luminex-magpix", name:"MAGPIX® System", brand:"luminex", category:"multiplex", description:"Compact magnetic-bead multiplex platform delivering up to 50-plex per well.", featured:true, tags:["xmap","compact"], packaging:[{name:"MAGPIX® System",catalogueNumber:"MAGPIX",units:"1 Instrument",format:"Benchtop analyser"}] },
  { id:"luminex-flexmap3d", name:"FLEXMAP 3D® System", brand:"luminex", category:"multiplex", description:"High-throughput xMAP analyzer with 500-plex capability for biomarker discovery.", tags:["xmap","research"] },
  { id:"luminex-intelliflex", name:"xMAP INTELLIFLEX™", brand:"luminex", category:"multiplex", description:"Next-generation flow-based multiplexer with dual reporter channels.", tags:["xmap"] },
  { id:"merck-cd3", name:"Anti-CD3 Monoclonal Antibody", brand:"merck", category:"antibodies", description:"Mouse monoclonal targeting human CD3 — validated for FC, IHC, and WB." },
  { id:"merck-sybr", name:"SYBR® Green qPCR Master Mix", brand:"merck", category:"molecular", description:"Optimized 2× master mix for high-sensitivity real-time PCR.", featured:true },
  { id:"diasorin-liaison-xl", name:"LIAISON® XL Immunoassay Analyzer", brand:"diasorin", category:"immuno", description:"Fully automated chemiluminescent platform with up to 180 tests/hour.", featured:true },
  { id:"diasorin-vitd", name:"LIAISON® Vitamin D Total Assay", brand:"diasorin", category:"immuno", description:"Fully automated 25-OH vitamin D quantification — clinical reference standard." },
  { id:"cytek-aurora", name:"Cytek® Aurora Flow Cytometer", brand:"cytek", category:"flow", description:"Up to 5-laser, 64-color full-spectrum flow cytometer for complex panels.", featured:true },
  { id:"cytek-northernlights", name:"Cytek® Northern Lights™", brand:"cytek", category:"flow", description:"Compact spectral flow cytometer purpose-built for clinical research." },
  { id:"ngene-onco", name:"ONCOaccuPanel™ Pan-Cancer NGS", brand:"ngene", category:"ngs", description:"323-gene targeted panel covering all major solid-tumor biomarkers.", featured:true },
  { id:"hkm-centrifuge", name:"HKM High-Speed Refrigerated Centrifuge", brand:"hkm", category:"equipment", description:"Up to 21,000 × g with ±1 °C temperature control." },
  { id:"hkm-co2", name:"HKM CO₂ Incubator", brand:"hkm", category:"equipment", description:"Direct-heat 170 L incubator with HEPA-filtered chamber." },
  { id:"hkm-bsc", name:"HKM Class II Biosafety Cabinet", brand:"hkm", category:"equipment", description:"Type A2 cabinet with EN-12469 certification for BSL-2 handling." },
  { id:"bl-cd4-pe", name:"PE Anti-Human CD4 (Clone OKT4)", brand:"biolegend", category:"antibodies", description:"PE-conjugated antibody validated for flow cytometry.", featured:true },
  { id:"bl-elisa-max", name:"ELISA MAX™ Standard Set", brand:"biolegend", category:"immuno", description:"Pre-titered antibody pairs for ELISA development across hundreds of analytes." },
];

export function brandById(id: string) { return brands.find(b => b.id === id)!; }
export function categoryById(id: string) { return categories.find(c => c.id === id)!; }
export function productById(id: string) { return products.find(p => p.id === id); }
export function productsByBrand(id: string) { return products.filter(p => p.brand === id); }
export function productsByCategory(id: string) { return products.filter(p => p.category === id); }
export function featuredProducts() { return products.filter(p => p.featured); }
