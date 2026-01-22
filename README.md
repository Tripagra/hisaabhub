# HisabHub - Professional Tax Services Platform

A modern, industrial-level tax services platform built with Next.js, TypeScript, and Supabase.

## 🚀 Features

- **Professional Tax Services**: ITR filing, GST services, tax planning
- **Server-Side Rendering**: Optimized for SEO and performance
- **Real-time Authentication**: Secure user management with Supabase
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **API Routes**: Built-in backend functionality
- **Testing**: Comprehensive test suite with Vitest
- **Industrial Grade**: Production-ready architecture

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: Zustand + React Query
- **Testing**: Vitest + Testing Library
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hisabhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Update .env.local with your Supabase credentials
   ```

4. **Set up the database**
   - Go to your Supabase project dashboard
   - Run the SQL from `supabase-schema.sql` in the SQL editor

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── pages/         # Page components
│   └── ui/            # Reusable UI components
├── lib/               # Utilities and configurations
│   ├── services/      # API service layer
│   └── supabase.ts    # Supabase client
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── test/              # Test utilities
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📝 Environment Variables

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run test` - Run tests

## 📊 Database Schema

The application uses three main tables:
- `users` - User profiles and authentication
- `itr_requests` - ITR filing requests
- `service_inquiries` - Service inquiry forms

See `supabase-schema.sql` for complete schema.

## 🔒 Security Features

- Row Level Security (RLS) enabled
- Authentication middleware
- Input validation with Zod
- CSRF protection
- Security headers
- Rate limiting ready

## 🎯 Performance Optimizations

- Server-side rendering
- Image optimization
- Code splitting
- Bundle analysis
- Caching strategies
- Edge functions support

## 📱 Mobile Support

- Responsive design
- Touch-friendly interface
- Progressive Web App ready
- Offline support (planned)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:
- Email: support@hisabhub.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]
