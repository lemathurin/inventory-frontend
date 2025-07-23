# Home Inventory App – Frontend

<img width="1136" height="745" alt="A screenshot of the app's dashboard, on the left showing a sidebar with the home's name, a list of rooms, and the user's name. On the right, a list of items with their name, owner, price, and location visible." src="https://github.com/user-attachments/assets/d7273af8-b08f-49dd-bc91-75a48fd32396" />

User interface for the Home Inventory App, allowing users to manage their material goods by house, room and down to the individual item. Designed with accessibility, eco-design and optimal user experience in mind.

Users can sign up, create homes and rooms, add items with details like warranty and price, and invite others to collaborate on shared homes. The interface includes a home dashboard, visual navigation, and control over item visibility.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Docker](#docker)
- [Project Structure](#project-structure)
- [Tests](#tests)
- [Credits](#credits)

## Tech Stack

- **Next.js**: React framework with good performance
- **TypeScript**: Strong typing for safer code
- **Tailwind CSS**: Utility-first CSS with centralized configuration
- **shadcn/ui**: Customizable component library for faster development
- **Axios**: Simplified API calls
- **Cypress**: End-to-end testing simulating user behaviour

## Installation

### Prerequisites

- Node.js (version 16 or higher)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/lemathurin/inventory-frontend.git
cd inventory-frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.local
```

Add this to the `.env.local`

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000 # This is the base backend port, adjust to your needs
```

### Development

```bash
# Start in development mode
npm run dev
```

### Production

```bash
# Build and start the production server
npm run build
npm start
```

## Docker

It is recommeneded to create a Docker Compose file to manage everything at once.

```
inventory/
├── inventory-frontend/
│   ├── Dockerfile
│   └── [Next.js code]
├── inventory-backend/
│   ├── Dockerfile
│   └── [Express code]
├── docker-compose.yml
└── .env
```

### Docker Compose

```yaml
services:
  # PostgreSQL database
  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
  # Backend Express.js
  backend:
    build:
      context: # Path to backend folder
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL= ${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    ports:
      - "5001:5000"
    depends_on:
      - database
  # Frontend Next.js
  frontend:
    build:
      context: # Path to frontend folder
      dockerfile: Dockerfile
      args:
        DISABLE_ESLINT_PLUGIN: "true"
    environment:
      - NEXT_PUBLIC_API_URL= ${NEXT_PUBLIC_API_URL}
    ports:
      - "3001:3000"
    depends_on:
      - backend
volumes:
  db_data:
```

### Docker Compose .env

```
DATABASE_URL= # Database URL
POSTGRES_DB=inventory_db
POSTGRES_USER=inventory_user
POSTGRES_PASSWORD=password123
JWT_SECRET=super-secure-secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Docker Compose Commands

```bash
# Start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Check status
docker-compose ps
```

## Project Structure

```
inventory-frontend/
├── cypress/                    # End-to-end test files and downloads
├── src/                        # Main source code
│   ├── app/                    # Next.js App Router structure
│   │   ├── (app)/              # Authenticated user pages
│   │   │   ├── layout.tsx      # Layout for authenticated views
│   │   │   └── ...
│   │   ├── (public)/           # Public routes (login, signup, onboarding)
│   │   ├── globals.css         # Global styles
│   │   └── layout.tsx          # Global layout
│   ├── components/             # Reusable UI and app-specific components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── sidebar/            # Sidebar layout and nav components
│   │   ├── onboarding/         # Onboarding-specific components
│   │   └── ...                 # Other feature-specific components
│   ├── config/                 # App configuration (e.g., API base URLs)
│   ├── content/                # Static markdown content (e.g., terms & conditions)
│   ├── context/                # Global context providers (e.g., theme)
│   ├── domains/                # Feature-based domain logic
│   │   ├── home/               # Logic for homes (hooks, types, API)
│   │   ├── item/               # Logic for items
│   │   ├── room/               # Logic for rooms
│   │   └── user/               # Logic for user management
│   ├── hooks/                  # App-wide reusable hooks
│   ├── lib/                    # Utilities (e.g., Axios instance, helpers)
│   └── middleware.ts           # Middleware for Next.js routing
├── Dockerfile                  # Docker config for frontend
├── next.config.js              # Next.js configuration
├── package.json                # Project dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## Tests

```bash
# End-to-end tests with Cypress
npm run test:e2e:open   # Interactive UI
```

## Credits

This project was carried out to validate the RNCP Application Designer and Developer diploma (Titre RNCP Concepteur Développeur d'Applications de niveau VI). It was developped by [Pierre](https://github.com/PierrePedrono) and [Mathurin](https://mathurinsekine.fr).
