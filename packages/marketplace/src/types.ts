/* ═══════════════════════════════════════════════════════════
   Agora Marketplace — Core Types
   ═══════════════════════════════════════════════════════════ */

export type ProductType = 'mcp_server' | 'ai_agent' | 'automation';
export type PricingModel = 'free' | 'per_call' | 'subscription';
export type TrustLevel = 'high' | 'medium' | 'low';

export interface Product {
    id: string;
    did: string;
    type: ProductType;
    name: string;
    slug: string;
    description: string;
    author: string;
    authorAvatar?: string;
    githubRepo?: string;

    // Pricing
    pricingModel: PricingModel;
    pricePerCallUsd?: number;
    subscriptionPriceUsd?: number;
    freetierCalls?: number;

    // Trust
    trustScore: number;
    trustLevel: TrustLevel;
    trustConfidence: 'low' | 'medium' | 'high';

    // Metrics
    totalCalls: number;
    totalUsers: number;
    avgLatencyMs: number;
    uptime: number; // 0-100

    // Metadata
    category: string;
    tags: string[];
    rating: number; // 1-5
    reviewCount: number;
    createdAt: string;
    status?: 'draft' | 'active' | 'suspended' | 'archived';
}

export interface User {
    id: string;
    githubId: number;
    username: string;
    email?: string;
    avatarUrl?: string;
    role: 'creator' | 'buyer' | 'admin';
    stripeAccountId?: string;
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    username: string;
    avatarUrl?: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    count: number;
}
