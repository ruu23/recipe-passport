# 🍽️ Recipe Passport

<div align="center">

![Recipe Passport Banner](public/recipe-passport-banner.png)

**Discover the World's Flavors, One Recipe at a Time**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://recipe-passport.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)

[Live Demo](https://recipe-passport.vercel.app) · [Report Bug](https://github.com/ruu23/recipe-passport/issues) · [Request Feature](https://github.com/ruu23/recipe-passport/issues)

</div>

---

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
- [Usage](#-usage)
- [Database Schema](#-database-schema)
- [Security & Authorization](#-security--authorization)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🌍 About The Project

**Recipe Passport** is a global culinary exploration platform that transforms recipes into cultural journeys. More than just a recipe app, it connects food with history, culture, and storytelling, creating an immersive experience for food enthusiasts worldwide.

Built as part of the **Project Nexus – ProDev Frontend Engineering Program**, this project demonstrates professional-grade full-stack development with modern tools, clean architecture, and production-ready practices.

### Why Recipe Passport?

- 🌏 **Cultural Immersion**: Experience food as a window into different cultures and traditions
- 📚 **Historical Context**: Learn the stories and history behind each dish
- 🎯 **Professional Engineering**: Built with scalable architecture and best practices
- 🔒 **Secure & Robust**: Production-ready backend with proper authentication and authorization
- 🎨 **Delightful UX**: Travel-inspired design that makes exploration enjoyable

### Project Philosophy

> "Food is not just sustenance—it's culture, history, and human connection served on a plate."

Recipe Passport treats each recipe as a passport stamp, marking your journey through the world's diverse culinary landscape.

---

## ✨ Key Features

### 🧑‍🍳 For Food Explorers

- **🌍 Global Recipe Library**: Browse authentic recipes from countries around the world
- **🔍 Smart Search**: Find recipes by name, ingredients, cuisine, or difficulty level
- **📖 Rich Context**: Access detailed cooking instructions, cultural history, and nutrition benefits
- **⭐ Personal Collection**: Save and organize your favorite recipes
- **📱 Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **🎯 Difficulty Filters**: Choose recipes based on your skill level

### 🔐 Authentication & User Management

- **Secure Authentication**: Email/password signup and login via Supabase Auth
- **User Profiles**: Personalized profiles with role-based access
- **Role System**:
  - **👤 User**: Browse recipes, save favorites, maintain search history
  - **✏️ Editor**: Create and manage recipes, ingredients, and content
  - **👑 Admin**: Full platform control, user management, and moderation

### 🗄️ Backend & Data

- **PostgreSQL Database**: Structured relational data with proper normalization
- **Row Level Security (RLS)**: Database-level security policies for all tables
- **Type Safety**: Fully typed database schema generated from Supabase
- **Real-time Updates**: Live data synchronization across users
- **Optimized Queries**: Efficient data fetching with proper indexing

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **[Next.js 15](https://nextjs.org/)** | React framework with App Router, SSR, and optimization |
| **[React 18](https://react.dev/)** | UI library with hooks and modern patterns |
| **[TypeScript](https://www.typescriptlang.org/)** | Type-safe JavaScript with enhanced DX |
| **[Tailwind CSS](https://tailwindcss.com/)** | Utility-first CSS framework for rapid styling |

### Backend & Database

| Technology | Purpose |
|------------|---------|
| **[Supabase](https://supabase.com/)** | Backend-as-a-Service with PostgreSQL |
| **PostgreSQL** | Robust relational database with JSONB support |
| **Supabase Auth** | Secure authentication and session management |
| **Row Level Security** | Database-level authorization policies |

### Development & Tooling

| Technology | Purpose |
|------------|---------|
| **ESLint** | Code linting and quality enforcement |
| **PostCSS** | CSS transformation and optimization |
| **Vercel** | Deployment and hosting platform |

---

## 🏗 Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface (Next.js)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │  Hooks   │  │  Styles  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Layer (lib/supabase)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Client  │  │   Auth   │  │   API    │  │  Types   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Supabase Backend                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │PostgreSQL│  │   Auth   │  │   RLS    │  │ Storage  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction** → User interacts with Next.js UI
2. **Authentication** → Supabase Auth validates user session
3. **API Request** → Typed API calls through Supabase client
4. **Authorization** → RLS policies enforce access control
5. **Data Retrieval** → PostgreSQL returns authorized data
6. **UI Update** → React components re-render with new data

### Security Layers

```
Frontend Validation → API Type Safety → Row Level Security → Database Constraints
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher)
- **npm** or **pnpm** or **yarn**
- **Git**
- **Supabase Account** (free tier available at [supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ruu23/recipe-passport.git
cd recipe-passport
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Environment Setup

1. **Create a Supabase Project**

   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Note your project URL and anon key

2. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For development
NODE_ENV=development
```

> **⚠️ Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### Database Setup

1. **Run database migrations**

Navigate to your Supabase project dashboard:

- Go to **SQL Editor**
- Run the migration scripts from `supabase/migrations/` (if available)
- Or manually create tables using the schema below

2. **Enable Row Level Security**

Ensure RLS is enabled for all tables and policies are configured as per the security section.

3. **Seed initial data** (Optional)

```sql
-- Example: Insert sample countries
INSERT INTO countries (name, flag_emoji, description, image_url)
VALUES 
  ('Italy', '🇮🇹', 'Home of pasta, pizza, and timeless culinary traditions', 'https://example.com/italy.jpg'),
  ('Japan', '🇯🇵', 'Master of precision, flavor, and artistic presentation', 'https://example.com/japan.jpg'),
  ('Mexico', '🇲🇽', 'Vibrant flavors, rich history, and colorful celebrations', 'https://example.com/mexico.jpg');
```

### Run the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## 💻 Usage

### For Users

1. **Sign Up / Log In**
   - Create an account or log in with existing credentials
   - Access personalized features and save favorites

2. **Browse Recipes**
   - Explore recipes by country on the homepage
   - Use the search bar to find specific dishes

3. **View Recipe Details**
   - See ingredients, instructions, and cooking times
   - Learn about the dish's cultural history and nutrition benefits

4. **Save Favorites**
   - Click the heart icon to save recipes to your collection
   - Access your favorites anytime from your profile

### For Editors & Admins

1. **Manage Content**
   - Add new recipes, countries, and cuisines
   - Edit existing content for accuracy

2. **Moderate Platform**
   - Review user submissions (if enabled)
   - Maintain content quality standards

---

## 🗂 Database Schema

### Core Tables

#### `profiles`
User profiles with role-based access control

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'editor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `countries`
Countries and their culinary information

```sql
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  flag_emoji TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `recipes`
Recipe master records

```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  prep_time INTEGER, -- minutes
  cook_time INTEGER, -- minutes
  servings INTEGER,
  image_url TEXT,
  history TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `ingredients`
Recipe ingredients with quantities

```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity TEXT,
  unit TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `instructions`
Step-by-step cooking instructions

```sql
CREATE TABLE instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `nutrition_benefits`
Nutritional information and health benefits

```sql
CREATE TABLE nutrition_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_name TEXT,
  benefit_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `favorites`
User-saved favorite recipes

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);
```

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  countries  │───┐   │   recipes   │───┬───│ ingredients │
└─────────────┘   │   └─────────────┘   │   └─────────────┘
                  │           │          │
                  └───────────┘          ├───┌─────────────┐
                                         │   │instructions │
                                         │   └─────────────┘
                                         │
                                         ├───┌─────────────┐
                                         │   │  nutrition  │
                                         │   │  _benefits  │
                                         │   └─────────────┘
                                         │
┌─────────────┐                          │   ┌─────────────┐
│  profiles   │──────────────────────────┴───│  favorites  │
└─────────────┘                              └─────────────┘
```

---

## 🔐 Security & Authorization

### Row Level Security (RLS) Policies

All tables are protected with carefully designed RLS policies:

#### Public Read Access

```sql
-- Anyone can read countries and recipes
CREATE POLICY "Public read access" ON countries FOR SELECT USING (true);
CREATE POLICY "Public read access" ON recipes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON ingredients FOR SELECT USING (true);
CREATE POLICY "Public read access" ON instructions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON nutrition_benefits FOR SELECT USING (true);
```

#### User-Specific Access

```sql
-- Users can only see their own favorites
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);
```

#### Admin/Editor Access

```sql
-- Only editors and admins can modify recipes
CREATE POLICY "Editors can insert recipes" ON recipes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('editor', 'admin')
    )
  );
```

### Authentication Flow

1. **Sign Up** → User creates account → Profile created with 'user' role
2. **Sign In** → Credentials validated → JWT token issued
3. **Authorization** → RLS policies check user role → Data access granted/denied
4. **Session Management** → Secure cookie-based sessions with automatic refresh

### Best Practices Implemented

- ✅ Never expose service role keys in frontend
- ✅ Use anon key with RLS for all client-side queries
- ✅ Validate user input on both frontend and backend
- ✅ Implement proper password requirements
- ✅ Use prepared statements to prevent SQL injection
- ✅ Enable rate limiting on authentication endpoints

---

## 📁 Project Structure

```
recipe-passport/
├── components/           # React components
│   ├── layout/          # Layout components (Header, Footer)
│   ├── recipes/         # Recipe-related components
│   ├── countries/       # Country-related components
│   └── auth/            # Authentication components
│
├── hooks/               # Custom React hooks
│   ├── useRole.ts       # Role-based access control hook
│   ├── useAuth.ts       # Authentication hook
│   └── useRecipes.ts    # Recipe data fetching hook
│
├── lib/                 # Core utilities and configurations
│   └── supabase/        # Supabase integration
│       ├── client.ts    # Supabase client initialization
│       ├── auth.ts      # Authentication utilities
│       ├── api.ts       # API helper functions
│       └── database.types.ts  # Generated TypeScript types
│
├── pages/               # Next.js pages (App Router)
│   ├── index.tsx        # Homepage
│   ├── recipes/         # Recipe pages
│   ├── countries/       # Country pages
│   ├── auth/            # Auth pages (login, signup)
│   └── profile/         # User profile pages
│
├── public/              # Static assets
│   ├── images/          # Images and media
│   └── icons/           # Icons and logos
│
├── styles/              # Global styles and Tailwind config
│   └── globals.css      # Global CSS
│
├── .env.local           # Environment variables (not in repo)
├── .gitignore           # Git ignore rules
├── next.config.ts       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

---

## 🗺 Roadmap

### Phase 1: Core Features ✅
- [x] Authentication system
- [x] Recipe browsing
- [x] Country exploration
- [x] User favorites
- [x] Search functionality
- [x] Responsive design

### Phase 2: Enhanced UX 🚧
- [ ] Advanced search filters (dietary restrictions, prep time, difficulty)
- [ ] Recipe ratings and reviews
- [ ] User-generated content (community recipes)
- [ ] Recipe collections and meal planning
- [ ] Print-friendly recipe cards

### Phase 3: Social Features 📅
- [ ] User profiles with bio and avatar
- [ ] Follow other users
- [ ] Share recipes on social media
- [ ] Recipe comments and discussions
- [ ] Community challenges and events

### Phase 4: Advanced Features 🔮
- [ ] Multi-language support (i18n)
- [ ] Progressive Web App (PWA)
- [ ] Offline mode
- [ ] Voice-guided cooking mode
- [ ] AI-powered recipe recommendations
- [ ] Shopping list generation
- [ ] Nutritional calculator and meal planning

### Phase 5: Platform Expansion 🌟
- [ ] Mobile apps (React Native)
- [ ] Admin dashboard with analytics
- [ ] Content moderation tools
- [ ] API for third-party integrations
- [ ] Premium subscription features

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features when applicable
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 📞 Contact

**Project Maintainer**: [@ruu23](https://github.com/ruu23)

**Project Link**: [https://github.com/ruu23/recipe-passport](https://github.com/ruu23/recipe-passport)

**Live Demo**: [https://recipe-passport.vercel.app](https://recipe-passport.vercel.app)

---

## 🙏 Acknowledgments

This project was built as part of **Project Nexus – ProDev Frontend Engineering Program**, focusing on:

- Professional full-stack development practices
- Modern React and Next.js patterns
- Production-ready backend architecture
- Clean code and maintainable design
- Real-world problem solving

### Special Thanks To

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Vercel](https://vercel.com/) - Deployment and hosting platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- All contributors and supporters of this project

---

<div align="center">

**Made with ❤️ and 🍝 by the Recipe Passport Team**

[⬆ Back to Top](#-recipe-passport)

</div>
