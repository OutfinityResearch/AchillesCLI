# DS-009 – Spec Document Helpers (helpers/specDocumentHelpers.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

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
### File: achilles-cli/helpers/specDocumentHelpers.mjs

#### Exports
- `resolveSpecTargets(cli, query)` — tokenises free-text filters into booleans for URS/FS/NFS/DS, gathers explicit IDs, and flags when the caller wants everything.
- `summarizeSpecDocument(cli, fileName, type, filterIds)` — parses a URS/FS/NFS document into sections with id/title/description/trace/path while optionally filtering to specific IDs.
- `listRecentDSIds(cli, limit)` — returns the most recently modified DS identifiers by filesystem mtime to power default /specs listing.
- `summarizeDesignSpecs(dsIds)` — reads DS files and extracts condensed scope/architecture/trace info for quick previews.
- `getSectionTextById(cli, sectionId)` — returns the full text of a URS/FS/NFS section or DS file content resolved through GampRSP.
- `describeSpecs(cli, targets)` — assembles the requested sections (URS/FS/NFS/DS) with full text, combining the helpers above to support CLI display.
  Diagram (ASCII):
  ```
  [targets]
     |
     v
  summarizeSpecDocument (URS/FS/NFS)
     |
     v
  ds ids (recent or requested)
     |
     v
  getSectionTextById for each
     |
     v
  merge sections with text
     |
     v
  return sections array
  ```

#### Dependencies
- node fs/path
- GampRSP singleton

#### Description
Utility layer that reads specs from workspace and produces summaries/previews used by CLI printing and execution output.

## Tests
- DS-021 (achilles-cli end-to-end)
