# EmployeeApp

Angular 14 frontend for managing employees and Georgian railway (train) schedules. Users sign in with JWT authentication, work against a REST API, and can switch the UI between English and Georgian.

This repository is the **client application only**. A backend API must be running and reachable at the URL in `src/environments/environment.ts`.

---

## Features

- **Authentication** — sign in, sign up, logout; JWT stored in `localStorage`
- **Role-based UI** — Admin, Manager, and other roles see different actions
- **Dashboard** — counts and recent records for employees and trains; Admin can manage roles
- **Employees** — list, search, sort, paginate, add/edit, view detail, deactivate, confirm (lock), history, activity logs, Excel export
- **Railway schedules** — list, filter by direction, sort, paginate, add/edit, delete, confirm (lock), Excel export
- **i18n** — English (`en`) and Georgian (`ka`) via `@ngx-translate`
- **Toasts and confirms** — in-app alerts and confirmation dialogs before destructive or locking actions

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Angular 14 (NgModules, not standalone) |
| Language | TypeScript 4.7 |
| HTTP | `HttpClient` + JWT interceptor |
| Forms | Template-driven (`FormsModule`) |
| Routing | Angular Router + `AuthGuard` |
| i18n | `@ngx-translate/core` + HTTP JSON loader |
| Excel | `xlsx` + `file-saver` |

---


## Getting started

```bash
npm install
npm start
```

`ng serve` starts the app at [http://localhost:4200/](http://localhost:4200/). Unauthenticated visits to protected routes redirect to `/login`.

---

## Authentication and roles

Session is kept as JSON in `localStorage` under `currentUser`:

```ts
{ token: string; username: string; role: string }
```

`AuthInterceptor` attaches `Authorization: Bearer <token>` to outgoing HTTP requests when a token exists.

`AuthGuard` allows access to all routes except `/login` only when `isLoggedIn()` is true (a user object with a non-empty token).

### Password rules (registration)

- At least 8 characters
- One uppercase letter, one lowercase letter, one digit, one special character

### Role-based UI (frontend)

The API is expected to enforce the same rules. The UI currently behaves as follows:

| Action | Admin | Manager | Other |
|--------|-------|---------|--------|
| View lists, dashboard, employee detail | Yes | Yes | Yes |
| Add employee / train | Yes | No | No |
| Edit employee | Yes | Yes | No |
| Deactivate employee | Yes | No | No |
| Confirm (lock) employee or train | Yes | No | No |
| Edit / delete train | Yes | No | No |
| Manage roles on dashboard | Yes | No | No |

**Confirm** is treated as a lock: a confirmed employee or train shows a confirmed badge and loses edit/delete/deactivate/confirm actions in the UI.

Employee **delete** in the UI is labeled **Deactivate** (soft deactivate), not a hard remove.

---

## Application routes

| Path | Component | Guard |
|------|-----------|-------|
| `/login` | Login / register | None |
| `/` | Redirect to `/dashboard` | — |
| `/dashboard` | Dashboard | Auth |
| `/employees` | Employee list | Auth |
| `/employees/add` | Employee form | Auth |
| `/employees/edit/:id` | Employee form | Auth |
| `/employees/detail/:id` | Employee detail | Auth |
| `/railway` | Train schedule list | Auth |
| `/railway/add` | Train form | Auth |
| `/railway/edit/:id` | Train form | Auth |

Shell layout (`app.component.html`): header, routed `main`, footer, global alert, confirm dialog.

---

## Screens

### Login

Tabs for **Sign In** and **Sign Up**. Registration loads roles from the API and submits `username`, `password`, and `roleId` (default `2`). Duplicate username is shown as a 409 conflict.

### Dashboard

Clickable summary cards (totals, active/deactivated employees, confirmed counts, train directions Tbilisi → Regions / Regions → Tbilisi), recent employees and trains, and (Admin only) add/delete application roles.

### Employees

Search by name, email, or position; column sort; 10 rows per page; Excel export of the filtered list; optional **full history** (including deactivated) and **activity logs**. Logs are color-coded by action (`ADD`, `UPDATE`, `DEACTIVATE`, `VIEW`).

Employee fields: `name`, `email`, `position`, `salary`, `isActive`, `isConfirmed`.

### Railway

Filter by direction (`Tbilisi-Regions`, `Regions-Tbilisi`, or all); sort; pagination; Excel export.

Train fields: `direction`, `departure`, `arrival`, `travelTime`, `tripNumber`, `tickets`, `isConfirmed`.

---

## API surface used by this app

Base path: `{apiUrl}` (for example `https://localhost:7291/api`).

### Auth

| Method | Path | Notes |
|--------|------|--------|
| POST | `/auth/login` | Body: `{ username, password }` → `AuthResponse` |
| POST | `/auth/register` | Body: `{ username, password, roleId }` |
| POST | `/auth/logout` | Bearer token |
| GET | `/auth/roles` | Role list |
| POST | `/auth/roles` | Create role |
| DELETE | `/auth/roles/{id}` | Delete role |

### Employees

| Method | Path |
|--------|------|
| GET | `/employees` |
| GET | `/employees/{id}` |
| GET | `/employees/with-history` |
| POST | `/employees` |
| PUT | `/employees/{id}` |
| DELETE | `/employees/{id}` |
| PATCH | `/employees/{id}/confirm` |

### Logs

| Method | Path |
|--------|------|
| GET | `/log` |
| GET | `/log/employee/{id}` |

### Trains

| Method | Path |
|--------|------|
| GET | `/trains` |
| GET | `/trains/{id}` |
| POST | `/trains` |
| PUT | `/trains/{id}` |
| DELETE | `/trains/{id}` |
| PATCH | `/trains/{id}/confirm` |

`EmployeeService` and `RailwayService` extend `BaseService<T>` (`getAll`, `getById`, `add`, `update`, `delete`) and add `confirm` (and employee-specific history/log methods).

---

## Project structure

```
src/
  app/
    components/
      dashboard/
      login/login/
      employee/          # list, form, detail
      railway/           # list, form
    guards/              # AuthGuard
    interceptors/        # AuthInterceptor (JWT)
    models/              # Employee, Train, Role, AuthResponse, EmployeeLog
    services/            # auth, employee, railway, excel, alert, confirm, base
    shared/              # header, footer, alert, confirm-dialog
    app-routing.module.ts
    app.module.ts
  assets/
    i18n/en.json
    i18n/ka.json
    images/
  environments/
```

---

## Internationalization

Default language is English. The header switches `en` / `ka`. Translation files:

- `src/assets/i18n/en.json`
- `src/assets/i18n/ka.json`

Loader prefix: `./assets/i18n/`. Navigation, tables, forms, alerts, and confirm messages use translate keys. Login copy is currently hard-coded in English.

---

## Shared UI services

- **AlertService** — success / error / warning / info toasts; auto-dismiss after 3 seconds
- **ConfirmService** — promise-based modal used before deactivate, delete, and confirm-lock
- **ExcelService** — writes a `.xlsx` named `{fileName}_{YYYY-M-D}.xlsx`
