/* ═══════════════════════════════════════════════════════════
   Zustand Store — Connected to Supabase
   ═══════════════════════════════════════════════════════════ */

import { create } from 'zustand';
import { Product, User, Category } from '../types';
import { fetchProducts, getCurrentUser, signOut as supabaseSignOut } from '../lib/database';
import { supabase } from '../lib/supabase';

interface AppState {
    // Products
    products: Product[];
    filteredProducts: Product[];
    activeCategory: string;
    searchQuery: string;
    isLoading: boolean;

    // Categories
    categories: Category[];

    // User
    user: User | null;
    isAuthenticated: boolean;

    // Actions
    loadProducts: () => Promise<void>;
    setCategory: (category: string) => void;
    setSearchQuery: (query: string) => void;
    initAuth: () => Promise<void>;
    login: (user: User) => void;
    logout: () => Promise<void>;
}

const DEFAULT_CATEGORIES: Category[] = [
    { id: 'all', name: 'All', icon: '🌐', count: 0 },
    { id: 'mcp_server', name: 'MCP Servers', icon: '🔌', count: 0 },
    { id: 'ai_agent', name: 'AI Agents', icon: '🤖', count: 0 },
    { id: 'automation', name: 'Automations', icon: '⚡', count: 0 },
];

function filterProducts(products: Product[], category: string, query: string): Product[] {
    let result = products;

    if (category !== 'all') {
        result = result.filter((p) => p.type === category);
    }

    if (query.trim()) {
        const q = query.toLowerCase();
        result = result.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.tags.some((t) => t.toLowerCase().includes(q)) ||
                p.author.toLowerCase().includes(q)
        );
    }

    return result;
}

export const useStore = create<AppState>((set, get) => ({
    products: [],
    filteredProducts: [],
    activeCategory: 'all',
    searchQuery: '',
    isLoading: true,
    categories: DEFAULT_CATEGORIES,

    user: null,
    isAuthenticated: false,

    loadProducts: async () => {
        set({ isLoading: true });
        const products = await fetchProducts();
        const { activeCategory, searchQuery } = get();

        // Update category counts
        const categories = DEFAULT_CATEGORIES.map((cat) => ({
            ...cat,
            count: cat.id === 'all' ? products.length : products.filter((p) => p.type === cat.id).length,
        }));

        set({
            products,
            filteredProducts: filterProducts(products, activeCategory, searchQuery),
            categories,
            isLoading: false,
        });
    },

    setCategory: (category) =>
        set((state) => ({
            activeCategory: category,
            filteredProducts: filterProducts(state.products, category, state.searchQuery),
        })),

    setSearchQuery: (query) =>
        set((state) => ({
            searchQuery: query,
            filteredProducts: filterProducts(state.products, state.activeCategory, query),
        })),

    initAuth: async () => {
        // Listen for auth state changes
        supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const user = await getCurrentUser();
                if (user) set({ user, isAuthenticated: true });
            } else {
                set({ user: null, isAuthenticated: false });
            }
        });

        // Check current session
        const user = await getCurrentUser();
        if (user) set({ user, isAuthenticated: true });
    },

    login: (user) => set({ user, isAuthenticated: true }),

    logout: async () => {
        await supabaseSignOut();
        set({ user: null, isAuthenticated: false });
    },
}));
