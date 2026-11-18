# Order Booking Form Automation

### Full-Stack CRUD | Tech Mahindra Techathon 2.0

A full-stack Order Booking Form (OBF) management system for Mahindra Logistics Limited: digitising order entry, automating project-cost calculations, and supporting multi-level approvals and operational analytics.

## At a glance

| Area | Overview |
| --- | --- |
| Resume project | Order Booking Form Automation |
| Category | Full-stack CRUD and business-workflow automation |
| Event in resume | Tech Mahindra Techathon 2.0 |
| Recognition in resume | 2nd runner-up |
| Frontends | Next.js 15 / React 19 implementation and an alternate React 18 implementation |
| Backend | Node.js, Express, TypeScript, Sequelize, PostgreSQL |
| Integrations | JWT authentication, OAuth configuration, Supabase, Excel processing |
| Source snapshot | [Duck017/MLL_Code](https://github.com/Duck017/MLL_Code), commit `43927489ddd9025403c447c9bd79c7b41c3d3aa9` |

## Project scope

The supplied code and original project documentation cover:

- A full-stack booking-form platform to automate calculations and retain submitted data.
- Multi-level approval workflows for order processing.
- Operational analytics to help review booking activity.
- Project cost components including manpower, CAPEX, OPEX, and rental expenses.
- User/access management, master data, financial reporting, and Excel file processing.

## Results and recognition

The resume reports approximately **80% less manual calculation effort** and **2nd runner-up at Tech Mahindra Techathon 2.0**. These are resume-reported outcomes; no independently reproducible before/after performance benchmark is included in this snapshot.

## Architecture and project layout

| Path | Purpose |
| --- | --- |
| [frontend/](frontend/) | Next.js frontend for booking forms, dashboards, users, and authentication |
| [frontend-react/](frontend-react/) | Alternate React frontend, including an authentication proxy |
| [node_backend/](node_backend/) | Express/TypeScript REST API, configuration, models, and migrations |
| [Masters.xlsx](Masters.xlsx) | Supplied master-data workbook |
| [OBF_Automation.docx](OBF_Automation.docx) | Original project document |
| [Backend README](node_backend/README.md) | Original backend documentation |
| [Docker notes](node_backend/DOCKER.md) | Original container setup notes |
| [Original root README](docs/UPSTREAM_README.md) | Preserved upstream project documentation |

## Run locally

The backend package declares Node.js **18 or later**. Install its dependencies, copy the supplied environment template, and configure a local PostgreSQL database and integration credentials:

```powershell
cd node_backend
npm install
Copy-Item env.example .env
# Edit .env for your local database, JWT secret, and integrations.
npm run dev
```

In a separate terminal, start the Next.js frontend:

```powershell
cd frontend
npm install
npm run dev
```

The backend defaults to port `4000`. Configure the frontend API origin and OAuth callbacks for your local setup. [node_backend/env.example](node_backend/env.example) lists the backend settings. The alternate React frontend has its own `npm start` workflow and proxy; use one frontend at a time.

The original documentation and package scripts are not entirely consistent: for example, `npm run migrate` references `src/database/migrate.js`, which is absent from this snapshot. Review the available Sequelize migrations and database configuration before initialising the database. Development credential defaults are examples and must be replaced for real deployments. This upload has not been validated as a complete running stack.

## Resume fit

This corresponds to **Order Booking Form Automation | Full-Stack CRUD** in the Projects section. Its portfolio focus is business-process automation, data-entry workflows, approvals, and operational reporting.

## Source and attribution

This separate portfolio repository was prepared from the source repository provided by the author, [Duck017/MLL_Code](https://github.com/Duck017/MLL_Code), at the commit above. Original implementation files and documentation are retained; the root README has been rewritten to match the resume project and the inspected code. The original README mentions an MIT license, but no standalone license file was present in the supplied snapshot; this README does not grant a new license or change existing rights.

Personal internship/declaration documents from the initially supplied local folder, the resume, generated output, local environment files, and original Git history are not included.
