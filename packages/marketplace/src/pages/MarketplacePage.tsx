import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';

export default function MarketplacePage() {
    const { filteredProducts, activeCategory, searchQuery, categories, isLoading, setCategory, setSearchQuery } = useStore();

    return (
        <div className="page container">
            {/* Header */}
            <div className="marketplace-header">
                <h1 className="marketplace-header__title">Marketplace</h1>
                <div className="search-bar">
                    <span className="search-bar__icon">🔍</span>
                    <input
                        type="text"
                        className="input"
                        placeholder="Search agents, servers, automations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="categories">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`tag tag--category ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setCategory(cat.id)}
                    >
                        {cat.icon} {cat.name} {cat.count > 0 && `(${cat.count})`}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        border: '3px solid var(--color-border)',
                        borderTopColor: 'var(--color-primary)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        margin: '0 auto var(--space-6)',
                    }} />
                    <p style={{ color: 'var(--color-text-muted)' }}>Loading products...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {/* Results */}
            {!isLoading && filteredProducts.length > 0 && (
                <div className="grid-products">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: 'var(--space-16) 0', color: 'var(--color-text-muted)' }}>
                    <div style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-4)' }}>🏛️</div>
                    <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>
                        {searchQuery ? 'No products found' : 'No listings yet'}
                    </h3>
                    <p>{searchQuery ? 'Try adjusting your search or category filter.' : 'Be the first to publish your AI agent or MCP server.'}</p>
                </div>
            )}

            {/* Results Count */}
            {!isLoading && (
                <div style={{ marginTop: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                    Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
}
