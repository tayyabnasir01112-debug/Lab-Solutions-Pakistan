import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ArrowRight, ChevronRight, X, Globe, Building2,
  Tag, Layers,
  HeartPulse, FlaskConical, Dna, Beaker, Gauge, Waves,
  Microscope, TestTube, Cpu, Zap, Scale, Thermometer, Activity,
  ShieldCheck, Droplets, Search,
} from "lucide-react";
import type { Brand, Category, Product } from "@/lib/catalogue";

type CatalogueModule = typeof import("@/lib/catalogue");

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function img(path: string) { return `${BASE}${path}`; }
function brandLogoSrc(logo?: string) {
  if (!logo) return undefined;
  return logo.startsWith("/") ? img(logo) : logo;
}

function BrandMark({ brand, active = false, panel = false }: { brand: Brand; active?: boolean; panel?: boolean }) {
  const [failed, setFailed] = useState(false);
  const src = !failed ? brandLogoSrc(brand.logo) : undefined;
  const initials = brand.short
    .split(/\s+/)
    .map(part => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div
      className={`relative z-10 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-sm border bg-white shadow-sm ${
        panel ? "w-36 h-16" : "w-8 h-8"
      }`}
      style={{ borderColor: active ? "rgba(255,255,255,0.35)" : brand.accent + "35" }}
    >
      {src ? (
        <img
          src={src}
          alt={brand.short}
          className={`w-full h-full object-contain ${panel ? "p-3" : "p-1.5"}`}
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className={`font-black tracking-tight ${panel ? "text-[22px] px-3" : "text-[10px]"}`}
          style={{ color: brand.accent }}
        >
          {panel ? brand.short : initials}
        </span>
      )}
    </div>
  );
}

const NAV_LINKS = [
  { label: "Solutions", anchor: "solutions", isPage: true, href: "/solutions", hasMega: false },
  { label: "Products",  anchor: "products",  isPage: true,  href: "/products", hasMega: true },
  { label: "Events",    anchor: "events",    isPage: true,  href: "/events", hasMega: false },
  { label: "Partners",  anchor: "partners",  isPage: true, href: "/partners", hasMega: false },
  { label: "About",     anchor: "about",     isPage: true,  href: "/about",    hasMega: false },
  { label: "Contact",   anchor: "contact",   isPage: true, href: "/contact", hasMega: false },
] as const;

const SITE_SEARCH_PAGES = [
  { label: "Home", meta: "Company overview", href: "/" },
  { label: "Solutions", meta: "Application areas", href: "/solutions" },
  { label: "Products", meta: "Full catalogue", href: "/products" },
  { label: "Events", meta: "Upcoming events and gallery", href: "/events" },
  { label: "Partners", meta: "Brand network", href: "/partners" },
  { label: "About", meta: "Science Centre profile", href: "/about" },
  { label: "Contact", meta: "Enquiry and office details", href: "/contact" },
];

const SOLUTION_SEARCH_LINKS = [
  "Life Sciences",
  "Transplant Diagnostics",
  "Flow Cytometry Solutions",
  "Cell Culture Solutions",
  "Water Purification Systems",
  "NGS Solutions",
  "Allergen Solutions",
  "Biochemistry Instruments",
  "Filtration Solutions",
  "Flow Antibody Solutions",
  "General Lab Consumables",
].map(label => ({ label, meta: "Solution area", href: `/products?q=${encodeURIComponent(label)}` }));

// ─── Application Groups ────────────────────────────────────────────────────
type ApplicationGroup = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  categoryIds: string[];
  brandIds?: string[];
  tree?: {
    title: string;
    eyebrow?: string;
    items: ApplicationTreeItem[];
  }[];
};

type ApplicationTreeItem =
  | string
  | {
      label: string;
      productId?: string;
      categoryId?: string;
      query?: string;
      href?: string;
    };

// Groups catalogue categories under the client-confirmed application language.
const APPLICATION_GROUPS: readonly ApplicationGroup[] = [
  {
    id: "transplant-dx",
    label: "Transplant Diagnostics",
    icon: <HeartPulse className="h-4 w-4" />,
    color: "#e85d4a",
    description: "HLA typing, antibody detection, crossmatch, post-transplant monitoring & HLA analysis",
    categoryIds: ["transplant", "molecular", "ngs", "serological", "posttransplant", "multiplex", "equipment"],
    brandIds: ["onelambda"],
    tree: [
      {
        eyebrow: "Pre-transplant workup",
        title: "HLA Typing",
        items: [
          { label: "RTPCR", productId: "ol-linkseq-hla-kir" },
          { label: "SSO", productId: "ol-labtype-sso" },
          { label: "SSP", productId: "ol-microssp-generic" },
          { label: "Sanger based HLA typing", productId: "ol-secore-sbt" },
          { label: "NGS / NGS + ONT", productId: "ol-alltype-ngs" },
        ],
      },
      {
        eyebrow: "Pre-transplant workup",
        title: "Antibody Detection",
        items: [
          { label: "LABScreen screening (LSM12)", productId: "ol-labscreen-mica" },
          { label: "SAB identification - Class I", productId: "ol-labscreen-sa1" },
          { label: "SAB identification - Class II", productId: "ol-labscreen-sa2" },
          { label: "Auto-antibodies", categoryId: "transplant" },
          { label: "C1q screening", productId: "ol-c1qscreen" },
        ],
      },
      {
        eyebrow: "Pre-transplant workup",
        title: "HLA Crossmatch",
        items: [
          { label: "Flow DSA XM", productId: "ol-flowdsa-xm" },
          { label: "CDC reagents", productId: "ol-terasaki-trays" },
          { label: "3 color HLA FlowCrossmatch", productId: "ol-flowdsa-xm" },
        ],
      },
      {
        eyebrow: "Pre-transplant workup",
        title: "Instruments",
        items: [
          { label: "LABScan3D multiplex analyser", productId: "ol-labscan3d" },
          { label: "Luminex 200 multiplex analyser", productId: "ol-labscan100" },
          { label: "One Lambda HLA PRO automated pipettor", productId: "ol-hla-pro" },
        ],
      },
      {
        eyebrow: "Pre-transplant workup",
        title: "Analysis",
        items: [
          { label: "HLA Fusion", productId: "ol-fusion" },
          { label: "SureTyper", categoryId: "molecular" },
          { label: "TypeStream Visual", productId: "ol-typestream" },
        ],
      },
      {
        eyebrow: "Post-transplant monitoring",
        title: "Monitoring",
        items: [
          { label: "Post-transplant antibody monitoring", productId: "ol-labscreen-mixed" },
          { label: "DD-cfDNA for solid organ transplant", productId: "ol-accept-cfdna" },
          { label: "Donor chimerism for bone marrow transplant", productId: "ol-chimerism-ngs" },
        ],
      },
      {
        title: "HLA Disease Association",
        items: [
          { label: "HLA B27", categoryId: "serological" },
          { label: "Celiac disease", categoryId: "molecular" },
        ],
      },
    ],
  },
  {
    id: "flow-cytometry",
    label: "Flow Cytometry Solutions",
    icon: <Microscope className="h-4 w-4" />,
    color: "#06b6d4",
    description: "Micro-capillary, spectral, imaging flow cytometry and cell-sorting platforms",
    categoryIds: ["flow"],
    brandIds: ["cytek"],
    tree: [
      {
        title: "Micro-capillary Flow Cytometer",
        items: [
          { label: "Guava easyCyte", productId: "cytek-guava" },
          { label: "Muse", productId: "cytek-muse-micro" },
        ],
      },
      {
        title: "Spectral Flow Cytometers",
        items: [
          { label: "Aurora", productId: "cytek-aurora" },
          { label: "Northern Lights", productId: "cytek-northernlights" },
          { label: "Borealis", categoryId: "flow" },
        ],
      },
      {
        title: "Automation",
        items: [{ label: "Automated cocktail preparation instrument", productId: "cytek-orion" }],
      },
      {
        title: "Cell Sorter System",
        items: [{ label: "Spectral cell sorter system", productId: "cytek-aurora-cs" }],
      },
      {
        title: "Imaging Flow Cytometer",
        items: [{ label: "Imaging flow cytometry platform", productId: "cytek-imagestream" }],
      },
    ],
  },
  {
    id: "flow-antibodies",
    label: "Flow Antibody Solutions",
    icon: <TestTube className="h-4 w-4" />,
    color: "#a855f7",
    description: "Flow antibodies, immunology reagents and assay support for cell analysis workflows",
    categoryIds: ["antibodies", "biolegend-product-types", "biolegend-applications", "biolegend-research-areas"],
    brandIds: ["biolegend"],
  },
  {
    id: "life-sciences",
    label: "Life Sciences",
    icon: <Dna className="h-4 w-4" />,
    color: "#2fa4ff",
    description: "Research reagents, assays, instruments and molecular biology support",
    categoryIds: [
      "merck-analytical-chemistry",
      "merck-cell-culture-and-analysis",
      "merck-chemistry-and-biochemicals",
      "merck-clinical-diagnostics",
      "merck-industrial-microbiology",
      "merck-labware",
      "merck-materials-science",
      "merck-molecular-biology-and-functional-genomics",
      "molecular",
      "immuno",
      "antibodies",
      "equipment",
    ],
  },
  {
    id: "culture-media",
    label: "Culture Media Solutions",
    icon: <Beaker className="h-4 w-4" />,
    color: "#10b981",
    description: "Culture media, supplements, raw materials and lab consumables for repeatable workflows",
    categoryIds: ["hkm-culture-media", "hkm-raw-materials", "hkm-consumables", "merck-cell-culture-and-analysis"],
    brandIds: ["hkm"],
  },
  {
    id: "ngs-solutions",
    label: "Next Generation Sequencing Solutions",
    icon: <Dna className="h-4 w-4" />,
    color: "#4f7cff",
    description: "NGS typing, sequencing panels, molecular diagnostics and analysis workflows",
    categoryIds: ["ngs", "molecular"],
    brandIds: ["ngene"],
  },
  {
    id: "allergen-screening",
    label: "Allergen Screening Solutions",
    icon: <ShieldCheck className="h-4 w-4" />,
    color: "#f43f5e",
    description: "Allergy and immunoblot screening platforms, tests and interpretation support",
    categoryIds: ["sug-immunoblot-systems", "sug-immunoblot-tests", "sug-poct-tests"],
    brandIds: ["sugentech"],
  },
  {
    id: "microbead-multiplexing",
    label: "Microbead Based Multiplexing Solutions",
    icon: <Cpu className="h-4 w-4" />,
    color: "#0ea5e9",
    description: "xMAP-style multiplex analyzers, microspheres and bead-based assay development",
    categoryIds: ["multiplex", "luminex-instruments", "luminex-microspheres", "luminex-assay-development", "luminex-applications"],
    brandIds: ["luminex"],
  },
  {
    id: "biochemistry-instruments",
    label: "Bio-Chemistry Instruments",
    icon: <Gauge className="h-4 w-4" />,
    color: "#f59e0b",
    description: "pH, conductivity, DO, turbidity, titration, COD and moisture analysis instruments",
    categoryIds: ["benchtop-meters", "portable-meters", "titrators", "kf-titrators", "turbidity", "cod-meters", "electrodes", "moisture", "rex-accessories"],
    brandIds: ["rex"],
  },
  {
    id: "water-purification",
    label: "Water Purification Systems",
    icon: <Droplets className="h-4 w-4" />,
    color: "#3b82f6",
    description: "Merck Milli-Q, Elix, AFS and analyzer-feed water purification systems",
    categoryIds: ["wp-systems"],
  },
] as const;

type ViewMode = "brand" | "application" | "category";

function ProductShortcutLink({
  product,
  onClick,
  className,
  children,
}: {
  product: Product;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  if (product.brand === "biolegend" && product.specSheet) {
    return (
      <a href={product.specSheet} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={`/products/${product.id}`} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}

// Helper: get unique categories for a brand
function brandCategories(brandId: string, catalogue: CatalogueModule | null) {
  if (!catalogue) return [];
  const prods = catalogue.productsByBrand(brandId);
  const catCount: Record<string, number> = {};
  prods.forEach(p => { catCount[p.category] = (catCount[p.category] || 0) + 1; });
  return Object.entries(catCount)
    .sort((a, b) => b[1] - a[1])
    .map(([catId, count]) => ({ cat: catalogue.categoryById(catId), count, products: prods.filter(p => p.category === catId) }))
    .filter(x => x.cat);
}

// Helper: products for an application group
function appGroupProducts(groupId: string, products: Product[]) {
  const group = APPLICATION_GROUPS.find(g => g.id === groupId);
  if (!group) return [];
  return products.filter(p => group.categoryIds.includes(p.category) || group.brandIds?.includes(p.brand));
}

function appTreeItemLabel(item: ApplicationTreeItem) {
  return typeof item === "string" ? item : item.label;
}

function appTreeItemHref(item: ApplicationTreeItem) {
  if (typeof item === "string") return `/products?q=${encodeURIComponent(item)}`;
  if (item.href) return item.href;
  if (item.productId) return `/products/${item.productId}`;
  if (item.categoryId) return `/products?category=${item.categoryId}`;
  return `/products?q=${encodeURIComponent(item.query ?? item.label)}`;
}

export function SiteNavbar({
  visible = true,
  forceSolid = false,
  forceTransparent = false,
}: {
  visible?: boolean;
  forceSolid?: boolean;
  forceTransparent?: boolean;
}) {
  const [catalogue, setCatalogue]           = useState<CatalogueModule | null>(null);
  const [scrolled, setScrolled]             = useState(false);
  const [menuOpen, setMenuOpen]             = useState(false);
  const [megaOpen, setMegaOpen]             = useState(false);
  const [viewMode, setViewMode]             = useState<ViewMode>("application");
  const [activeBrand, setActiveBrand]       = useState("");
  const [activeApp, setActiveApp]           = useState(APPLICATION_GROUPS[0].id);
  const [activeCategory, setActiveCategory] = useState("");
  const [expandedCat, setExpandedCat]       = useState<string | null>(null);
  const [expandedAppSections, setExpandedAppSections] = useState<string[]>([]);
  const [leftHovered, setLeftHovered]       = useState(false);
  const [rightHovered, setRightHovered]     = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");
  const [searchOpen, setSearchOpen]         = useState(false);
  const [location, navigate]                = useLocation();
  const megaRef    = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const megaCloseTimer = useRef<number | null>(null);
  const searchCloseTimer = useRef<number | null>(null);
  const cataloguePromise = useRef<Promise<CatalogueModule> | null>(null);

  const brands = catalogue?.brands ?? [];
  const categories = catalogue?.categories ?? [];
  const products = catalogue?.products ?? [];
  const productsByBrand = useCallback((id: string) => catalogue?.productsByBrand(id) ?? [], [catalogue]);
  const productsByCategory = useCallback((id: string) => catalogue?.productsByCategory(id) ?? [], [catalogue]);
  const brandById = useCallback(
    (id: string): Brand | undefined => catalogue?.brandById(id) ?? brands.find(brand => brand.id === id),
    [brands, catalogue]
  );
  const categoryById = useCallback(
    (id: string): Category | undefined => catalogue?.categoryById(id) ?? categories.find(category => category.id === id),
    [categories, catalogue]
  );

  const loadCatalogue = useCallback(async () => {
    if (catalogue) return catalogue;
    if (!cataloguePromise.current) {
      cataloguePromise.current = import("@/lib/catalogue");
    }
    const loaded = await cataloguePromise.current;
    setCatalogue(loaded);
    setActiveBrand(prev => prev || loaded.brands[0]?.id || "");
    setActiveCategory(prev => prev || loaded.categories[0]?.id || "");
    return loaded;
  }, [catalogue]);

  const isHome     = location === "/";
  const isDarkPage = location === "/about";
  const solid      = !forceTransparent && (forceSolid || scrolled || !isDarkPage);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => { void loadCatalogue(); }, 1200);
    return () => window.clearTimeout(id);
  }, [loadCatalogue]);

  useEffect(() => { setMegaOpen(false); setMenuOpen(false); }, [location]);

  useEffect(() => {
    if (megaOpen) { document.body.style.overflow = "hidden"; }
    else          { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [megaOpen]);

  useEffect(() => {
    if (!megaOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        megaRef.current && !megaRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setMegaOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMegaOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [megaOpen]);

  useEffect(() => { setExpandedCat(null); }, [activeBrand, activeApp, activeCategory, viewMode]);

  useEffect(() => {
    setExpandedAppSections([]);
  }, [activeApp, viewMode]);

  const toggleAppSection = useCallback((key: string) => {
    setExpandedAppSections(prev => (prev.includes(key) ? [] : [key]));
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const pageMatches = SITE_SEARCH_PAGES
      .filter(item => `${item.label} ${item.meta}`.toLowerCase().includes(q))
      .map(item => ({ ...item, type: "Page" }));

    const solutionMatches = SOLUTION_SEARCH_LINKS
      .filter(item => item.label.toLowerCase().includes(q))
      .map(item => ({ ...item, type: "Solution" }));

    const brandMatches = brands
      .filter(brand => `${brand.name} ${brand.short} ${brand.blurb}`.toLowerCase().includes(q))
      .slice(0, 4)
      .map(brand => ({ label: brand.short, meta: `${productsByBrand(brand.id).length} catalogue entries`, href: `/products?brand=${brand.id}`, type: "Brand" }));

    const categoryMatches = categories
      .filter(category => category.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map(category => ({ label: category.name, meta: "Product category", href: `/products?category=${category.id}`, type: "Category" }));

    const productMatches = products
      .filter(product => {
        const brand = brandById(product.brand);
        const category = categoryById(product.category);
        return [
          product.name,
          product.description,
          product.subcategory,
          product.catalogueNumber,
          brand?.name,
          brand?.short,
          category?.name,
          ...(product.tags ?? []),
        ].filter(Boolean).join(" ").toLowerCase().includes(q);
      })
      .slice(0, 7)
      .map(product => {
        const brand = brandById(product.brand);
        const category = categoryById(product.category);
        return {
          label: product.name,
          meta: `${brand?.short ?? "Catalogue"} / ${category?.name ?? "Product"}`,
          href: `/products/${product.id}`,
          type: "Product",
        };
      });

    return [...pageMatches, ...solutionMatches, ...brandMatches, ...categoryMatches, ...productMatches].slice(0, 10);
  }, [brandById, brands, categories, categoryById, products, productsByBrand, searchQuery]);

  const clearSearchCloseTimer = useCallback(() => {
    if (searchCloseTimer.current) {
      window.clearTimeout(searchCloseTimer.current);
      searchCloseTimer.current = null;
    }
  }, []);

  const scheduleSearchClose = useCallback(() => {
    clearSearchCloseTimer();
    searchCloseTimer.current = window.setTimeout(() => setSearchOpen(false), 140);
  }, [clearSearchCloseTimer]);

  const submitSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setSearchOpen(false);
    setMenuOpen(false);
    setMegaOpen(false);
  }, [navigate, searchQuery]);

  function hrefFor(link: typeof NAV_LINKS[number]) {
    if (link.isPage && "href" in link) return link.href;
    return isHome ? `#${link.anchor}` : `/#${link.anchor}`;
  }

  const clearMegaCloseTimer = useCallback(() => {
    if (megaCloseTimer.current) {
      window.clearTimeout(megaCloseTimer.current);
      megaCloseTimer.current = null;
    }
  }, []);

  const openMega = useCallback(() => {
    clearMegaCloseTimer();
    void loadCatalogue();
    setMegaOpen(true);
  }, [clearMegaCloseTimer, loadCatalogue]);

  const closeMega = useCallback(() => {
    clearMegaCloseTimer();
    setMegaOpen(false);
  }, [clearMegaCloseTimer]);

  const scheduleMegaClose = useCallback(() => {
    clearMegaCloseTimer();
    megaCloseTimer.current = window.setTimeout(() => setMegaOpen(false), 180);
  }, [clearMegaCloseTimer]);

  // Current active brand
  const currentBrand    = brandById(activeBrand);
  const brandCats       = brandCategories(activeBrand, catalogue);
  const brandProdCount  = productsByBrand(activeBrand).length;

  // Current active app group
  const currentApp      = APPLICATION_GROUPS.find(g => g.id === activeApp)!;
  const appProds        = appGroupProducts(activeApp, products);
  const appBrands       = currentApp.brandIds?.map(id => brandById(id)).filter(Boolean) as Brand[] | undefined;
  const appHighlights   = (appProds.filter(p => p.featured).length ? appProds.filter(p => p.featured) : appProds).slice(0, 4);

  // Current active category
  const currentCat      = categoryById(activeCategory);
  const catProds        = productsByCategory(activeCategory);

  // Mode tabs config
  const MODE_TABS: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: "application", label: "By Application", icon: <Layers className="h-3.5 w-3.5" /> },
    { id: "brand",       label: "By Brand",       icon: <Tag className="h-3.5 w-3.5" /> },
  ];

  // Panel bg tints for hover effect
  const getLeftBg  = () => leftHovered  ? "bg-foreground/[0.04]" : "bg-transparent";
  const getRightBg = () => rightHovered ? "bg-foreground/[0.03]" : "bg-transparent";

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        solid ? "bg-background/95 backdrop-blur-lg border-border shadow-sm" : "bg-transparent border-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => {
            if (location === "/") {
              window.dispatchEvent(new CustomEvent("science-centre:home-top"));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center"
        >
          <img
            src={img("/images/sc-logo-full-nav.webp")}
            alt="Science Centre Logo"
            width={118}
            height={56}
            decoding="async"
            fetchPriority="high"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <div className={`hidden lg:flex items-center gap-8 text-sm font-medium ${!solid ? "text-white" : "text-foreground"}`}>
          {NAV_LINKS.map((link, i) => {
            const href = hrefFor(link);
            const Inner = (
              <motion.span
                className="relative hover:text-primary transition-colors group cursor-pointer inline-flex items-center gap-1.5"
                initial={{ opacity: 0, y: -8 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
              >
                {link.label}
                {link.hasMega && (
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </motion.span>
            );
            if (link.hasMega) {
              return (
                <button
                  key={link.label}
                  ref={triggerRef}
                  type="button"
                  onPointerEnter={openMega}
                  onFocus={openMega}
                  onMouseLeave={scheduleMegaClose}
                  onClick={() => {
                    clearMegaCloseTimer();
                    setMegaOpen(false);
                    navigate("/products");
                  }}
                  className="py-2 focus:outline-none"
                  aria-expanded={megaOpen}
                >
                  {Inner}
                </button>
              );
            }
            return link.isPage
              ? <Link key={link.label} href={href}>{Inner}</Link>
              : <a key={link.label} href={href}>{Inner}</a>;
          })}
        </div>

        {/* Search + hamburger */}
        <motion.div initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} className="flex items-center gap-3">
          <form
            onSubmit={submitSearch}
            onFocus={() => { clearSearchCloseTimer(); setSearchOpen(true); void loadCatalogue(); }}
            onBlur={scheduleSearchClose}
            className="relative hidden lg:block"
          >
            <Search className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${solid ? "text-muted-foreground" : "text-white/70"}`} />
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); void loadCatalogue(); }}
              placeholder="Search site..."
              aria-label="Search entire site"
              className={`h-11 w-64 rounded-none border pl-10 pr-3 text-sm outline-none transition-colors ${
                solid
                  ? "border-border bg-background/90 text-foreground placeholder:text-muted-foreground focus:border-primary"
                  : "border-white/25 bg-white/10 text-white placeholder:text-white/65 focus:border-cyan-100"
              }`}
            />
            <AnimatePresence>
              {searchOpen && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-[calc(100%+10px)] w-[360px] border border-border bg-background text-foreground shadow-2xl"
                  onMouseEnter={clearSearchCloseTimer}
                  onMouseLeave={scheduleSearchClose}
                >
                  {searchResults.length ? (
                    <div className="max-h-[420px] overflow-y-auto p-2">
                      {searchResults.map(result => (
                        <Link
                          key={`${result.type}-${result.href}-${result.label}`}
                          href={result.href}
                          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                          className="group grid grid-cols-[1fr_auto] gap-3 border-b border-border/70 px-3 py-3 last:border-b-0 hover:bg-muted/60"
                        >
                          <span>
                            <span className="block text-sm font-bold leading-snug group-hover:text-primary">{result.label}</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">{result.meta}</span>
                          </span>
                          <span className="self-start text-[10px] font-black uppercase text-primary">{result.type}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <button type="submit" className="block w-full px-4 py-4 text-left text-sm hover:bg-muted">
                      Search products for <span className="font-bold">"{searchQuery.trim()}"</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          <button className="lg:hidden p-2" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
            <motion.div animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className={`mb-1.5 h-0.5 w-5 origin-center ${solid ? "bg-foreground" : "bg-white"}`} />
            <motion.div animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className={`mb-1.5 h-0.5 w-5 ${solid ? "bg-foreground" : "bg-white"}`} />
            <motion.div animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className={`h-0.5 w-5 origin-center ${solid ? "bg-foreground" : "bg-white"}`} />
          </button>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MEGA MENU
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            key="mega"
            ref={megaRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block absolute left-0 right-0 top-full bg-background border-b border-border shadow-2xl"
            onWheel={e => e.stopPropagation()}
            onMouseEnter={clearMegaCloseTimer}
            onMouseLeave={scheduleMegaClose}
          >
            {/* ── Top bar: mode switcher tabs ───────────────────── */}
            <div className="border-b border-border/60">
              <div className="container mx-auto px-6 md:px-12 flex items-center justify-between h-12">

                {/* Mode tabs */}
                <div className="flex items-center gap-0.5">
                  {MODE_TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id)}
                      className={`relative h-12 flex items-center gap-2 px-4 text-[12px] font-semibold transition-all duration-200 ${
                        viewMode === tab.id
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground/70"
                      }`}
                    >
                      <span className={`transition-colors duration-200 ${viewMode === tab.id ? "text-primary" : ""}`}>
                        {tab.icon}
                      </span>
                      {tab.label}
                      {/* active underline */}
                      {viewMode === tab.id && (
                        <motion.div
                          layoutId="modeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        />
                      )}
                    </button>
                  ))}

                  {/* Divider */}
                  <div className="w-px h-5 bg-border mx-2" />

                  <span className="text-[11px] text-muted-foreground">
                    <strong className="text-foreground font-bold">{products.length}</strong> products ·{" "}
                    <strong className="text-foreground font-bold">{brands.length}</strong> manufacturers
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Link href="/products" onClick={closeMega}
                    className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary hover:text-primary/80 inline-flex items-center gap-1">
                    Browse All <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button onClick={closeMega} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Body ──────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="container mx-auto px-6 md:px-12"
              >
                <div className="grid grid-cols-12" style={{ height: "420px" }}>

                  {/* ── LEFT PANEL ──────────────────────────────── */}
                  <div
                    className={`col-span-3 border-r border-border py-3 pr-3 overflow-y-auto h-full transition-colors duration-300 ${getLeftBg()}`}
                    style={{ overscrollBehavior: "contain" }}
                    onWheel={e => e.stopPropagation()}
                    onMouseEnter={() => setLeftHovered(true)}
                    onMouseLeave={() => setLeftHovered(false)}
                  >
                    {/* ── BY BRAND ── */}
                    {!catalogue && (
                      <div className="px-3 py-8 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Loading catalogue...
                      </div>
                    )}

                    {catalogue && viewMode === "brand" && (
                      <>
                        <div className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground px-3 mb-3">Manufacturers</div>
                        <div className="space-y-0.5">
                          {brands.map(b => {
                            const count = productsByBrand(b.id).length;
                            const isActive = activeBrand === b.id;
                            return (
                              <button
                                key={b.id}
                                onMouseEnter={() => setActiveBrand(b.id)}
                                onClick={() => setActiveBrand(b.id)}
                                className={`w-full text-left flex items-center gap-3 px-3 py-3 transition-all rounded-sm group relative overflow-hidden ${
                                  isActive ? "text-background" : "hover:bg-muted/50 text-foreground"
                                }`}
                              >
                                {/* Full-row fill for active */}
                                {isActive && (
                                  <motion.div
                                    layoutId="brandActiveBg"
                                    className="absolute inset-0 rounded-sm"
                                    style={{ background: b.accent }}
                                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                                  />
                                )}
                                {/* Accent bar */}
                                {!isActive && (
                                  <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ background: b.accent }} />
                                )}

                                <BrandMark brand={b} active={isActive} />

                                <div className="relative z-10 flex-1 min-w-0">
                                  <div className={`text-[13px] font-semibold leading-tight truncate ${isActive ? "text-white" : "text-foreground"}`}>
                                    {b.short}
                                  </div>
                                  <div className={`text-[10px] tabular-nums mt-0.5 ${isActive ? "text-white/60" : "text-muted-foreground"}`}>
                                    {count} {count === 1 ? "product" : "products"}
                                  </div>
                                </div>

                                <ChevronRight className={`relative z-10 h-3.5 w-3.5 flex-shrink-0 transition-all ${isActive ? "text-white/60 translate-x-0.5" : "text-muted-foreground/40 group-hover:translate-x-0.5"}`} />
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* ── BY APPLICATION ── */}
                    {catalogue && viewMode === "application" && (
                      <>
                        <div className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground px-3 mb-3">Application Areas</div>
                        <div className="space-y-0.5">
                          {APPLICATION_GROUPS.map(app => {
                            const count = appGroupProducts(app.id, products).length;
                            const isActive = activeApp === app.id;
                            return (
                              <button
                                key={app.id}
                                onMouseEnter={() => setActiveApp(app.id)}
                                onClick={() => setActiveApp(app.id)}
                                className={`w-full text-left flex items-center gap-3 px-3 py-3 transition-all rounded-sm group relative overflow-hidden ${
                                  isActive ? "text-white" : "hover:bg-muted/50 text-foreground"
                                }`}
                              >
                                {isActive && (
                                  <motion.div
                                    layoutId="appActiveBg"
                                    className="absolute inset-0 rounded-sm"
                                    style={{ background: app.color }}
                                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                                  />
                                )}
                                {!isActive && (
                                  <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ background: app.color }} />
                                )}

                                <div className={`relative z-10 w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-sm transition-colors`}
                                  style={{ background: isActive ? "rgba(255,255,255,0.2)" : app.color + "15", color: isActive ? "#fff" : app.color }}>
                                  {app.icon}
                                </div>

                                <div className="relative z-10 flex-1 min-w-0">
                                  <div className={`text-[12px] font-semibold leading-tight ${isActive ? "text-white" : "text-foreground"}`}>
                                    {app.label}
                                  </div>
                                  <div className={`text-[10px] mt-0.5 ${isActive ? "text-white/60" : "text-muted-foreground"}`}>
                                    {count} products
                                  </div>
                                </div>

                                <ChevronRight className={`relative z-10 h-3.5 w-3.5 flex-shrink-0 transition-all ${isActive ? "text-white/60 translate-x-0.5" : "text-muted-foreground/40 group-hover:translate-x-0.5"}`} />
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* ── BY CATEGORY ── */}
                    {catalogue && viewMode === "category" && (
                      <>
                        <div className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground px-3 mb-3">Product Categories</div>
                        <div className="space-y-0.5">
                          {categories.map(cat => {
                            const count = productsByCategory(cat.id).length;
                            if (count === 0) return null;
                            const isActive = activeCategory === cat.id;
                            return (
                              <button
                                key={cat.id}
                                onMouseEnter={() => setActiveCategory(cat.id)}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 transition-all rounded-sm group relative overflow-hidden ${
                                  isActive ? "text-white" : "hover:bg-muted/50 text-foreground"
                                }`}
                              >
                                {isActive && (
                                  <motion.div
                                    layoutId="catActiveBg"
                                    className="absolute inset-0 rounded-sm bg-foreground"
                                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                                  />
                                )}
                                <span className={`relative z-10 flex-shrink-0 ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
                                  {cat.icon}
                                </span>
                                <span className={`relative z-10 flex-1 text-[12px] font-medium text-left leading-tight ${isActive ? "text-white" : "text-foreground"}`}>
                                  {cat.name}
                                </span>
                                <span className={`relative z-10 text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full ${
                                  isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                                }`}>
                                  {count}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* ── RIGHT PANEL ─────────────────────────────── */}
                  <div
                    className={`col-span-9 overflow-y-auto h-full transition-colors duration-300 ${getRightBg()}`}
                    style={{ overscrollBehavior: "contain" }}
                    onWheel={e => e.stopPropagation()}
                    onMouseEnter={() => setRightHovered(true)}
                    onMouseLeave={() => setRightHovered(false)}
                  >
                    <AnimatePresence initial={false}>
                      {!catalogue && (
                        <motion.div
                          key="catalogue-loading"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                          className="flex h-full flex-col items-center justify-center px-8 text-center"
                        >
                          <div className="mb-3 h-1.5 w-28 overflow-hidden bg-muted">
                            <div className="h-full w-1/2 animate-pulse bg-primary" />
                          </div>
                          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                            Preparing product catalogue
                          </div>
                        </motion.div>
                      )}

                      {/* ── BRAND DETAIL ── */}
                      {catalogue && viewMode === "brand" && currentBrand && (
                        <motion.div
                          key={`brand-${activeBrand}`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.18 }}
                          className="py-4 pl-6 pr-2 flex flex-col h-full"
                        >
                          {/* Brand intro */}
                          <div className="flex items-start gap-5 mb-4 pb-4 border-b border-border flex-shrink-0">
                            <BrandMark brand={currentBrand} panel />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-[var(--app-font-heading)] font-black text-[15px] text-foreground leading-tight mb-1.5">
                                {currentBrand.name}
                              </h3>
                              <p className="text-[12px] text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                                {currentBrand.longBlurb || currentBrand.blurb}
                              </p>
                              <div className="flex flex-wrap items-center gap-3">
                                {currentBrand.founded && (
                                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <Building2 className="h-3 w-3" /> Est. {currentBrand.founded}
                                  </span>
                                )}
                                {currentBrand.hq && (
                                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <Globe className="h-3 w-3" /> {currentBrand.hq}
                                  </span>
                                )}
                                <Link href={`/products?brand=${activeBrand}`} onClick={closeMega}
                                  className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] px-3 py-1.5 text-white flex-shrink-0"
                                  style={{ background: currentBrand.accent }}>
                                  All {brandProdCount} Products <ArrowRight className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Categories grid */}
                          <div className="flex-1 min-h-0">
                            <div className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-3">Product Categories</div>
                            <div className="grid grid-cols-2 gap-2 items-start">
                              {[0, 1].map(column => (
                                <div key={column} className="space-y-2">
                                  {brandCats.filter((_, index) => index % 2 === column).map(({ cat, count, products: catProds }) => {
                                    if (!cat) return null;
                                    const isExpanded = expandedCat === cat.id;
                                    return (
                                      <div key={cat.id} className="border border-border overflow-hidden bg-background">
                                        <button
                                          onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                                          className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-all ${
                                            isExpanded ? "bg-foreground text-background" : "hover:bg-muted/60"
                                          }`}
                                        >
                                          <span className={`text-base transition-colors ${isExpanded ? "text-background/70" : "text-muted-foreground"}`}>{cat.icon}</span>
                                          <span className={`flex-1 text-[13px] font-semibold text-left ${isExpanded ? "text-background" : "text-foreground"}`}>{cat.name}</span>
                                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${isExpanded ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"}`}>{count}</span>
                                          <ChevronRight className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${isExpanded ? "rotate-90 text-background/60" : "text-muted-foreground/40"}`} />
                                        </button>
                                        <AnimatePresence>
                                          {isExpanded && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                                              transition={{ duration: 0.18 }} className="overflow-hidden border-t border-border">
                                              <div className="divide-y divide-border/50 bg-muted/20">
                                                {catProds.slice(0, 5).map(p => (
                                                  <ProductShortcutLink key={p.id} product={p} onClick={closeMega}
                                                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-background transition-colors group">
                                                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: currentBrand.accent }} />
                                                    <span className="text-[12px] text-foreground/80 group-hover:text-primary transition-colors leading-snug flex-1 line-clamp-1">{p.name}</span>
                                                    <ArrowRight className="h-2.5 w-2.5 text-muted-foreground/30 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                                                  </ProductShortcutLink>
                                                ))}
                                                {catProds.length > 5 && (
                                                  <Link href={`/products?brand=${activeBrand}&category=${cat.id}`} onClick={closeMega}
                                                    className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-primary hover:bg-background transition-colors">
                                                    +{catProds.length - 5} more <ArrowRight className="h-3 w-3" />
                                                  </Link>
                                                )}
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ── APPLICATION DETAIL ── */}
                      {catalogue && viewMode === "application" && (
                        <motion.div
                          key={`app-${activeApp}`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.18 }}
                          className="py-4 pl-6 pr-2 flex flex-col h-full"
                        >
                          {/* App header */}
                          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border flex-shrink-0">
                            <div className="w-12 h-12 flex items-center justify-center rounded-sm flex-shrink-0"
                              style={{ background: currentApp.color + "15", color: currentApp.color }}>
                              <span className="scale-150">{currentApp.icon}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-[var(--app-font-heading)] font-black text-[15px] text-foreground leading-tight">{currentApp.label}</h3>
                              <p className="text-[12px] text-muted-foreground mt-0.5">{currentApp.description}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[11px] font-bold px-2.5 py-1.5 text-white rounded-sm" style={{ background: currentApp.color }}>
                                {appProds.length} products
                              </span>
                              <Link href={`/products?q=${encodeURIComponent(currentApp.label)}`} onClick={closeMega}
                                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.1em] px-2.5 py-1.5 border border-border hover:bg-muted transition-colors text-foreground">
                                Browse All <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>

                          <div className="grid grid-cols-[1.45fr_0.85fr] gap-4 flex-1 min-h-0">
                            <div className="min-h-0">
                              <div className="flex items-center justify-between mb-3">
                                <div className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground">Brand Application Tree</div>
                                {appBrands?.length ? (
                                  <div className="flex items-center gap-1.5">
                                    {appBrands.map(brand => (
                                      <span
                                        key={brand.id}
                                        className="px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white"
                                        style={{ background: brand.accent }}
                                      >
                                        {brand.short}
                                      </span>
                                    ))}
                                  </div>
                                ) : null}
                              </div>

                              {currentApp.tree?.length ? (
                                <div className="space-y-2 pr-1 max-h-[270px] overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
                                  {currentApp.tree.map(section => {
                                    const sectionKey = `${currentApp.id}:${section.title}`;
                                    const isExpanded = expandedAppSections.includes(sectionKey);
                                    return (
                                      <div key={sectionKey} className="border border-border bg-background overflow-hidden">
                                        <button
                                          type="button"
                                          onClick={() => toggleAppSection(sectionKey)}
                                          className={`group flex w-full items-start gap-2 p-3 text-left transition-colors ${
                                            isExpanded ? "bg-muted/60" : "hover:bg-muted/40"
                                          }`}
                                          aria-expanded={isExpanded}
                                        >
                                          <div className="mt-1 h-8 w-0.5 flex-shrink-0" style={{ background: currentApp.color }} />
                                          <div className="min-w-0 flex-1">
                                            {section.eyebrow && (
                                              <div className="mb-1 text-[8px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                                                {section.eyebrow}
                                              </div>
                                            )}
                                            <h4 className="text-[12px] font-black text-foreground leading-tight group-hover:text-primary">{section.title}</h4>
                                          </div>
                                          <ChevronDown
                                            className={`mt-1 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform ${
                                              isExpanded ? "rotate-180" : ""
                                            }`}
                                          />
                                        </button>
                                        <AnimatePresence initial={false}>
                                          {isExpanded && (
                                            <motion.div
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: "auto", opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              transition={{ duration: 0.18 }}
                                              className="overflow-hidden border-t border-border bg-muted/20"
                                            >
                                              <div className="flex flex-wrap gap-1.5 p-3">
                                                {section.items.map(item => {
                                                  const itemLabel = appTreeItemLabel(item);
                                                  return (
                                                    <Link
                                                      key={`${section.title}-${itemLabel}`}
                                                      href={appTreeItemHref(item)}
                                                      onClick={closeMega}
                                                      className="group/item inline-flex items-center gap-1 border border-border bg-background px-2 py-1 text-[10px] font-medium leading-tight text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                                                    >
                                                      {itemLabel}
                                                      <ArrowRight className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover/item:opacity-100" />
                                                    </Link>
                                                  );
                                                })}
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="space-y-2 pr-1 max-h-[270px] overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
                                  {currentApp.categoryIds.slice(0, 8).map(categoryId => {
                                    const category = categoryById(categoryId);
                                    const categoryProducts = appProds.filter(product => product.category === categoryId);
                                    const count = categoryProducts.length;
                                    if (!category || count === 0) return null;
                                    const sectionKey = `${currentApp.id}:category:${categoryId}`;
                                    const isExpanded = expandedAppSections.includes(sectionKey);
                                    const subcategories = Array.from(new Set(categoryProducts.map(product => product.subcategory).filter(Boolean))).slice(0, 6);
                                    return (
                                      <div
                                        key={categoryId}
                                        className="border border-border bg-background overflow-hidden"
                                      >
                                        <button
                                          type="button"
                                          onClick={() => toggleAppSection(sectionKey)}
                                          className={`group flex w-full items-start gap-2 p-3 text-left transition-colors ${
                                            isExpanded ? "bg-muted/60" : "hover:bg-muted/40"
                                          }`}
                                          aria-expanded={isExpanded}
                                        >
                                          <span className="mt-0.5 flex-shrink-0" style={{ color: currentApp.color }}>{category.icon}</span>
                                          <span className="min-w-0 flex-1">
                                            <span className="block text-[12px] font-black text-foreground group-hover:text-primary">{category.name}</span>
                                            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                                              {count} catalogue entries
                                            </span>
                                          </span>
                                          <ChevronDown
                                            className={`mt-1 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform ${
                                              isExpanded ? "rotate-180" : ""
                                            }`}
                                          />
                                        </button>
                                        <AnimatePresence initial={false}>
                                          {isExpanded && (
                                            <motion.div
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: "auto", opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              transition={{ duration: 0.18 }}
                                              className="overflow-hidden border-t border-border bg-muted/20"
                                            >
                                              <div className="flex flex-wrap gap-1.5 p-3">
                                                {subcategories.length ? subcategories.map(subcategory => (
                                                  <Link
                                                    key={`${categoryId}-${subcategory}`}
                                                    href={`/products?q=${encodeURIComponent(subcategory)}`}
                                                    onClick={closeMega}
                                                    className="group/item inline-flex items-center gap-1 border border-border bg-background px-2 py-1 text-[10px] font-medium leading-tight text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                                                  >
                                                    {subcategory}
                                                    <ArrowRight className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover/item:opacity-100" />
                                                  </Link>
                                                )) : (
                                                  <span className="text-[10px] text-muted-foreground">No subcategory labels in catalogue yet.</span>
                                                )}
                                                <Link
                                                  href={`/products?category=${categoryId}`}
                                                  onClick={closeMega}
                                                  className="inline-flex items-center gap-1 border border-primary/30 bg-primary/5 px-2 py-1 text-[10px] font-bold leading-tight text-primary transition-colors hover:bg-primary/10"
                                                >
                                                  Browse category <ArrowRight className="h-2.5 w-2.5" />
                                                </Link>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            <div className="min-h-0 border-l border-border pl-4">
                              <div className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-3">Catalogue Highlights</div>
                              <div className="space-y-2">
                                {appHighlights.map(p => {
                                  const brand = brandById(p.brand);
                                  const category = categoryById(p.category);
                                  return (
                                    <ProductShortcutLink
                                      key={p.id}
                                      product={p}
                                      onClick={closeMega}
                                      className="group block border border-border bg-background p-3 hover:bg-muted/50 transition-colors"
                                    >
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: brand?.accent ?? currentApp.color }} />
                                        <span className="text-[8px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                                          {brand?.short} / {category?.name}
                                        </span>
                                      </div>
                                      <div className="text-[12px] font-semibold leading-snug text-foreground group-hover:text-primary line-clamp-2">{p.name}</div>
                                    </ProductShortcutLink>
                                  );
                                })}
                              </div>
                              <Link href={`/products?q=${encodeURIComponent(currentApp.label)}`} onClick={closeMega}
                                className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors">
                                Browse this application <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ── CATEGORY DETAIL ── */}
                      {catalogue && viewMode === "category" && currentCat && (
                        <motion.div
                          key={`cat-${activeCategory}`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.18 }}
                          className="py-4 pl-6 pr-2 flex flex-col h-full"
                        >
                          {/* Category header */}
                          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border flex-shrink-0">
                            <div className="w-10 h-10 flex items-center justify-center rounded-sm bg-muted text-muted-foreground flex-shrink-0">
                              <span className="scale-125">{currentCat.icon}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-[var(--app-font-heading)] font-black text-[15px] text-foreground">{currentCat.name}</h3>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{catProds.length} products available</p>
                            </div>
                            <Link href={`/products?category=${activeCategory}`} onClick={closeMega}
                              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 bg-foreground text-background hover:bg-foreground/90 transition-colors flex-shrink-0">
                              View All <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>

                          {/* Products grid */}
                          <div className="flex-1 min-h-0">
                            <div className="grid grid-cols-2 gap-1.5">
                              {catProds.slice(0, 12).map(p => {
                                const brand = brandById(p.brand);
                                return (
                                  <ProductShortcutLink key={p.id} product={p} onClick={closeMega}
                                    className="group flex items-center gap-3 p-2.5 hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                                    <div className="w-1 h-6 flex-shrink-0 rounded-full" style={{ background: brand?.accent || "#999" }} />
                                    <div className="flex-1 min-w-0">
                                      <span className="text-[9px] font-black uppercase tracking-[0.12em] text-muted-foreground">{brand?.short}</span>
                                      <p className="text-[12px] text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-1">{p.name}</p>
                                    </div>
                                    <ArrowRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                                  </ProductShortcutLink>
                                );
                              })}
                            </div>
                            {catProds.length > 12 && (
                              <Link href={`/products?category=${activeCategory}`} onClick={closeMega}
                                className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors">
                                +{catProds.length - 12} more in {currentCat.name} <ArrowRight className="h-3 w-3" />
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Mobile menu ─────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-background border-t border-border"
          >
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const href = hrefFor(link);
                const onClose = () => { setMenuOpen(false); setMobileProductsOpen(false); };
                if (link.hasMega) {
                  return (
                    <div key={link.label}>
                      <button
                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                        className="flex items-center justify-between w-full text-left py-3 text-sm font-medium text-foreground hover:text-primary"
                      >
                        {link.label}
                        <ChevronDown className={`h-4 w-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {mobileProductsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-3 pb-3 border-l-2 border-primary/20 ml-1 space-y-4"
                          >
                            <Link href="/products" onClick={onClose} className="block text-sm font-bold text-primary py-1 mt-2">
                              Browse All Products →
                            </Link>
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">By Application</div>
                              <div className="space-y-0.5">
                                {APPLICATION_GROUPS.map(app => (
                                  <Link key={app.id} href={`/products?q=${encodeURIComponent(app.label)}`} onClick={onClose}
                                    className="flex items-center gap-2 text-[12px] text-foreground/80 hover:text-primary py-1.5 rounded-sm">
                                    <span style={{ color: app.color }}>{app.icon}</span>
                                    <span>{app.label}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">By Brand</div>
                              <div className="space-y-0.5">
                                {brands.map(b => (
                                  <Link key={b.id} href={`/products?brand=${b.id}`} onClick={onClose}
                                    className="flex items-center gap-2.5 text-[13px] text-foreground/80 hover:text-primary py-1.5 px-2 hover:bg-muted/50 transition-colors rounded-sm">
                                    <span className="w-2 h-2 flex-shrink-0 rounded-full" style={{ background: b.accent }} />
                                    <span className="font-medium flex-1">{b.short}</span>
                                    <span className="text-[11px] text-muted-foreground">{productsByBrand(b.id).length}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return link.isPage
                  ? <Link key={link.label} href={href} onClick={onClose} className="block py-3 text-sm font-medium text-foreground hover:text-primary">{link.label}</Link>
                  : <a key={link.label} href={href} onClick={onClose} className="block py-3 text-sm font-medium text-foreground hover:text-primary">{link.label}</a>;
              })}
              <form onSubmit={submitSearch} className="relative mt-4 border-t border-border pt-5">
                <Search className="absolute left-3 top-[42px] h-4 w-4 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, solutions..."
                  aria-label="Search entire site"
                  className="h-12 w-full rounded-none border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary"
                />
                {searchQuery.trim() && searchResults.length > 0 && (
                  <div className="mt-3 max-h-64 overflow-y-auto border border-border">
                    {searchResults.slice(0, 5).map(result => (
                      <Link
                        key={`mobile-${result.type}-${result.href}-${result.label}`}
                        href={result.href}
                        onClick={() => { setMenuOpen(false); setSearchOpen(false); setSearchQuery(""); }}
                        className="block border-b border-border px-3 py-3 last:border-b-0"
                      >
                        <span className="block text-sm font-bold">{result.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{result.type} / {result.meta}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
