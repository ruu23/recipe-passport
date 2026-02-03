# 🍽️ Recipe Passport
## Discover the World’s Flavors, One Recipe at a Time

---

## 🌍 What is Recipe Passport?

**Recipe Passport** is a global culinary exploration platform designed to discover recipes from around the world — not only as meals, but as **culture, history, and storytelling**.

This project combines **modern frontend engineering** with a **real production-ready backend**, delivering a secure, scalable, and interactive experience.

Built as part of **Project Nexus – ProDev Frontend Engineering Program**, it reflects professional workflows, clean architecture, and long-term product thinking.

---

## 🎯 Why Recipe Passport Matters

This project represents a shift from learning projects to **real-world software engineering**.

Recipe Passport demonstrates how to:

🚀 Build a full-stack application using modern tools  
🛠 Design and secure a real backend (not mock data)  
📚 Apply UX, architecture, and data modeling together  
🎯 Create a portfolio-ready product  
🌍 Connect cultures through food and storytelling  

---

## ✨ Project Vision

Recipe Passport goes beyond a traditional recipe app:

✔️ See food as a cultural journey  
✔️ Preserve culinary heritage and stories  
✔️ Deliver a cozy, travel-inspired experience  
✔️ Scale easily with new countries and features  
✔️ Follow professional engineering standards  

---

## 📌 Key Features

### 🧑‍🍳 User Experience
- Browse recipes by country and cuisine  
- Search recipes by name, description, or ingredients  
- View detailed steps, history, and nutrition benefits  
- Save favorite recipes  
- Responsive design for all devices  

### 🔐 Authentication & Roles
- Secure signup & login using **Supabase Auth**
- User profiles stored in a dedicated `profiles` table
- Role-based access:
  - **User**: browse & save favorites
  - **Editor**: manage recipes and ingredients
  - **Admin**: full control (recipes, countries, users)

### 🗄️ Data & Backend Logic
- PostgreSQL database with structured relations
- Row Level Security (RLS) for all sensitive tables
- Public read access for content
- User-specific access for favorites & search history
- Admin/editor-only write permissions

---

## 🛠 Technology Stack

### 🧠 Frontend
- **Next.js** — routing, SSR, modern app structure  
- **React + TypeScript** — fully typed UI  
- **Tailwind CSS** — clean, responsive styling  

### 🗃 Backend (Supabase)
- Supabase Auth (email/password)
- PostgreSQL database
- Row Level Security (RLS)
- Generated TypeScript database types
- Secure client-side API integration

---

## 🏗️ Architecture Overview

1. User visits the application  
2. Authentication handled via Supabase  
3. Frontend queries typed Supabase APIs  
4. Public data fetched (countries, recipes)  
5. Private data protected by RLS (favorites, profiles)  
6. UI updates dynamically with type safety  

---

## 🗂 Database Design (Simplified)

### Profiles
- `id`, `full_name`, `email`, `role`, `created_at`

### Countries
- `id`, `name`, `flag_emoji`, `description`, `image_url`

### Recipes
- `id`, `country_id`, `name`, `history`, `difficulty`, `times`

### Ingredients
- `id`, `recipe_id`, `name`, `quantity`, `order_index`

### Instructions
- `id`, `recipe_id`, `step_number`, `instruction_text`

### Nutrition Benefits
- `id`, `recipe_id`, `ingredient_name`, `benefit_text`

### Favorites
- `id`, `user_id`, `recipe_id`

All tables are protected using **Supabase RLS policies**.

---

## 🔐 Security & Access Control

✔️ Public read-only access for content  
✔️ User-specific access for favorites & profiles  
✔️ Admin/editor-only access for data modification  
✔️ Database-level security (not frontend-only)  
✔️ Typed Supabase client prevents invalid queries  

---

## 📈 Workflow & Development Process

✔️ Database schema design  
✔️ RLS policy implementation  
✔️ Role-based authorization  
✔️ Typed API layer  
✔️ Custom React hooks for roles  
✔️ Error handling & edge cases  
✔️ Ready for frontend UI implementation  

---

## 🎨 Design & UX Direction

Inspired by:

✨ Travel journals  
✨ Cultural storytelling  
✨ Cozy, warm aesthetics  
✨ Clean typography & food imagery  

The goal is to make users **feel at home while exploring the world**.

---

## 📂 Repository Structure

```bash
recipe-passport/
│── lib/
│   └── supabase/
│       ├── client.ts
│       ├── auth.ts
│       ├── api.ts
│       └── database.types.ts
│── hooks/
│   └── useRole.ts
│── components/
│── pages/
│── styles/
│── README.md
```
---

## 🛠 Future Enhancements

- Multi-language support
- PWA offline mode
- User comments & ratings
- Admin dashboard UI
- Community & social sharing

---

## 📌 Final Note

Recipe Passport is not just a project —  
it is a long-term, scalable product foundation that demonstrates:

- 🧠 Engineering mindset  
- 📐 Clean architecture  
- 🎨 Thoughtful UX  
- 🔥 Production-level thinking  

---

## 🚀 Project Links

GitHub Repository:
https://github.com/ruu23/recipe-passport

Live Demo: Coming soon

---
