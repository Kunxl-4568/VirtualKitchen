# Virtual Kitchen - Recipe Management System

Virtual Kitchen is a full-stack web application that allows users to create, manage, and share recipes. Built with Laravel (Backend) and React (Frontend), it provides a modern and intuitive interface for cooking enthusiasts.

## 🌟 Features

- User Authentication & Authorization
- Recipe CRUD Operations
- Image Upload Support
- Categories and Cuisines Management
- Ingredient Management
- Step-by-Step Instructions
- Responsive Design
- Real-time Form Validation
- Advanced Search & Filtering

## 🛠️ Tech Stack

### Backend
- Laravel 10
- MySQL
- PHP 8.1+
- Sanctum for Authentication
- Storage Management for Images

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios for API calls
- React Router v6
- Context API for State Management

## 📋 Prerequisites

- PHP >= 8.1
- Node.js >= 16
- MySQL >= 8.0
- Composer
- npm or yarn

## ⚙️ Installation

1. Clone the repository
```bash
git clone https://github.com/Kunxl-4568/VirtualKitchen.git
cd VirtualKitchen
```

2. Backend Setup
```bash
cd VkBackend
composer install
cp .env.example .env
php artisan key:generate
```

3. Configure Database in `.env`
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=virtualkitchen
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

4. Run Migrations and Seeders
```bash
php artisan migrate
php artisan db:seed
php artisan storage:link
```

5. Frontend Setup
```bash
cd ../vkfrontend
npm install
cp .env.example .env
```

6. Configure Frontend Environment
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🚀 Running the Application

1. Start Backend Server
```bash
cd VkBackend
php artisan serve
```

2. Start Frontend Development Server
```bash
cd vkfrontend
npm run dev
```

## 📁 Project Structure

```
VirtualKitchen/
├── VkBackend/                # Laravel Backend
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── storage/
└── vkfrontend/              # React Frontend
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── views/
    │   └── assets/
    └── public/
```

## 🔐 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout

### Recipes
- GET `/api/recipes` - List all recipes
- POST `/api/recipes` - Create new recipe
- GET `/api/recipes/{id}` - Get single recipe
- PUT `/api/recipes/{id}` - Update recipe
- DELETE `/api/recipes/{id}` - Delete recipe

### Categories & Cuisines
- GET `/api/categories` - List categories
- GET `/api/cuisines` - List cuisines

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👥 Authors

- Kunal - Initial work - [Kunxl-4568](https://github.com/YourGithubUsername)

## 🙏 Acknowledgments

- Laravel Team
- React Team
- TailwindCSS Team
- All contributors who helped with the project
