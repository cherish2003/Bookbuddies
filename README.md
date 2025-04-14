# BookBuddies 📚

A full-stack peer-to-peer book exchange platform connecting book owners with seekers, built with modern web technologies.

## ✨ Key Features

### Core Functionality
✅ **User Management System**
- Dual-role authentication (Owners/Seekers)
- Secure profile creation with:
  - Name, Email, Mobile verification
  - Password-protected accounts
  - Role-based access control
- MongoDB-backed user database

✅ **Book Exchange Platform**
- Owner privileges:
  - Create detailed listings (Title, Author, Genre, Location)
  - Manage availability status
  - Track request history
- Universal access:
  - Browse all available books
  - Advanced search (title, location, owner, contact)
  - Real-time status updates (Available/Requested/Unavailable/Exchanged)

### 🚀 Enhanced Features
- **Interactive UI/UX**
  - Animated landing page with micro-interactions
  - Responsive design across all devices
  - Intuitive navigation flows

- **Advanced Book Management**
  - Full CRUD operations for listings
  - Multi-parameter filtering (Genre × Location)
  - Visual status indicators

- **Comprehensive Dashboards**
  - **Seeker View**:
    - Borrowed books history
    - Current rentals tracking
    - Personalized recommendations
  - **Owner View**:
    - Request management console
    - Inventory analytics (Total Books/Requests)
    - Activity feeds (Recent Requests/Additions)

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **UI Library**: Shadcn/ui (Radix-based)
- **Animations**: Framer Motion
- **State Management**: React Redux

### Backend Services
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Cloud)
- **API Design**: RESTful endpoints
- **Authentication**: Session-based

## 🚀 Deployment

- **Frontend**: Hosted on Vercel
- **Backend**: Deployed on Render
- **Database**: MongoDB Atlas Cloud

[Live Demo](https://bookbuddies-kohl.vercel.app/)
