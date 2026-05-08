# AutoCare Ecosystem

Avtomobil egalari, ustaxonalar va ehtiyot qismlar do'konlarini birlashtiruvchi to'liq platforma.

---

## Tezkor ishga tushirish (Quick Start)

### 1. PostgreSQL bazasini yaratish
```bash
psql -U postgres
CREATE DATABASE autocare_db;
\q
```

### 2. Backend
```bash
cd backend

# .env fayl yaratish
cp .env.example .env
# .env ni o'zingizning ma'lumotlar bilan to'ldiring (DB_PASSWORD va JWT_SECRET)

# Paketlarni o'rnatish
npm install

# Ishga tushirish (jadvallar avtomatik yaratiladi)
npm run start:dev
```
Backend ishlayotgan manzil: `http://localhost:3000`  
Swagger UI: `http://localhost:3000/api/docs`

### 3. Frontend
```bash
cd frontend

# .env.local yaratish
cp .env.local.example .env.local

# Paketlarni o'rnatish
npm install

# shadcn/ui bir martalik sozlash
npx shadcn@latest init
# Savollar: Default style → Slate base color → Yes (CSS variables)

# Ishga tushirish
npm run dev
```
Frontend manzili: `http://localhost:3001`

---

## Loyiha tuzilmasi

```
car.service/
├── backend/                          ← NestJS API (Port 3000)
│   ├── src/
│   │   ├── entities/                 5 ta TypeORM entity
│   │   ├── modules/
│   │   │   ├── auth/                 JWT + RBAC
│   │   │   ├── workshops/            Ustaxona paneli API
│   │   │   └── driver/               Haydovchi API
│   │   ├── app.module.ts
│   │   └── main.ts                   Swagger + CORS + ValidationPipe
│   ├── .env.example                  ← Muhim: nusxa olib .env yarating
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                         ← Next.js 15 (Port 3001)
    └── src/
        ├── app/
        │   ├── layout.tsx            Root layout (Providers ichida)
        │   ├── providers.tsx         QueryClient + AuthProvider
        │   ├── middleware.ts         Route himoyasi (login tekshiruvi)
        │   ├── auth/
        │   │   ├── login/page.tsx
        │   │   └── register/page.tsx
        │   └── dashboard/
        │       ├── layout.tsx        DashboardLayout wrapper
        │       ├── page.tsx          Bosh sahifa (statistika + jadval)
        │       ├── appointments/     Navbatlar
        │       ├── vehicles/         Virtual garaj
        │       ├── masters/          Ustalar ro'yxati
        │       ├── history/          Servis tarixi (Digital Service Book)
        │       └── settings/         Sozlamalar
        ├── components/
        │   ├── layout/DashboardLayout.tsx   Sidebar + Header + Mobile nav
        │   └── dashboard/
        │       ├── StatsGrid.tsx
        │       └── AppointmentsTable.tsx
        ├── hooks/useApi.ts           Barcha React Query hooklar
        ├── lib/
        │   ├── api.ts                Axios instance (JWT interceptor)
        │   ├── auth.tsx              AuthContext + AuthProvider
        │   └── utils.ts             cn() helper
        └── types/index.ts            TypeScript interfaclar
```

---

## API Endpointlar

```
POST  /api/v1/auth/register          Ro'yxatdan o'tish
POST  /api/v1/auth/login             Kirish → JWT token
GET   /api/v1/auth/me                Joriy foydalanuvchi [JWT]

GET   /api/v1/driver/workshops       Ustaxonalar ro'yxati [DRIVER]
POST  /api/v1/driver/vehicles        Mashina qo'shish [DRIVER]
GET   /api/v1/driver/vehicles        Mening mashinalarim [DRIVER]
GET   /api/v1/driver/vehicles/:id/history  Mashina tarixi [DRIVER]
POST  /api/v1/driver/appointments    Navbat olish [DRIVER]
GET   /api/v1/driver/appointments    Mening navbatlarim [DRIVER]
PATCH /api/v1/driver/appointments/:id/cancel  Navbatni bekor qilish [DRIVER]

GET   /api/v1/workshop/me            Ustaxona ma'lumotlari [WORKSHOP_ADMIN|MASTER]
GET   /api/v1/workshop/stats         Dashboard statistikasi [WORKSHOP_ADMIN]
GET   /api/v1/workshop/appointments  Navbatlar ro'yxati [WORKSHOP_ADMIN|MASTER]
PATCH /api/v1/workshop/appointments/:id/status  Status yangilash
POST  /api/v1/workshop/service-history  Servis tarixi qo'shish
GET   /api/v1/workshop/masters       Ustalar [WORKSHOP_ADMIN]
GET   /api/v1/workshop/vehicle/:id/history  Mashina tarixi
```

Barcha endpointlar Swagger UI da vizual test qilinishi mumkin:
`http://localhost:3000/api/docs`

---

## Tuzatilgan xatolar (v2 — bu versiya)

| Fayl | Muammo | Tuzatish |
|------|--------|----------|
| `app/layout.tsx` | `AuthProvider` va `QueryClientProvider` umuman yo'q edi | `providers.tsx` yaratib, root layoutga qo'shildi |
| `middleware.ts` | Fayl umuman yo'q edi — har kim dashboardga kira olardi | Route himoyasi yaratildi |
| `lib/auth.tsx` | Token faqat localStorage da saqlandi — middleware o'qiy olmasdi | Cookie ga ham yozadigan qilindi |
| `DashboardLayout.tsx` | Haqiqiy user ma'lumotlari ishlatilmasdi — hardcoded "Workshop Admin" | `useAuth()` hookga ulandi |
| `DashboardLayout.tsx` | Auth bo'lmagan foydalanuvchi uchun redirect yo'q edi | `useEffect` → `router.push('/auth/login')` |
| `auth.service.ts` | Timing attack himoyasi yo'q edi (user topilmasa tez javob) | Har doim bcrypt.compare chaqiriladi |
| `app.module.ts` | `parseInt(process.env.DB_PORT)` → `NaN` bo'lishi mumkin edi | `parseInt(..., '5432')` fallback |
| `main.ts` | CORS faqat bitta origin qabul qilardi | Array of origins + credentials |
| `dashboard/page.tsx` | Faqat hardcoded demo ma'lumot — API ga ulanmagan | API data → demo fallback pattern |
| `history/page.tsx` | Fayl umuman yo'q edi — 404 xato | To'liq sahifa yaratildi |
| `vehicles/page.tsx` | Form validatsiyasi yo'q edi | Client-side tekshiruv qo'shildi |
| `useApi.ts` | `useWorkshopStats` import qilinmagan edi | Export qilindi |
| `api.ts` | 401 da cookie ham o'chirilmasdi — stale state | Cookie va localStorage ikkalasi tozalanadi |
| Nav active state | Sub-sahifalar (e.g. `/dashboard/appointments/123`) active emas ko'rinardi | `startsWith` tekshiruvi qo'shildi |

---

## Keyingi bosqichlar (Qilinmagan)

- [ ] Super Admin moduli — ustaxonalarni tasdiqlash/rad etish
- [ ] Store Owner moduli — ehtiyot qismlar katalogi
- [ ] Navbat yaratish modali (forma bilan)
- [ ] Email/SMS bildirishnomalar (Nodemailer / SMS.uz)
- [ ] Fayl yuklash (mashina rasmi, hujjatlar)
- [ ] Dark mode toggle tugmasi
- [ ] Docker + docker-compose (postgres + backend + frontend)
- [ ] PWA (manifest.json, service worker)
- [ ] Unit testlar (Jest)
