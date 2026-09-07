# Aplikasi Manajemen Kontak (Laravel + React)

Aplikasi fullstack modern untuk mengelola buku kontak pribadi dengan fitur multi nomor telepon, tanggal lahir (beserta kalkulasi usia & filter ultah), alamat, serta sistem autentikasi per-user (multi-tenant data isolation).

---

## 🚀 Struktur Direktori

```text
latihan-deploy-laravel-react/
├── backend/                # Laravel API Application

│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php      # Login, Register, Logout, User Profile
│   │   │   └── ContactController.php   # CRUD Kontak + Multi Nomor Telepon (Ownership isolated)
│   │   ├── Http/Resources/
│   │   │   ├── ContactResource.php
│   │   │   ├── ContactPhoneResource.php
│   │   │   └── UserResource.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Contact.php
│   │       └── ContactPhone.php
│   ├── database/migrations/
│   ├── .env.example
│   └── routes/api.php
│
└── frontend/               # React SPA Application (Vite + Tailwind CSS)
    ├── src/
    │   ├── api/axios.js            # Axios client with Bearer Token interceptor
    │   ├── context/AuthContext.jsx # Auth state provider (login/register/logout)
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── StatCards.jsx
    │   │   ├── ContactCard.jsx
    │   │   ├── ContactRow.jsx
    │   │   ├── ContactModal.jsx       # Dynamic add/remove multi phone numbers
    │   │   ├── ContactDetailModal.jsx # Full detail view
    │   │   ├── DeleteConfirmModal.jsx # Delete alert confirmation
    │   │   └── Toast.jsx              # Feedback notifications
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── DashboardPage.jsx
    │   ├── App.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

## 🛠️ Panduan Menjalankan Aplikasi

### 1. Menjalankan Backend (Laravel API)

1. Masuk ke direktori `backend`:
   ```bash
   cd backend
   ```
2. Salin environment file (jika belum ada `.env`):
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
3. Sesuaikan konfigurasi database MySQL di file `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=kontak_app
   DB_USERNAME=root
   DB_PASSWORD=
   ```
4. Jalankan migrasi dan seeder database:
   ```bash
   php artisan migrate --seed
   ```
5. Jalankan server Laravel API:
   ```bash
   php artisan serve
   ```
   *Backend API akan aktif di `http://127.0.0.1:8000`*.

---

### 2. Menjalankan Frontend (React SPA)

1. Buka terminal baru dan masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```
2. Jalankan dev server Vite:
   ```bash
   npm run dev
   ```
   *Frontend akan aktif di `http://localhost:5173`*.

---

## 🔐 Akun Uji Coba (Demo Seeders)

Setelah menjalankan `php artisan migrate --seed`, Anda dapat langsung mencoba login dengan akun bawaan:

- **Akun 1 (Utama)**:
  - Email: `demo@example.com`
  - Password: `password`
- **Akun 2 (Uji Isolasi Data)**:
  - Email: `user2@example.com`
  - Password: `password`

> **Uji Isolasi Multi-Tenant:** Kontak yang dibuat oleh `demo@example.com` **tidak akan terlihat maupun bisa diakses/diubah/dihapus** oleh akun `user2@example.com` (terproteksi otomatis di level query & controller dengan response `403 Forbidden`).

---

## 🧪 Menjalankan Automated Test

Untuk menjalankan automated unit & feature test backend Laravel:
```bash
cd backend
php artisan test
```
