# ChaiCode AI Assistant - Frontend

A modern, production-ready AI chat application built with Next.js, shadcn/ui, and Aceternity UI components.

## 🚀 Features

### ✨ Modern UI/UX
- **Glassmorphism Design**: Beautiful glass effects with backdrop blur
- **Dark Theme**: Consistent dark theme with custom color palette
- **Responsive Layout**: Mobile-first responsive design
- **Smooth Animations**: Framer Motion and CSS animations
- **Aceternity UI Effects**: Beautiful background beams and floating elements

### 🔐 Enhanced Authentication
- **Remember Me**: Persistent login with localStorage/sessionStorage
- **Auto-login**: Seamless registration with optional auto-login
- **Session Management**: Smart token handling and expiration
- **Form Validation**: Real-time validation with error messages
- **Password Visibility**: Toggle password visibility with eye icon

### 💬 AI Chat Interface
- **Real-time Chat**: Instant messaging with typing animations
- **Course Selection**: Switch between different programming courses
- **Example Queries**: Pre-defined examples for quick start
- **Loading States**: Beautiful loading indicators and skeleton screens
- **Error Handling**: Graceful error handling with user-friendly messages

### 🏗️ Architecture
- **Modular Components**: Reusable, well-documented components
- **Custom Hooks**: Centralized state management with React Context
- **Type Safety**: JSDoc comments for better development experience
- **Performance**: Optimized rendering and lazy loading

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.6
- **UI Library**: shadcn/ui + Aceternity UI
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Authentication**: Custom JWT implementation

## 📁 Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── Dashboard/               # Dashboard page
│   ├── Login/                   # Login page
│   ├── Register/               # Registration page
│   ├── globals.css             # Global styles and theme
│   └── layout.js               # Root layout
├── components/                  # Reusable components
│   ├── aceternity/             # Aceternity UI components
│   │   ├── background-beams.jsx
│   │   └── floating-navbar.jsx
│   ├── auth/                   # Authentication components
│   │   └── AuthForm.jsx
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── ChatInput.jsx
│   │   ├── ChatMessage.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── WelcomeScreen.jsx
│   ├── layout/                 # Layout components
│   │   └── AppShell.jsx
│   └── ui/                     # Base UI components (shadcn/ui)
│       ├── button.jsx
│       ├── card.jsx
│       ├── checkbox.jsx
│       ├── input.jsx
│       └── label.jsx
├── contexts/                   # React contexts
│   └── AuthContext.js         # Authentication context
└── lib/                       # Utilities
    └── utils.js               # Utility functions
```

## 🎨 Design System

### Color Palette
- **Brand Orange**: `#FF6500` - Primary accent color
- **Primary Blue**: `#1E3E62` - Navigation and surfaces
- **Surface Dark**: `#0B192C` - Background color
- **Deep Black**: `#000000` - Deep surfaces and text

### Components
All components follow consistent patterns:
- **Props Documentation**: JSDoc comments for all props
- **Accessibility**: ARIA labels and keyboard navigation
- **Responsive**: Mobile-first responsive design
- **Theme Support**: Consistent with design tokens

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS v4 with custom theme configuration in `globals.css`:

```css
:root {
  --background: #0B192C;
  --foreground: #FFFFFF;
  --primary: #1E3E62;
  --secondary: #FF6500;
  /* ... more theme variables */
}
```

### Authentication
Authentication is managed through React Context with the following features:
- JWT token storage (localStorage/sessionStorage)
- Automatic token refresh
- Remember Me functionality
- Protected routes

## 📱 Features in Detail

### Remember Me Functionality
- **Checkbox**: Users can opt for persistent login
- **Storage**: Uses localStorage for persistent, sessionStorage for temporary
- **Auto-cleanup**: Clears opposite storage type when switching modes
- **Security**: Tokens expire based on server configuration

### Chat Interface
- **Real-time**: Instant message sending and receiving
- **Typing Animation**: Character-by-character typing for bot responses
- **Course Context**: Maintains conversation context per course
- **Error Recovery**: Graceful handling of network errors

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Responsive across all screen sizes
- **Touch Friendly**: Large tap targets and smooth scrolling
- **Accessibility**: Screen reader support and keyboard navigation

## 🧪 Development

### Component Development
When creating new components:

1. **Add JSDoc comments** for all props and functions
2. **Use forwardRef** for components that need ref access
3. **Include className prop** for styling flexibility
4. **Add proper TypeScript-style prop validation**

### Styling Guidelines
- Use Tailwind utility classes
- Leverage design tokens from globals.css
- Maintain consistent spacing and typography
- Test across different screen sizes

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Set the following in production:
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXTAUTH_SECRET`: Authentication secret (if using NextAuth)

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **shadcn/ui**: For the beautiful component library
- **Aceternity UI**: For stunning animated components
- **Tailwind CSS**: For utility-first CSS framework
- **Next.js**: For the powerful React framework
# Chaicode-chatbox-frontend
