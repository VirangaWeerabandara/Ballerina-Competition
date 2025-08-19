## Ballerina Backend Setup & Run Instructions

Follow these steps to set up and run the backend service:

### 1. Create the PostgreSQL Database

- Make sure you have PostgreSQL installed and running.
- Create a new database for this project (e.g., `oneblok`):
  ```sql
  CREATE DATABASE oneblok;
  ```

### 2. Run the Database Schema

- In your PostgreSQL client, run the schema script located at:
  ```
  backend/resources/schema.sql
  ```
  This will create the required tables and types.


### 3. Create the `Config.toml` File

- In the `backend` folder, create a file named `Config.toml` with the following content (replace values as needed):

  ```toml
  [databaseConfig]
  host = "localhost"
  port = "<<PostgreSQL_DB_PORT>>"
  username = "<<PostgreSQL_DB_USERNAME>>"
  password = "<<PostgreSQL_DB_PASSWORD>>"
  database = "<<PostgreSQL_DB_NAME>>"
  ```

  Example for default local setup:

  ```toml
  [databaseConfig]
  host = "localhost"
  port = 5432
  username = "postgres"
  password = "yourpassword"
  database = "oneblok"
  ```

### 4. Run the Ballerina Backend

- Open a terminal/console inside the `backend` folder.
- Run the following command:
  ```sh
  bal run
  ```

The backend service will start and listen on port 8080 by default.
