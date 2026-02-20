// k6 Load Test Configuration for Agora Trust API
// Run: k6 run tests/load/api-load-test.js --vus 50 --duration 5m

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const registerTrend = new Trend('register_duration');
const trustQueryTrend = new Trend('trust_query_duration');
const eventReportTrend = new Trend('event_report_duration');

// Configuration
const BASE_URL = __ENV.API_URL || 'http://localhost:8080';
const API_KEY = __ENV.API_KEY || 'agora_test_key_12345';

// Test options
export const options = {
    stages: [
        { duration: '30s', target: 10 },  // Ramp up to 10 users
        { duration: '1m', target: 50 },   // Stay at 50 users
        { duration: '2m', target: 100 },  // Peak load
        { duration: '1m', target: 50 },   // Scale down
        { duration: '30s', target: 0 },   // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
        http_req_failed: ['rate<0.01'],    // <1% error rate
        errors: ['rate<0.05'],             // <5% custom errors
    },
};

// Generate random DID
function generateDID() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let suffix = '';
    for (let i = 0; i < 32; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `did:agora:${suffix}`;
}

// Generate random public key (hex)
function generatePublicKey() {
    const chars = '0123456789abcdef';
    let key = '';
    for (let i = 0; i < 64; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

const headers = {
    'Content-Type': 'application/json',
    'X-Agora-Key': API_KEY,
};

export default function () {
    const testDID = generateDID();
    const counterpartyDID = generateDID();

    group('Health Check', () => {
        const res = http.get(`${BASE_URL}/v1/health`);
        check(res, {
            'health check status is 200': (r) => r.status === 200,
            'health check is healthy': (r) => {
                try {
                    const body = JSON.parse(r.body);
                    return body.status === 'healthy';
                } catch (e) {
                    return false;
                }
            },
        }) || errorRate.add(1);
    });

    group('Agent Registration', () => {
        const payload = JSON.stringify({
            public_key: generatePublicKey(),
            agent_type: 'api',
            metadata: {
                name: `Load Test Agent ${__VU}-${__ITER}`,
                version: '1.0.0',
            },
        });

        const start = Date.now();
        const res = http.post(`${BASE_URL}/v1/agents/register`, payload, { headers });
        const duration = Date.now() - start;
        registerTrend.add(duration);

        check(res, {
            'registration status is 201 or 409': (r) => r.status === 201 || r.status === 409,
            'registration returns DID': (r) => {
                if (r.status !== 201) return true;
                try {
                    const body = JSON.parse(r.body);
                    return body.did && body.did.startsWith('did:agora:');
                } catch (e) {
                    return false;
                }
            },
        }) || errorRate.add(1);
    });

    sleep(0.1);

    group('Report Interaction Event', () => {
        const payload = JSON.stringify({
            agent_did: testDID,
            counterparty_did: counterpartyDID,
            outcome: Math.random() > 0.2 ? 'success' : 'failure',
            latency_ms: Math.floor(Math.random() * 500) + 50,
            amount_cents: Math.random() > 0.5 ? Math.floor(Math.random() * 10000) : null,
        });

        const start = Date.now();
        const res = http.post(`${BASE_URL}/v1/events/report`, payload, { headers });
        const duration = Date.now() - start;
        eventReportTrend.add(duration);

        check(res, {
            'event report status is 201 or 202': (r) => r.status === 201 || r.status === 202,
        }) || errorRate.add(1);
    });

    sleep(0.1);

    group('Query Trust Score', () => {
        const start = Date.now();
        const res = http.get(`${BASE_URL}/v1/trust/${testDID}`, { headers });
        const duration = Date.now() - start;
        trustQueryTrend.add(duration);

        check(res, {
            'trust query status is 200 or 404': (r) => r.status === 200 || r.status === 404,
            'trust query returns score': (r) => {
                if (r.status !== 200) return true;
                try {
                    const body = JSON.parse(r.body);
                    return typeof body.score === 'number';
                } catch (e) {
                    return false;
                }
            },
        }) || errorRate.add(1);
    });

    group('Batch Trust Query', () => {
        const dids = [generateDID(), generateDID(), generateDID()];
        const payload = JSON.stringify({ dids });

        const start = Date.now();
        const res = http.post(`${BASE_URL}/v1/trust/batch`, payload, { headers });
        const duration = Date.now() - start;
        trustQueryTrend.add(duration);

        check(res, {
            'batch query status is 200': (r) => r.status === 200,
        }) || errorRate.add(1);
    });

    sleep(0.5);
}

// Smoke test (quick validation)
export function smoke() {
    const res = http.get(`${BASE_URL}/v1/health`);
    check(res, { 'smoke: health ok': (r) => r.status === 200 });
}

// Stress test configuration
export const stressOptions = {
    stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 300 },
        { duration: '1m', target: 0 },
    ],
};

// Spike test configuration  
export const spikeOptions = {
    stages: [
        { duration: '10s', target: 100 },
        { duration: '1m', target: 500 },
        { duration: '10s', target: 100 },
        { duration: '3m', target: 100 },
        { duration: '10s', target: 0 },
    ],
};
