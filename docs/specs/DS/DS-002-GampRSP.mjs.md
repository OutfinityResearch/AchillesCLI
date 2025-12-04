# DS-002 – Specs Workspace Manager (GampRSP.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-04T11:33:47Z

## Scope & Intent
Manage `.specs` workspace lifecycle: create URS/FS/NFS skeletons, DS directory, ignore list, mock/docs folders, traceability updates, and HTML generation.

## Architecture
- Ensures directory structure and default documents exist.
- Generates IDs and chapters for URS/FS/NFS; retires/updates entries.
- Creates DS files, test entries, file-impact blocks, and links requirements to DS; renders "Exports" as detailed bullet entries and includes ASCII/text diagrams when provided.
- Produces HTML docs (URS/FS/NFS/DS index) for offline browsing.

## Traceability
- URS: URS-003, URS-004, URS-005, URS-009
- Requirement: FS-003, FS-004, FS-007, FS-010

## File Impact
### File: achilles-cli/GampRSP.mjs
Timestamp: 1700000003002

#### Exports
- `GampRSP` (default singleton) — bootstraps `.specs` (skeleton docs, DS/mock/docs folders, ignore file), allocates IDs, reads/writes URS/FS/NFS/DS chapters, links requirements, manages tests and pending plans, renders file-impact sections with detailed export bullets (optional ASCII/text diagrams per export) plus dependencies/side effects/concurrency, and regenerates HTML docs for browsing.

#### Dependencies
- node fs/path

#### Description
Provides CRUD over specification artifacts, DS path resolution, traceability updates, ignore list handling, cache persistence, and HTML doc generation used by CLI skills.

## Tests
- DS-023 (spec management)
- DS-021 (achilles-cli end-to-end)
