# Database Setup Guide

This guide will help you set up the PostgreSQL database for the oneBlok project.

## Prerequisites

- PostgreSQL 12 or higher installed on your system
- Access to PostgreSQL command line tools (`psql`) or a GUI client like pgAdmin

## Setup Instructions

### 1. Create the Database

Connect to PostgreSQL as a superuser (usually `postgres`) and create the database from pdAdmin app:


# Create the database
Database Name = "oneblok_db"



### 2. Run the Database Schema

Navigate to the backend directory and run the SQL schema script:

```bash
# From the backend directory
psql -U postgres -h localhost -d oneblok_db -f resources/sql/schema.sql
```

This will create the following tables:
- `users` - Store user account information
- `projects` - Store project data with block layouts
- `comments` - Store project comments and feedback

The script also creates:
- Necessary indexes for query optimization
- Triggers for automatic timestamp updates
- Foreign key relationships between tables

### 3. Configure Database Connection

Create a `Config.toml` file in the backend directory by copying from the example:

```bash
# Copy the example configuration
cp Config.example.toml Config.toml
```

Edit the `Config.toml` file with your database credentials:

```toml
[oneblok.backend.database]
host = "localhost"
port = 5432
database = "oneblok_db"
user = "your_db_username"
password = "your_db_password"
```

