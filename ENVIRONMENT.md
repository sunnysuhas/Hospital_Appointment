# Environment Variables

Use these variables for local development and production deployments.

## Backend

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `DJANGO_SECRET_KEY` | Yes in production | `change-me` | Generate a long random value for Render. |
| `DJANGO_DEBUG` | Yes | `False` | Use `True` locally and `False` in production. |
| `DJANGO_ALLOWED_HOSTS` | Yes | `hospital-api.onrender.com,localhost,127.0.0.1` | Include the Render backend host. |
| `DATABASE_URL` | Yes | `postgresql://postgres:[password]@[host]:5432/postgres?sslmode=require` | Supabase pooled or direct PostgreSQL URL. |
| `DATABASE_SSL_REQUIRE` | Production | `True` | Use `True` for Supabase and Render production. |
| `CORS_ALLOWED_ORIGINS` | Yes | `https://hospital-app.vercel.app,http://localhost:5173` | Include the Vercel frontend URL. |
| `CSRF_TRUSTED_ORIGINS` | Production | `https://hospital-app.vercel.app,https://hospital-api.onrender.com` | Keep this aligned with deployed domains. |

Optional local PostgreSQL fallback variables when `DATABASE_URL` is not set:

```env
POSTGRES_DB=hospital_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
```

## Frontend

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | `https://hospital-api.onrender.com/api/` | Must include the trailing `/api/`. |

## Supabase Setup

1. Create a Supabase project.
2. Open **Project Settings > Database**.
3. Copy the PostgreSQL connection string.
4. Replace `[YOUR-PASSWORD]` with the database password.
5. Add `?sslmode=require` if it is not already present.
6. Set the final value as `DATABASE_URL` in Render.

## Render Backend Setup

1. Create a new **Blueprint** from this repository or create a **Web Service** manually.
2. Use `render.yaml` for the service definition.
3. Set `DJANGO_SECRET_KEY`, `DATABASE_URL`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS`.
4. Deploy. `start.sh` runs `collectstatic`, applies migrations, then starts Gunicorn.

## Vercel Frontend Setup

1. Import the repository in Vercel.
2. Set the framework preset to **Vite**.
3. Use `frontend` as the root directory if prompted.
4. Set `VITE_API_BASE_URL` to the Render backend API URL, for example `https://hospital-api.onrender.com/api/`.
5. Deploy and add the Vercel URL to `CORS_ALLOWED_ORIGINS` in Render.
