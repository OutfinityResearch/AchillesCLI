# DS-009 – Spec Document Helpers (helpers/specDocumentHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Resolve and summarize specification sections, list recent DS entries, and fetch section text by ID for previews and /specs output.

## Architecture
- Parses spec documents into sections, extracts descriptions/trace lines, and filters by IDs.
- Supports DS summaries and recent DS discovery via filesystem mtime.
- Provides `describeSpecs` for CLI display using filters.

## Traceability
- URS: URS-003, URS-004, URS-005
- Requirement: FS-003, FS-004, FS-008

## File Impact
### File: helpers/specDocumentHelpers.mjs
Timestamp: 1700000003009

#### Exports
- resolveSpecTargets, summarizeSpecDocument, listRecentDSIds, summarizeDesignSpecs, getSectionTextById, describeSpecs

#### Dependencies
- node fs/path
- GampRSP singleton

#### Description
Utility layer that reads specs from workspace and produces summaries/previews used by CLI printing and execution output.

## Tests
- DS-021 (achilles-cli end-to-end)
