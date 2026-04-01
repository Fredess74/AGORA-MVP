# Stage 1: Build
FROM rust:1.75-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy workspace files
COPY Cargo.toml Cargo.lock ./
COPY packages ./packages

# Build release binary
RUN cargo build --release --package agora-api

# Stage 2: Runtime
FROM debian:bookworm-slim AS runtime

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -r -s /bin/false agora

# Copy binary
COPY --from=builder /app/target/release/agora-api /usr/local/bin/

# Set ownership
RUN chown -R agora:agora /app

# Switch to non-root user
USER agora

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/v1/health || exit 1

# Run
ENTRYPOINT ["agora-api"]
