
# Vision Document: AchillesCLI

## 1. Overview & Core Mission

**AchillesCLI** is a terminal-based tool powered by Node.js that serves as an intelligent co-pilot for the initial phases of software development. Its primary mission is to **bridge the gap between a high-level idea and a well-defined, machine-readable project blueprint**.

It achieves this by interactively guiding a user to generate comprehensive project artifacts, including a vision document, detailed requirement files, and specification files that describe the intended behavior of code modules. The entire project structure is conceived as a **bi-directional dependency graph**, where requirements and specifications are explicitly linked.

---

## 2. Core Philosophy & Guiding Principles

*   **Specification as the Source of Truth**: The project's state, logic, and architecture are defined by the .md and .specs files on the disk, not by code or conversation history.
*   **Filesystem as State**: AchillesCLI does not maintain a chat history. The context for every operation is derived by reading the project's vision and requirement files from the requirements/ directory at the start of each session. The file structure *is* the state.
*   **Guided Creation**: The tool doesn't just take orders; it actively collaborates. It asks clarifying questions, provides suggestions, and helps the user think through the project's features, constraints, and architecture in a structured way.
*   **User in Control**: Every file system operation (create, modify, delete) is explicitly presented to the user with a preview for confirmation. This ensures transparency and prevents unintended changes.

---

## 3. System Architecture

AchillesCLI operates on a simple, extensible agent-based model.

*   **RouterAgent**: This is the central entry point. When the user provides an input, the RouterAgent analyzes the request's intent.
    *   On the first run, it scans the current working directory for a folder named requirements/.
        *   **If requirements/ exists**, it loads all files within it to build the context for the current session.
        *   **If requirements/ does not exist**, it infers that the user wants to start a new project plan.
    *   It then determines the most suitable sub-agent (an "Operator") to handle the request. If no suitable operator is found, it informs the user that the request cannot be fulfilled.
*   **SpecsAgent**: This is the primary operator and the "master architect" of the project. Its responsibilities include:
    *   **Project Scaffolding**: Creating the vision document, requirement files, and the project's folder structure.
    *   **Specification Generation**: Authoring .specs files that detail the purpose, functions, I/O, and relationships of future code files.
    *   **Graph Maintenance**: Ensuring the integrity of the dependency links between requirement files and .specs files.
    *   **Interactive Dialogue**: Answering questions, providing explanations, and offering suggestions based on the project context.

---

## 4. The Achilles Workflow & Project Graph

The interaction with AchillesCLI follows a logical progression from high-level vision to granular specification.

### Step 1: Project Initialization

The user starts with a simple prompt, like `achilles "I want to create a blog engine API."`. The SpecsAgent detects that no project exists and initiates a dialogue to create the **vision.md** file. This document captures the project's goals, target audience, and core value proposition.

### Step 2: Defining Requirements

With the high-level vision established, the `SpecsAgent` guides the user to break it down into concrete requirements within a new `requirements/` directory.

Instead of one monolithic document, the requirements are broken down by **major features**, with each feature getting its own dedicated file (e.g., `feature_user_authentication.md`, `feature_post_management.md`).

Inside each of these feature-specific files, the requirements are further detailed and categorized:

*   ***User Stories & Acceptance Criteria***: This section frames the feature from an end-user's perspective ("As a [user], I want [action], so that [goal].") and defines the specific, testable conditions that must be met for the feature to be considered complete.
*   ***Functional Requirements***: A detailed breakdown of the specific actions, behaviors, and functions the feature must perform.
*   ***Non-Functional Requirements***: The quality attributes and constraints for the feature, such as performance targets, security standards, and reliability.
*   ***Error Handling & Edge Cases***: Defines how the system should respond to invalid inputs, system failures, and other exceptional scenarios to ensure robust behavior.
*   ***Dependencies***: A formal list that links the requirement to its implementation. This is a crucial part of the project graph. It contains an array of file paths pointing to the `.specs` files responsible for fulfilling this feature.
    *   *Example: `dependencies: ["src/controllers/auth.controller.specs", "src/models/user.model.specs"]`*

This modular, hierarchical approach ensures that every aspect of a major feature is thoroughly considered and documented in a single, self-contained file.

### Step 3: Building the Skeleton and Specs

With the requirements defined, the SpecsAgent helps create the project's folder structure. However, instead of empty .js or .py files, it generates ****.specs** files.

*   **user.controller.specs**: A file describing what `user.controller.js` will eventually do.

### The Dependency Graph

The core of Achilles is the relationship between files, forming a **bi-directional graph**. This is managed via a `dependencies` array within the files.

*   **Requirements to Specs (Forward Link)**: A requirement file points to the specification files that will fulfill it.
    *   *Example from `requirements/feature_user_authentication.md`*:

    ```json
    {
      "dependencies": [
        "src/controllers/auth.controller.specs",
        "src/models/user.model.specs",
        "src/routes/auth.routes.specs"
      ]
    }
    ```

*   **Specs to Specs (Internal Link)**: A specification file can declare its own dependencies on other specifications.
    *   *Example from `src/controllers/auth.controller.specs`*:

    ```json
    {
      "dependencies": [
        "src/models/user.model.specs",
        "src/services/db.specs"
      ]
    }
    ```

When a requirement is modified, the **SpecsAgent knows to check the linked .specs files** for necessary updates, ensuring consistency across the project blueprint. This graph structure is the fundamental context for all modification and query operations.
