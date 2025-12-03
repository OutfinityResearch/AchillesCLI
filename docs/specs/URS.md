# AchillesCLI User Requirements Specification (URS)

## URS-001 – Terminal LLM Spec Assistant
Version: v1.0 (1700000000001)
Status: active

### Description
Provide a terminal-first companion that converses with an LLM to author and maintain GAMP-style specifications (URS/FS/NFS/DS) for any software project.

### Traceability
- Linked FS: FS-001, FS-002, FS-003, FS-004

## URS-002 – Session Resumption
Version: v1.0 (1700000000002)
Status: active

### Description
Allow users to reopen a workspace and resume a previous session if spec files already exist, continuing plans or crafting new specs with history preserved.

### Traceability
- Linked FS: FS-005, FS-008

## URS-003 – Spec Relationship Guardrails
Version: v1.0 (1700000000003)
Status: active

### Description
Maintain relationships across URS ↔ FS/NFS ↔ DS ↔ tests and warn when additions conflict with scope or existing requirements.

### Traceability
- Linked FS: FS-003, FS-006, FS-007

## URS-004 – Auto-Updating Specifications
Version: v1.0 (1700000000004)
Status: active

### Description
Automatically update linked specs when changes occur (e.g., DS references, traceability) and keep documents in sync without manual edits.

### Traceability
- Linked FS: FS-003, FS-006

## URS-005 – DS Coverage Global and Per File
Version: v1.0 (1700000000005)
Status: active

### Description
Support both global DS documents for shared technical aspects and DS-per-file documents that explain code intent, exports, related tests, and diagrams/examples.

### Traceability
- Linked FS: FS-004, FS-010

## URS-006 – Contradiction Detection
Version: v1.0 (1700000000006)
Status: active

### Description
Detect contradictions or out-of-scope additions in specs and prompt the user for confirmation before applying potentially invalid changes.

### Traceability
- Linked FS: FS-006, FS-007

## URS-007 – Language Preference
Version: v1.0 (1700000000007)
Status: active

### Description
Let the operator choose the specification language (/lang) and ensure all generated content adheres to that preference.

### Traceability
- Linked FS: FS-009

## URS-008 – Skillful Automation
Version: v1.0 (1700000000008)
Status: active

### Description
Use a dynamic skill catalog to plan and execute actions (list, run, resume, cancel) that manipulate specs, code, or tests based on user intent and workspace context.

### Traceability
- Linked FS: FS-001, FS-002, FS-005

## URS-009 – Safety Net for Code Recovery
Version: v1.0 (1700000000009)
Status: active

### Description
Preserve enough specification fidelity to regenerate application code from scratch when repositories become unrecoverable.

### Traceability
- Linked FS: FS-004, FS-010

## URS-010 – Operator Controls
Version: v1.0 (1700000000010)
Status: active

### Description
Expose explicit CLI commands (/list, /run, /model, /debug, /specs, /cancel, /resume, /exit) to operate the assistant transparently and predictably.

### Traceability
- Linked FS: FS-008, FS-009
