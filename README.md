# Escualia

Plataforma SaaS para autoescuelas españolas. Monorepo con Turborepo + pnpm.

## Estructura

```
escualia/
├── apps/
│   ├── app/        → SaaS (Next.js 16, puerto 3000)
│   └── landing/    → Landing pública (Next.js 16, puerto 3001)
├── packages/       → Paquetes compartidos
└── brand/          → Brandbook y tokens de diseño
```

## Requisitos

- Node.js >= 18
- pnpm 9

## Arrancar en local

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Variables de entorno

Crea `apps/app/.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Crea `apps/landing/.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Las claves están en el panel de Supabase → Project Settings → API.

### 3. Arrancar

Todo a la vez:

```bash
pnpm dev
```

Solo la app SaaS:

```bash
pnpm dev --filter=app
```

Solo la landing:

```bash
pnpm dev --filter=landing
```

- App SaaS → [http://localhost:3000](http://localhost:3000)
- Landing → [http://localhost:3001](http://localhost:3001)

## Supabase — configuración necesaria

En el panel de Supabase (Authentication → URL Configuration):

- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: `http://localhost:3000/auth/callback`

En producción añade también las URLs de Vercel.

## Deploy

El proyecto está desplegado en Vercel. Cada push a `main` despliega automáticamente.

Las variables de entorno de producción se gestionan en el panel de Vercel (Settings → Environment Variables).
