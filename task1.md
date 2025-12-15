# QRED - Assignment - Task 1

#  Indentified Bottlenecks
- Bridging Product and Engineering
- Bridging Frontend and Backend development
- Developer support and parallel development

# Bridging Product and Engineering
- Ensure a clear understanding of requirements from product managers regarding what needs to be delivered.
- Document requirements using collaborative tools such as Confluence, enabling product and engineering teams to co‑author specifications.
- Keep documentation focused on high‑level technical requirements rather than detailed code, to maintain accessibility for all stakeholders.
- The technical outcome should include a mock API definition document that captures all requirements for the engineering team.

# Bridging Frontend and Backend Development
- Define API contracts early using tools like Swagger/OpenAPI, before coding begins.
- Conduct technical grooming and refinement meetings to align on requirements and resolve ambiguities.
- Assign an epic owner to ensure smooth communication, resolve conflicts, coordinate efforts, and deliver seamlessly.
- Finalize and sign off API contracts, making them available for both frontend and backend teams to begin implementation.

# Developer Support and Parallel Development
- Provide early availability of API contracts to allow frontend and backend teams to work in parallel.
- API contracts should clearly define:
    - Endpoints
    - Request payloads
    - Response payloads
    - Response status codes
    - Validations
    - Query and path parameters (with required vs optional clearly marked)
- Use mock services wherever possible to accelerate development and provide quick availability of underlying systems.

# Implementation and Process
- Implement automated tests to detect contract violations early.
- Maintain clear versioning in API contracts to avoid ambiguities between major and minor changes.
- Establish a feedback loop between product managers and developers to ensure clarity and prevent late definitions.
- CI/CD in place for incremental changes to be «delivered quickly, tested early, and deployed without delays.