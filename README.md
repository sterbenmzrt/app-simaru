# Simaru - Room Reservation Application

Simaru is a web-based application designed for managing and reserving rooms. It provides a user-friendly interface for users to view available rooms, make reservations, and manage existing bookings. Administrators have access to a dashboard to manage rooms, facilities, users, and view all reservations.

## Project Overview

This project is built with a modern tech stack, featuring a powerful backend and a dynamic frontend.

- **Backend:** Laravel (PHP)
- **Frontend:** React with TypeScript, Inertia.js, and Tailwind CSS
- **Database:** SQLite (by default)

## Features

- User authentication (login, registration)
- Dashboard for managing reservations, rooms, and users
- Room and facility management
- Reservation calendar view
- User management

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js & npm
- A web server (the local PHP server is used in development)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/app-simaru.git
    cd app-simaru
    ```

2.  **Install PHP dependencies:**
    ```bash
    composer install
    ```

3.  **Install JavaScript dependencies:**
    ```bash
    npm install
    ```

4.  **Set up your environment:**
    -   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    -   Generate an application key:
        ```bash
        php artisan key:generate
        ```

5.  **Set up the database:**
    -   Create the SQLite database file:
        ```bash
        touch database/database.sqlite
        ```
    -   Run the database migrations:
        ```bash
        php artisan migrate
        ```

6.  **Seed the database (optional):**
    If you want to populate the database with some initial data, you can run the database seeders:
    ```bash
    php artisan db:seed
    ```

### Running the Application

To run the application in a local development environment, you can use the following command. This will start the PHP server, the Vite development server, and the queue listener concurrently.

```bash
npm run dev
```

The application will be available at `http://localhost:8000` (or the address provided by `php artisan serve`).

### Building for Production

To build the frontend assets for production, run:

```bash
npm run build
```
