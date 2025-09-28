# Islamic Hub - Complete Islamic Web Application

A comprehensive Islamic web application built with Next.js 14, TypeScript, TailwindCSS, and MongoDB. Features Quran, Hadith, Islamic videos, news, and products all in one place.

## 🚀 Features

### Core Features
- **Quran Page**: Full Quran with Arabic text, English/Bangla translations, and audio recitation
- **Hadith Page**: Collections from Bukhari, Muslim, Tirmidhi, and other authentic sources
- **Islamic Videos**: Upload and watch Islamic lectures, nasheed, and dawah content
- **News Section**: Islamic news and articles with admin management
- **Products Store**: Islamic books, clothing, prayer mats, tasbih, and more
- **Admin Dashboard**: Complete content management system

### Technical Features
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Dark/Light Mode**: Theme switching with system preference detection
- **Search Functionality**: Global search across all content types
- **SEO Optimized**: Meta tags and structured data for better search visibility
- **Type Safety**: Full TypeScript implementation
- **Database**: MongoDB with Mongoose ODM

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes, JWT Authentication
- **Database**: MongoDB with Mongoose
- **UI Components**: Lucide React Icons, React Hot Toast
- **Video Player**: React Player
- **Theme**: Next Themes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd islamic-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/islamic-hub
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in your `.env.local` file

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [https://islamichub-sigma.vercel.app](https://islamichub-sigma.vercel.app)

## 👤 Default Accounts

After seeding the database, you can use these accounts:

**Admin Account:**
- Email: `admin@islamichub.com`
- Password: `admin123`

**Regular User:**
- Email: `user@example.com`
- Password: `user123`

## 📁 Project Structure

```
islamic-hub/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── videos/        # Video management
│   │   ├── quran/         # Quran data
│   │   ├── hadith/        # Hadith collections
│   │   ├── news/          # News management
│   │   └── products/      # Product management
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Admin dashboard
│   ├── quran/             # Quran page
│   ├── hadith/            # Hadith page
│   ├── news/              # News page
│   ├── products/          # Products page
│   └── page.tsx           # Home page (Videos)
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── models/                # Mongoose database models
├── scripts/               # Database seeding scripts
└── public/                # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Videos
- `GET /api/videos` - Get all videos (with pagination and filters)
- `POST /api/videos` - Create new video (admin only)
- `GET /api/videos/[id]` - Get video by ID
- `PUT /api/videos/[id]` - Update video
- `DELETE /api/videos/[id]` - Delete video
- `POST /api/videos/[id]/like` - Like a video
- `POST /api/videos/[id]/comment` - Add comment to video

### Quran
- `GET /api/quran` - Get all surahs or search
- `GET /api/quran?surah=[number]` - Get specific surah

### Hadith
- `GET /api/hadith` - Get hadiths with pagination and filters

### News
- `GET /api/news` - Get published news
- `POST /api/news` - Create news (admin only)

### Products
- `GET /api/products` - Get products with pagination and filters
- `POST /api/products` - Create product (admin only)

## 🎨 Customization

### Themes
The application supports light and dark themes. You can customize the theme colors in `tailwind.config.js`.

### Styling
All styles are built with TailwindCSS. You can customize the design by modifying the utility classes or adding custom CSS in `app/globals.css`.

### Database Models
All database models are defined in the `models/` directory. You can extend these models to add new fields or functionality.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean
- AWS

Make sure to set up your MongoDB database and environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Islamic scholars and teachers who inspire this project
- The open-source community for amazing tools and libraries
- All contributors who help improve this application

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**May Allah bless this project and make it beneficial for the Muslim community. Ameen.**
