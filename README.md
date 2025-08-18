
# Kira Blog
![enter image description here](https://minio-os4k88g8ggk8cw8csg8gk8c0.51.210.241.109.sslip.io/images/image-1755554133251.webp)

A modern, customizable, and feature-rich open-source blog platform built with Next.js, PostgreSQL, and MinIO. Perfect for developers who want a powerful blog with advanced features like file management, newsletter integration, and a comprehensive admin panel.

## ✨ Features

###  Frontend Features

-   **Fully Customizable Homepage** - Easy to modify layout, colors, and content
-   **Blog Listing** - Clean, responsive blog post grid
-   **Tag-based Search** - Filter posts by categories and tags
-   **Newsletter Subscription** - Built-in email collection 

### ⚙️ Admin Features

-   **Blog Management** - Create, edit, and delete blog posts
-   **File Manager** - Upload and manage images and files
-   **Newsletter Management** - View and manage subscribers

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+ and npm/yarn
-   PostgreSQL database
-   MinIO or compatible S3 storage (for file uploads)

### Installation

1.  **Clone the repository**
    
    ```bash
    git clone https://github.com/kiraaziz/KiraBlog.git
    cd kira-blog
    
    ```
    
2.  **Install dependencies**
    
    ```bash
    npm install 
    
    ```
    
3.  **Environment Configuration** Create a `.env.local` file in the root directory:
    
    ```env
    # Database Configuration
    DATABASE_URL=postgres://username:password@localhost:5432/database_name
    
    # MinIO Object Storage Configuration
    MINIO_URL=https://your-minio-endpoint.example.com
    MINIO_ACCESS_KEY=your_minio_access_key_here
    MINIO_SECRET_KEY=your_minio_secret_key_here
    
    # Application Configuration
    NEXT_PUBLIC_BASE_URL="http://localhost:3000"
    ADMIN_SECRET=your_admin_secret_here
    
    ```
    
4.  **Database Setup**
    
    ```bash
    # Generate Prisma client
    npx prisma generate
    
    # Run database migrations
    npx prisma db push
    
    # Or if you have migration files
    npx prisma migrate dev
    
    ```
    
5.  **Seed Initial Settings** Visit `http://localhost:3000/seed` to initialize default blog settings, or run:
    
    ```bash
    curl http://localhost:3000/api/seed
    
    ```
    
6.  **Start Development Server**
    
    ```bash
    npm run dev 
    
    ```
    
7.  **Access the application**
    
    -   Frontend: `http://localhost:3000`
    -   Admin Panel: `http://localhost:3000/admin`

 

  

### Contributing

1.  Fork the repository
2.  Create a feature branch: `git checkout -b feature-name`
3.  Make your changes
4.  Commit changes: `git commit -am 'Add new feature'`
5.  Push to branch: `git push origin feature-name`
6.  Submit a pull request 
## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 🙏 Acknowledgments

-   Inspired by modern blog platforms
-   Built with love for the open-source community
-   Thanks to all contributors and users

----------

**Kira Blog** - Simple, Beautiful, Open Source

Made with ❤️ for the developer community