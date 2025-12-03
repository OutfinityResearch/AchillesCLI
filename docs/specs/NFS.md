# AchillesCLI Non-Functional Specification (NFS)

## NFS-001 – Deterministic Spec Updates
Version: v1.0 (1700000002001)
Status: active

### Description
Specification generation and updates must be reproducible given the same inputs, skill catalog, and workspace state; cached bootstrap prevents redundant actions.

### Traceability
- Linked URS: URS-006, URS-009
- Linked DS: DS-002, DS-008

## NFS-002 – Performance for REPL Use
Version: v1.0 (1700000002002)
Status: active

### Description
REPL operations (plan + execute simple skills) should remain responsive (<1s typical on fast mode) and avoid blocking IO; timeouts guard long skill discovery/listing.

### Traceability
- Linked URS: URS-001, URS-008
- Linked DS: DS-001, DS-006

## NFS-003 – Reliability & Recovery
Version: v1.0 (1700000002003)
Status: active

### Description
Persist histories and logs (.llm_logs, .llm_stats, .history_*); ensure plan cancellation and resume paths leave specs consistent and avoid partial writes.

### Traceability
- Linked URS: URS-002, URS-009
- Linked DS: DS-002, DS-005, DS-010

## NFS-004 – Security & Isolation
Version: v1.0 (1700000002004)
Status: active

### Description
Operate within the workspace directory; ignore/gitignore defaults avoid leaking node_modules or secrets; no network calls outside configured LLM agent.

### Traceability
- Linked URS: URS-003
- Linked DS: DS-002, DS-008

## NFS-005 – Observability & Debuggability
Version: v1.0 (1700000002005)
Status: active

### Description
Expose debug mode to print LLM invocations and execution status; surface plan/skill previews; emit status summaries including log/stat file locations and duration buckets. Use consistent ANSI color styling for info, warn, error, and debug messages.

### Traceability
- Linked URS: URS-010
- Linked DS: DS-001, DS-012

## NFS-006 – Language Compliance
Version: v1.0 (1700000002006)
Status: active

### Description
All generated docs must follow the active language contract; contract appended to prompts and stored in context for skill executions.

### Traceability
- Linked URS: URS-007
- Linked DS: DS-011
