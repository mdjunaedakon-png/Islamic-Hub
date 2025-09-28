# Islamic Hub Setup Script
Write-Host "🕌 Islamic Hub Setup Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if Node.js is installed
Write-Host "`n📦 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
Write-Host "`n📦 Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📦 Installing project dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is installed
Write-Host "`n🗄️ Checking MongoDB installation..." -ForegroundColor Yellow
try {
    $mongoVersion = mongod --version
    Write-Host "✅ MongoDB is installed" -ForegroundColor Green
} catch {
    Write-Host "⚠️ MongoDB is not installed locally" -ForegroundColor Yellow
    Write-Host "`n📋 MongoDB Setup Options:" -ForegroundColor Cyan
    Write-Host "1. Install MongoDB locally:" -ForegroundColor White
    Write-Host "   - Download from: https://www.mongodb.com/try/download/community" -ForegroundColor Gray
    Write-Host "   - Or use Chocolatey: choco install mongodb" -ForegroundColor Gray
    Write-Host "`n2. Use MongoDB Atlas (Cloud - Recommended):" -ForegroundColor White
    Write-Host "   - Go to: https://www.mongodb.com/atlas" -ForegroundColor Gray
    Write-Host "   - Create a free account and cluster" -ForegroundColor Gray
    Write-Host "   - Get your connection string" -ForegroundColor Gray
    Write-Host "   - Update MONGODB_URI in .env.local" -ForegroundColor Gray
    Write-Host "`n3. Use Docker (if you have Docker installed):" -ForegroundColor White
    Write-Host "   - Run: docker run -d -p 27017:27017 --name mongodb mongo:latest" -ForegroundColor Gray
}

# Create .env.local if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-Host "`n📝 Creating .env.local file..." -ForegroundColor Yellow
    @"
MONGODB_URI=mongodb://localhost:27017/islamic-hub
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-secure-for-production-use
NODE_ENV=development
"@ | Out-File -FilePath .env.local -Encoding utf8
    Write-Host "✅ .env.local file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env.local file already exists" -ForegroundColor Green
}

Write-Host "`n🚀 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "2. Run: npm run seed (to populate the database)" -ForegroundColor White
Write-Host "3. Run: npm run dev (to start the development server)" -ForegroundColor White
Write-Host "4. Open: https://islamichub-sigma.vercel.app" -ForegroundColor White

Write-Host "`n📚 Default accounts after seeding:" -ForegroundColor Cyan
Write-Host "Admin: admin@islamichub.com / admin123" -ForegroundColor White
Write-Host "User: user@example.com / user123" -ForegroundColor White

Write-Host "`n🆘 Need help? Check the README.md file" -ForegroundColor Yellow
