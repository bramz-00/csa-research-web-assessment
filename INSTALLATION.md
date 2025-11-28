# User Management System - Installation Guide

A PHP-based user management application with authentication, CRUD operations, and session management.

## 📋 Prerequisites

Before installing this application, ensure you have the following installed on your system:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** (for cloning the repository)

### Verify Prerequisites

```bash
docker --version
docker compose version
git --version
```

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Environment Configuration

The application uses environment variables for database configuration. The `.env` file is already included with default values:

```env
DB_HOST=db
DB_NAME=assessment_db
DB_USER=appuser
DB_PASS=apppassword
```

**Note:** For production environments, you should change these values to more secure credentials.

### 3. Build and Start Docker Containers

```bash
docker compose up -d --build
```

This command will:
- Build the PHP Apache container
- Start MySQL 8.0 database
- Start phpMyAdmin for database management
- Create necessary volumes for data persistence

### 4. Initialize the Database

Once the containers are running, import the database schema:

```bash
docker exec -i assessment_db mysql -uappuser -papppassword assessment_db < sql/schema.sql
```

Alternatively, you can use phpMyAdmin:
1. Open http://localhost:8080
2. Login with:
   - **Server:** db
   - **Username:** appuser
   - **Password:** apppassword
3. Select `assessment_db` database
4. Go to "Import" tab and upload `sql/schema.sql`

### 5. Verify Installation

Check that all containers are running:

```bash
docker compose ps
```

You should see three containers running:
- `assessment_php` (port 8000)
- `assessment_db` (port 3307)
- `assessment_phpmyadmin` (port 8080)

## 🌐 Accessing the Application

Once installed, you can access:

- **Main Application:** http://localhost:8000/
- **phpMyAdmin:** http://localhost:8080/

### First Time Setup

1. Navigate to http://localhost:8000/
2. Click "Register" to create your first user account
3. Fill in the registration form with:
   - Name
   - Email
   - Password
4. After registration, login with your credentials

## 📁 Project Structure

```
.
├── docker/
│   └── Dockerfile              # PHP Apache container configuration
├── public/                     # Web root directory
│   ├── index.php              # Home page with conditional navigation
│   ├── client/                # Frontend files
│   │   ├── assets/
│   │   │   └── app.js         # Client-side JavaScript
│   │   ├── form.html          # User registration/edit form
│   │   ├── login.html         # Login page
│   │   └── list.html          # User list with CRUD operations
│   └── server/                # Backend files
│       ├── api/               # API endpoints
│       │   ├── create.php
│       │   ├── delete.php
│       │   ├── get_user.php
│       │   ├── list.php
│       │   ├── login.php
│       │   ├── logout.php
│       │   └── update.php
│       ├── classes/           # PHP classes
│       │   └── User.php
│       ├── config/            # Configuration files
│       │   ├── Csrf.php
│       │   └── Database.php
│       ├── controllers/       # Business logic
│       │   └── UserController.php
│       └── utils/             # Utility functions
│           └── get_csrf.php
├── sql/
│   └── schema.sql             # Database schema
├── docker-compose.yml         # Docker services configuration
└── .env                       # Environment variables
```

## 🔧 Configuration

### Port Configuration

The default ports are:
- **Application:** 8000
- **MySQL:** 3307 (mapped from container's 3306)
- **phpMyAdmin:** 8080

To change ports, edit `docker-compose.yml`:

```yaml
services:
  php:
    ports:
      - "YOUR_PORT:80"  # Change 8000 to your preferred port
```

### Database Configuration

Database credentials are set in `docker-compose.yml` under the `db` service:

```yaml
environment:
  MYSQL_ROOT_PASSWORD: rootpassword
  MYSQL_DATABASE: assessment_db
  MYSQL_USER: appuser
  MYSQL_PASSWORD: apppassword
```

**Important:** Update the `.env` file if you change these values.

## 🛠️ Common Commands

### Start the Application
```bash
docker compose up -d
```

### Stop the Application
```bash
docker compose down
```

### View Logs
```bash
docker compose logs -f
```

### Restart Services
```bash
docker compose restart
```

### Rebuild Containers
```bash
docker compose up -d --build
```

### Access PHP Container Shell
```bash
docker exec -it assessment_php bash
```

### Access MySQL Container
```bash
docker exec -it assessment_db mysql -uappuser -papppassword assessment_db
```

## 🔒 Security Features

- **Password Hashing:** Uses PHP's `password_hash()` with bcrypt
- **CSRF Protection:** Token-based CSRF protection on all forms
- **Session Management:** Secure PHP sessions for authentication
- **Route Protection:** API endpoints require active sessions
- **Input Validation:** Server-side validation for all user inputs

## 🐛 Troubleshooting

### Containers Won't Start

```bash
# Check for port conflicts
sudo lsof -i :8000
sudo lsof -i :3307
sudo lsof -i :8080

# Remove existing containers and volumes
docker compose down -v
docker compose up -d --build
```

### Database Connection Issues

1. Verify database container is running:
   ```bash
   docker compose ps
   ```

2. Check database logs:
   ```bash
   docker compose logs db
   ```

3. Ensure `.env` file matches `docker-compose.yml` credentials

### Permission Issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

### Can't Access Application

1. Verify containers are running: `docker compose ps`
2. Check application logs: `docker compose logs php`
3. Ensure port 8000 is not blocked by firewall
4. Try accessing: http://127.0.0.1:8000/

## 📊 Database Management

### Backup Database

```bash
docker exec assessment_db mysqldump -uappuser -papppassword assessment_db > backup.sql
```

### Restore Database

```bash
docker exec -i assessment_db mysql -uappuser -papppassword assessment_db < backup.sql
```

### Reset Database

```bash
docker exec -i assessment_db mysql -uappuser -papppassword assessment_db < sql/schema.sql
```

## 🔄 Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild containers
docker compose down
docker compose up -d --build

# Apply database migrations if any
docker exec -i assessment_db mysql -uappuser -papppassword assessment_db < sql/schema.sql
```

## 📝 Development

### Making Changes

1. Edit files in the `public/` directory
2. Changes are reflected immediately (volume mounted)
3. For Docker configuration changes, rebuild:
   ```bash
   docker compose up -d --build
   ```

### Adding New Features

- **Frontend:** Add/modify files in `public/client/`
- **Backend API:** Add endpoints in `public/server/api/`
- **Database:** Update `sql/schema.sql` and re-import

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Docker logs: `docker compose logs`
3. Open an issue on GitHub
