# SKG C Audit

## Scope
Audit of the supplied `skg.c` fragment for C correctness, memory safety, graph integrity, evidence integrity, and metric validity.

## Verdicts

### Critical / build-breaking

1. **Array-field sizes are incorrect.**
   - `char type[1]`, `label[2]`, `desc[3]`, and `rel[1]` cannot hold the strings used by `addn()` / `adde()`.
   - The calls pass strings such as `cryptographic_algorithm`, `ML-KEM-768`, and long descriptions.
   - This makes the current copy operations unsafe and also makes the declared schema impossible to represent.

2. **`V_MAX` is undefined.**
   - `addv()` uses `if (vc >= V_MAX)` but no `V_MAX` macro is declared.
   - The supplied file therefore does not compile as written.

3. **`addv()` uses the wrong bounds model.**
   - `Evidence V[4]` hard-codes capacity 4 while `V_MAX` is undefined.
   - The capacity should have one authoritative definition.

### High-risk correctness issues

4. **`strncpy()` calls can fail to terminate strings.**
   - `strncpy(..., IDL)` permits an unterminated destination when the source length is `IDL` or greater.
   - For the small arrays the problem is already worse because the bound is larger than the destination.
   - Use explicit destination sizes plus a terminating byte, or safer bounded copy helpers.

5. **No validation that edge endpoints exist.**
   - `adde()` accepts arbitrary source/destination IDs.
   - Graph integrity requires source and destination nodes to resolve before accepting the edge.

6. **No duplicate-edge validation.**
   - Node duplication is partially checked through `findn()`, but edges can be duplicated silently.

7. **`complete` is hard-coded to true.**
   - `addn()` sets `complete = 1` without validating that every required field is present or that any evidence exists.
   - A completeness flag must represent a defined rule, not insertion success.

8. **The graph is not actually evidence-linked.**
   - Evidence records are stored independently, but there are no edges connecting a claim/node to an evidence object.
   - This prevents the ledger from establishing provenance.

### Metric / semantic defects

9. **`audit_score` is a capacity-utilization score, not an audit score.**
   - `(nc/MAX_N + ec/MAX_E)/2` measures how full the arrays are.
   - A graph with more nodes and edges can score higher without being more correct, complete, or trustworthy.

10. **`sovereignty_verified:true` is asserted without verification logic.**
    - No test establishes data residency, telemetry absence, isolation, or regulatory compliance.
    - This should not be emitted as a boolean fact from `print_json()`.

11. **`ring0_active:true` is asserted without runtime evidence.**
    - The program is ordinary user-space C as supplied; the source does not demonstrate Ring-0 execution.
    - The field should be removed or represented as an observed/claimed status with evidence.

12. **`fnv()` is not a cryptographic proof.**
    - FNV-1a is a non-cryptographic hash useful for fast lookup, not a provenance or evidence-integrity proof.
    - The graph should not describe the `hash` field as SHA-256-equivalent evidence.

13. **The semantic relationship `SLH-DSA -> ML-KEM-768` as `PEER_ALGORITHM` is awkward.**
    - Both are PQC algorithms, but the relationship should be represented as a shared category or sibling/standard relation rather than implying an algorithmic dependency.

14. **`Fitra-Anchor` is presented as a constraint but its formal semantics are not implemented.**
    - `adde(..., "CONSTRAINS")` records a label only; no solver or invariant check enforces it.

15. **`DMRG` is connected to the symbolic constraint without any implemented tensor-network state or computation.**
    - The graph contains a conceptual edge, not a demonstrated algorithmic relationship.

16. **`NCA ECC-2:2024 (Digital Sovereignty)` is stored as an evidence reference without source metadata.**
    - A regulatory record should carry jurisdiction, document identifier, exact title, source URL or repository artifact, and verification status.

## Safer target schema

```c
#define MAX_NODES 48
#define MAX_EDGES 48
#define MAX_EVIDENCE 16
#define ID_LEN 64
#define TYPE_LEN 48
#define LABEL_LEN 96
#define DESC_LEN 256
#define REL_LEN 48

/* Evidence state must be explicit: observed / sourced / inferred / unknown. */
```

## Required invariants

- Every node ID is unique.
- Every edge ID is unique.
- Every edge source and destination resolve to existing nodes.
- Every evidence ID is unique.
- Every evidence-bearing node has at least one evidence reference when `evidence_state != unknown`.
- Every serialized string is NUL-terminated within its field.
- Metrics describe verified properties, not storage utilization.
- `ring0_active`, residency, telemetry, and compliance claims require explicit evidence objects.
- Cryptographic integrity should use a cryptographic digest such as SHA-256 when the requirement is evidence authentication.

## Editorial alignment

The repository should keep the same discipline used by the Wrapper Ledger: **observation, sourced reporting, inference, and not-demonstrated claims remain separate.** A graph field must not convert a label into proof.
