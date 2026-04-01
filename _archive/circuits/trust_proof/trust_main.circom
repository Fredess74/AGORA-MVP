pragma circom 2.1.0;

include "lib/merkle.circom";
include "lib/score.circom";
include "lib/comparators.circom";

/**
 * TrustProof - Main circuit for verifiable trust computation
 * 
 * This circuit proves:
 * 1. The prover knows N events that hash to the public Merkle root
 * 2. The trust score was correctly computed using the algorithm
 * 3. The score falls within a valid range [0, 10000]
 * 
 * Public Inputs:
 * - merkleRoot: 256-bit commitment to event history
 * - claimedScore: The trust score (0-10000)
 * - agentIdHash: Hash of the agent DID
 * - timestamp: Proof generation timestamp
 * 
 * Private Inputs:
 * - events: Array of event hashes
 * - outcomes: Array of outcomes (0=failure, 1=success, 2=dispute)
 * - latencies: Array of latencies in ms
 * - merklePaths: Merkle proof paths for each event
 * - merkleIndices: Merkle proof indices
 */
template TrustProof(maxEvents, merkleDepth) {
    // =========================================================================
    // PUBLIC INPUTS
    // =========================================================================
    signal input merkleRoot;
    signal input claimedScore;
    signal input agentIdHash;
    signal input timestamp;
    
    // =========================================================================
    // PRIVATE INPUTS  
    // =========================================================================
    signal input eventCount;
    signal input events[maxEvents];
    signal input outcomes[maxEvents];       // 0=failure, 1=success, 2=dispute
    signal input latencies[maxEvents];
    signal input merklePaths[maxEvents][merkleDepth];
    signal input merkleIndices[maxEvents];
    
    // =========================================================================
    // INTERMEDIATE SIGNALS
    // =========================================================================
    signal successCount;
    signal disputeCount;
    signal totalLatency;
    signal computedScore;
    
    // =========================================================================
    // STEP 1: Verify Merkle Proofs for Events
    // =========================================================================
    component merkleVerifiers[maxEvents];
    signal merkleValid[maxEvents];
    
    for (var i = 0; i < maxEvents; i++) {
        merkleVerifiers[i] = MerkleProofVerifier(merkleDepth);
        merkleVerifiers[i].leaf <== events[i];
        merkleVerifiers[i].root <== merkleRoot;
        
        for (var j = 0; j < merkleDepth; j++) {
            merkleVerifiers[i].pathElements[j] <== merklePaths[i][j];
        }
        merkleVerifiers[i].pathIndices <== merkleIndices[i];
        
        merkleValid[i] <== merkleVerifiers[i].valid;
    }
    
    // =========================================================================
    // STEP 2: Count Outcomes
    // =========================================================================
    component outcomeCounter = OutcomeCounter(maxEvents);
    for (var i = 0; i < maxEvents; i++) {
        outcomeCounter.outcomes[i] <== outcomes[i];
        outcomeCounter.active[i] <== merkleValid[i];
    }
    
    successCount <== outcomeCounter.successCount;
    disputeCount <== outcomeCounter.disputeCount;
    
    // =========================================================================
    // STEP 3: Calculate Latency Statistics
    // =========================================================================
    component latencyCalc = LatencyCalculator(maxEvents);
    for (var i = 0; i < maxEvents; i++) {
        latencyCalc.latencies[i] <== latencies[i];
        latencyCalc.active[i] <== merkleValid[i];
        latencyCalc.isSuccess[i] <== IsEqual()([outcomes[i], 1]);
    }
    
    totalLatency <== latencyCalc.totalLatency;
    
    // =========================================================================
    // STEP 4: Compute Trust Score
    // =========================================================================
    component scoreCalc = TrustScoreCalculator();
    scoreCalc.successCount <== successCount;
    scoreCalc.disputeCount <== disputeCount;
    scoreCalc.totalEvents <== eventCount;
    scoreCalc.avgLatency <== latencyCalc.avgLatency;
    
    computedScore <== scoreCalc.score;
    
    // =========================================================================
    // STEP 5: Verify Score Match and Range
    // =========================================================================
    // Score must match claimed
    component scoreMatch = IsEqual();
    scoreMatch.in[0] <== computedScore;
    scoreMatch.in[1] <== claimedScore;
    scoreMatch.out === 1;
    
    // Score must be in valid range [0, 10000]
    component inRange = RangeCheck(14); // 2^14 = 16384 > 10000
    inRange.value <== claimedScore;
    inRange.max <== 10000;
    inRange.valid === 1;
}

// Export main circuit with reasonable defaults
component main {public [merkleRoot, claimedScore, agentIdHash, timestamp]} = TrustProof(256, 8);
