# canned-food-automation-tracker

## How to run the web application
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
```

### 4. Running server using NPM script
```bash
    npm run start:dev
```

## APIs Endpoint
- ### Automation controller
  - #### /automations (GET): Get all automations data
  - #### /automations/:id (GET): Get automation data by specific id
  - #### /automations (POST): Create automation data
    ```json
    {
        "name": "automation name",
        "description": "description"
    }
    ```
  - #### /automations/:id (PATCH): Update automation by specific id
  - #### /automations/:id (DELETE): Delete automation by specific id
