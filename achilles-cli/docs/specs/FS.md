# AchillesCLI Functional Specification (FS)

## FS-001 – LLM Planning & Skills Orchestration
Version: v1.0 (1700000001001)
Status: active

### Description
Use an LLM planner to transform user intent into ordered skill executions, preferring orchestrator skills, handling missing skills gracefully, and surfacing execution previews.

### Traceability
- Source URS: URS-001, URS-008
- Linked DS: DS-001, DS-004

## FS-002 – Interactive & Non-Interactive CLI Loop
Version: v1.0 (1700000001002)
Status: active

### Description
Provide an interactive readline loop with history, command completion, cancellation (Ctrl+C/Escape), and non-interactive mode that still supports prompts and plan execution.

### Traceability
- Source URS: URS-001, URS-008, URS-010
- Linked DS: DS-001, DS-005, DS-006

## FS-003 – Spec Relationship Management
Version: v1.0 (1700000001003)
Status: active

### Description
Create and maintain URS/FS/NFS/DS documents under a managed specs root, updating traceability (URS↔FS/NFS↔DS) and generating HTML documentation on demand.

### Traceability
- Source URS: URS-003, URS-004, URS-009
- Linked DS: DS-002, DS-003, DS-009

## FS-004 – DS Coverage (Global & Per File)
Version: v1.0 (1700000001004)
Status: active

### Description
Support global DS documents for shared architecture and DS-per-file entries describing exports, dependencies, tests, and impact; ensure every code file can map to a DS.

### Traceability
- Source URS: URS-005, URS-009
- Linked DS: DS-003, DS-007, DS-014

## FS-005 – Session Memory & Resume
Version: v1.0 (1700000001005)
Status: active

### Description
Detect resume intent, persist pending plans in-memory, and allow resuming with optional extra instructions; store global/user/session memories for context reuse.

### Traceability
- Source URS: URS-002, URS-008
- Linked DS: DS-005, DS-010

## FS-006 – Contradiction & Scope Warnings
Version: v1.0 (1700000001006)
Status: active

### Description
Warn or block when new spec content conflicts with existing scope or traceability expectations; require confirmation when risk is detected.

### Traceability
- Source URS: URS-003, URS-006
- Linked DS: DS-003, DS-005

## FS-007 – Auto-Updates & Bootstrap
Version: v1.0 (1700000001007)
Status: active

### Description
Bootstrap a fresh workspace (.specs, ignore list, DS directories), rerun only once per session, and auto-update specs/logs when skills perform changes.

### Traceability
- Source URS: URS-004, URS-009
- Linked DS: DS-002, DS-008

## FS-008 – CLI Command Set
Version: v1.0 (1700000001008)
Status: active

### Description
Implement commands: /list, /run, /continue|/resume, /cancel, /specs, /debug, /model, /lang, /status, /exit with clear prompts and defaults.

### Traceability
- Source URS: URS-010
- Linked DS: DS-001, DS-005, DS-006

## FS-009 – Language Preference Enforcement
Version: v1.0 (1700000001009)
Status: active

### Description
Honor /lang for future prompts; inject a language contract into planner and skill prompts; default to English and persist preference via env var.

### Traceability
- Source URS: URS-007
- Linked DS: DS-001, DS-011

## FS-010 – Spec-Based Code Recovery Path
Version: v1.0 (1700000001010)
Status: active

### Description
Ensure specs contain file-level impact, dependencies, and tests to allow regenerating code from specs and DS-per-file descriptions.

### Traceability
- Source URS: URS-009
- Linked DS: DS-003, DS-007, DS-014
