export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  imagePublicId?: string;
  displayOrder: number;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  imagePublicId?: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductSpecification {
  id: string;
  specKey: string;
  specValue: string;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  diameter?: string;
  grade?: string;
  thickness?: string;
  length?: string;
  size?: string;
  weight?: string;
  finish?: string;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  brandId?: string;
  shortDescription?: string;
  fullDescription?: string;
  primarySpecification?: string;
  availableUnits?: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  availabilityStatus: 'AVAILABLE' | 'LIMITED' | 'ON_REQUEST' | 'UNAVAILABLE';
  createdAt: string;
  updatedAt: string;
  category?: Category;
  brand?: Brand;
  images?: ProductImage[];
  specifications?: ProductSpecification[];
  variants?: ProductVariant[];
  relatedProducts?: Product[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    enquiries: number;
  };
  enquiries?: Enquiry[];
}

export interface EnquiryStatusHistory {
  id: string;
  enquiryId: string;
  previousStatus: string;
  newStatus: string;
  note?: string;
  createdAt: string;
  changedBy?: {
    id: string;
    name: string;
  };
}

export interface Enquiry {
  id: string;
  enquiryNumber: string;
  customerId: string;
  productId?: string;
  variantId?: string;
  quantity?: number;
  unit?: string;
  location?: string;
  message?: string;
  sourcePage?: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTATION_SENT' | 'NEGOTIATION' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  assignedUserId?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  product?: Product;
  variant?: ProductVariant;
  assignedStaff?: User;
  statusHistory?: EnquiryStatusHistory[];
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  bgImageUrl: string;
  bgImagePublicId?: string;
  fgImageUrl?: string;
  fgImagePublicId?: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface DashboardOverview {
  overview: {
    totalEnquiries: number;
    newEnquiries: number;
    contactedEnquiries: number;
    quotationSentEnquiries: number;
    confirmedEnquiries: number;
    completedEnquiries: number;
    totalProducts: number;
    activeProducts: number;
    totalCategories: number;
    totalCustomers: number;
    conversionRate: string;
  };
  statusBreakdown: { status: string; count: number }[];
  topProducts: { product: { id: string; name: string; slug: string } | null; count: number }[];
  recentEnquiries: Enquiry[];
}
