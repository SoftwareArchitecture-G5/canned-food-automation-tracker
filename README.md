# canned-food-automation-tracker

## How to run the Backend Nest.Js

### 1. Change directory to backend-nestjs

```bash
cd backend-nestjs
```

### 2. Install requirements dependencies

```bash
npm install
```

### 3. Create .env file to ./backend-nestjs

```bash
touch .env # MAC OS
```

```dotenv
# Nest.Js Configuration variable
PORT='Your port such 8000'

# Database Configuration variable
DB_HOST='Database Host'
DB_PORT='Your Database PORT'
DB_USERNAME='Your Database username'
DB_PASS='Your Database password'
DB_NAME='Your database name'
DB_SSL='SSL option true or false'

# Frontend Configuration variable
FRONTEND_URL='http://localhost:3000'
```

### 4. Running server using NPM script

```bash
npm run start:dev
```

## How to run the Frontend Next.Js

### 1. Change directory to backend-nestjs

```bash
cd frontend-nextjs
```

### 2. Install requirements dependencies

```bash
# Try install requirement dependencies
npm install

# If version conflict (React 19) use force option
npm install --force
```

### 3. Create .env file to ./frontend-nextjs

```bash
touch .env.local # MAC OS
```

```dotenv
#Backend Domain
NEXT_PUBLIC_BACKEND_DOMAIN="http://localhost:8000" # If you set nest.js server to port 8000

# Clerk authentication privder config variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_KEY
CLERK_SECRET_KEY="YOUR_SECRET_KEY"
```

### 4. Running frontend next.Js server by running this script

```bash
# this command run next with turboPack
npm run dev
```
## How to run test in NestJs Service

### 1. Reach the target service
```bash
cd ./backend-nestjs
cd ./automation (example)
```
### 1. run the service.spec.ts test file
```bash
npm run test
```