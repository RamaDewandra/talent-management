# Talent Management System

A complete HR-centric Talent Management System built with Laravel 10 (Backend API) and React (Frontend), featuring 9-box talent classification based on performance and potential assessments.

## Features

- **Authentication**: Laravel Sanctum SPA authentication
- **Role-based Access**: HR, Manager, and Employee roles
- **Assessment Management**: Create, edit, and submit employee assessments
- **9-Box Talent Matrix**: Automatic classification based on performance and potential scores
- **Dashboard**: Visual representation of talent distribution
- **Period Management**: HR can manage assessment periods
- **Indicator Management**: Configurable performance and potential indicators with weights

## Tech Stack

- **Backend**: Laravel 10, PHP 8.x, MySQL
- **Frontend**: React 18, Vite, React Router
- **Authentication**: Laravel Sanctum (SPA mode)
- **Architecture**: MVC + Service Layer pattern

## Project Structure

```
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   ├── Middleware/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   ├── Repositories/
│   │   └── Services/
│   └── database/
│       ├── migrations/
│       └── seeders/
│
└── frontend/                # React SPA
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── services/
```

## Setup Instructions

### Prerequisites

- PHP 8.1+
- Composer
- Node.js 18+
- MySQL

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure database in `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=talent_management
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. Generate application key:
   ```bash
   php artisan key:generate
   ```

6. Create the database:
   ```sql
   CREATE DATABASE talent_management;
   ```

7. Run migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```

8. Start the development server:
   ```bash
   php artisan serve
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Default Users

After seeding, you can login with:

| Role     | Email              | Password |
|----------|-------------------|----------|
| HR       | hr@example.com    | password |
| Manager  | manager@example.com | password |
| Employee | employee@example.com | password |

## API Endpoints

### Authentication
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

### Assessment Periods (HR only for write operations)
- `GET /api/periods` - List periods
- `POST /api/periods` - Create period
- `PUT /api/periods/{id}` - Update period
- `POST /api/periods/{id}/activate` - Activate period
- `POST /api/periods/{id}/close` - Close period

### Indicators (HR only for write operations)
- `GET /api/performance-indicators` - List performance indicators
- `GET /api/potential-indicators` - List potential indicators
- `POST /api/performance-indicators` - Create performance indicator
- `POST /api/potential-indicators` - Create potential indicator

### Assessments (HR and Managers)
- `GET /api/assessments` - List assessments
- `POST /api/assessments` - Create assessment
- `GET /api/assessments/{id}` - Get assessment
- `PUT /api/assessments/{id}` - Update assessment
- `POST /api/assessments/{id}/submit` - Submit assessment

### Dashboard
- `GET /api/dashboard/summary` - Get summary statistics
- `GET /api/dashboard/9box` - Get 9-box matrix data

## 9-Box Classification Logic

The system calculates weighted scores and classifies employees into 9 categories:

**Score Levels:**
- Low: score < 2.5
- Medium: 2.5 ≤ score ≤ 3.5
- High: score > 3.5

**9-Box Categories:**

|                | Low Performance | Medium Performance | High Performance |
|----------------|-----------------|-------------------|------------------|
| **High Potential** | Inconsistent Player | High Potential | Star |
| **Medium Potential** | Underperformer | Core Player | High Performer |
| **Low Potential** | Risk | Average Performer | Solid Performer |

## Business Rules

1. Managers can only assess employees in their department
2. Assessments cannot be submitted if incomplete (all indicators must be scored)
3. Once submitted, assessments cannot be edited
4. Only one assessment period can be active at a time
5. Scores are automatically calculated using weighted averages

## License

MIT
