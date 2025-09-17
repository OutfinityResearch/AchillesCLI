module.exports = {
    SRSDocumentTemplate: `
Main Project Requirements Document
for
[Project Name]

Version: 1.0
Date: [Date]
Author(s): [Author Name(s)]

1. Introduction
This section provides a high-level overview of the project and the product.

1.1 Purpose: Describe the purpose of the software product.

1.2 Product Scope: Define the boundaries of the product, its major goals, and what it will and will not do.

1.3 User Classes and Characteristics: Identify the different types of users and their key attributes.

1.4 References: List any supporting documents.

2. Overall Description
This section describes the general factors that affect the product and its requirements.

2.1 Product Perspective: Describe how the product fits into the larger business or system context.

2.2 Operating Environment: Detail the hardware, software, and network environment in which the product will run.

2.3 Design and Implementation Constraints: List any project limitations, such as required technologies, programming languages, or adherence to specific industry standards.

2.4 Assumptions and Dependencies: List any assumptions or external dependencies that could impact the project.

3. System Features (Summary & Index)
This section provides a high-level summary of all major features and links to their detailed specification documents.

Feature ID\tFeature Name\tLink to Specification Document
FEAT-001\tUser Authentication\t[Link to FEAT-001_Authentication.md]
FEAT-002\tProduct Search & Filter\t[Link to FEAT-002_Search.md]
FEAT-003\tShopping Cart & Checkout\t[Link to FEAT-003_Checkout.md]
...\t...\t...

Export to Sheets
4. Global Non-Functional Requirements
This section details the NFRs that apply to the entire system.

4.1 Performance: Overall system responsiveness, load capacity, etc.

4.2 Security: General security policies like data encryption at rest, password policies, etc.

4.3 Usability: General usability standards, accessibility (e.g., WCAG compliance), and branding guidelines.

4.4 Reliability & Availability: System uptime requirements (e.g., 99.9% uptime) and overall fault tolerance.

Appendix A: Glossary
Define terms and acronyms used across the project.

Part 2: Individual Feature Specification Template
Create a separate file using this template for each major feature listed in Section 3 of the main document.

Feature Specification: [Feature Name]

Feature ID: FEAT-XXX

Main Project Document: [Link to Main Project Requirements Document]

1. Description & Purpose
Provide a clear, concise summary of the feature. Explain what problem it solves for the user and what value it brings to the product.

2. Functional Requirements
2.1 Use Cases / User Stories
List the user stories or use cases that this feature enables.

As a [type of user], I want to [perform some task] so that [I can achieve some goal].

Example (for Authentication): As a new user, I want to create an account using my email and a password so that I can access the platform's features.

2.2 Detailed Functional Flows
Describe the step-by-step logic and user interactions. This can be text, a flowchart, or an activity diagram.

Example (for Login Flow):

User navigates to the login page.

User enters their email and password.

User clicks the "Log In" button.

The system validates the credentials.

... and so on.

2.3 Inputs, Outputs, and Error Handling
Detail the data inputs, expected outputs, and how the system should handle invalid data or unexpected errors.

Action: User Login

Inputs: email (string, valid email format), password (string, min 8 characters).

Successful Output: User is authenticated and redirected to the dashboard; a session token is generated.

Error Handling:

If email is not found: Display "Invalid email or password."

If password does not match: Display "Invalid email or password."

If input format is invalid: Display "Please enter a valid email and password."

3. Non-Functional Requirements (Specific to this Feature)
List any NFRs that are unique to this feature.

Performance: Example: The user authentication process must complete within 500ms.

Security: Example: All authentication tokens must be securely stored using JWT with RS256 signing.

Usability: Example: The login form must be accessible via keyboard navigation.

4. Dependencies / Interfaces
Describe how this feature interacts with other parts of the system or external services.

APIs: Does it consume any internal or third-party APIs? (e.g., Google OAuth API for social login).

Other Features: Does this feature depend on another one to function? (e.g., Checkout depends on the Shopping Cart feature).

External Systems: Does it interact with other systems? (e.g., an external identity provider).

5. Acceptance Criteria
Provide a checklist of measurable and testable conditions that must be met for this feature to be considered "done". The Given-When-Then format is highly effective.

Scenario 1: Successful User Login

Given a registered user exists with email "test@example.com" and password "password123".

When the user enters these credentials on the login page and clicks "Log In".

Then the user should be redirected to their dashboard.

Scenario 2: Failed Login with Invalid Password

Given a registered user exists with email "test@example.com".

When the user enters the correct email and an incorrect password.

Then an error message "Invalid email or password" should be displayed.
    `,
    modifyPlanPrompt: `
You are the "Project Architect Agent". Your goal is to modify an existing project plan based on a user's request.

You will be given the current plan and a modification request. You MUST return a delta of the changes.
When modifying, you must trace the dependencies and identify all affected files and modify their content too. 
You can take the initiative and add changes of your own that you think might align with what the user is trying to achieve.

You can decide if you require more information about which specifications you need to modify/delete. 
In this case your response should only be a VALID json object with 2 keys "requireInfo", a boolean and "files" listing the files needed that I need to provide to make your changes.
Example : {"requireInfo": true, "files":["/src/web-components/auth.js", "/src/web-components/front-page.js"]}

If you decide you have enough information to proceed your response MUST be a JSON object with a single key, "delta". The "delta" object must have the following keys:
- "add": An object with "requirements" and "specifications" arrays with "files" objects for any new files.
- "modify": An object with "requirements" and "specifications" arrays with "files" objects for any modified files.
- "delete": An object with "requirements" and "specifications" arrays of strings, where each string is the path of a file to be deleted.
- "changeSummary": A natural language summary of the changes you have made.

"files" objects have 3 keys: 
- "path": path of the file
- "content": content of the file
- "dependencies": an array of file paths representing the files that are dependent on this one
Current Plan:
$$context

Based on the user's request, what is the delta of changes?`,

    createRequirementsPrompt: `You are a Project Architect. Based on the user's request, generate a list of project requirements. 
            Fill in any logical gaps to ensure the requirements are coherent and complete for a functional application. 
            Your response MUST be a valid JSON object with a single key, 'requirements', which is an array of file objects. Each file object must have 'path' and 'content'.
            Example: {"requirements": [{"path": "requirements/auth.txt", "content": "1. Users must be able to log in with email and password."}]}`,
    createSpecsPrompt: `You are a Project Architect. You have been given a list of project requirements. Your task is to:
1. Generate the corresponding specification files ('.specs') needed to implement these requirements. 
In those files you write in natural language what is the role of that file, what kind of functions/code it has, describe all functions in detail(input, output) and describe its relationship with other files in the project. You dont need to create actual code, just documentation
2. For each original requirement, determine its new dependencies on the specification files you created.
3. Create project folder structure by constructing the paths of the files. Create a suitable project structure for the project. 
Example: If the project has a server side and a front-end side it should have 2 folders: server, front-end. Utils functions should be in different files. Respect S.O.L.I.D. principles.
Your response MUST only be a valid JSON object with three keys:
- 'requirementDependencies': An object where each key is the path of an original requirement file and the value is an array of its new dependency paths.
- 'specifications': An array of new specification file objects, each with 'path', 'content', and 'dependencies'.

Here are the requirements to work with:
$$requirements
`
}