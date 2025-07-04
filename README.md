# MyStay - Vacation Rental Platform

MyStay is a full-stack vacation rental platform built with Node.js, Express, and MongoDB. The application allows users to discover, book, and review vacation rentals across various categories including trending destinations, mountain retreats, castles, and more. The platform features user authentication, real-time listings, interactive maps, and a comprehensive review system.

## Features

### Authentication & User Management
- User registration and login with email/password authentication
- Session management with secure cookies
- User profile management
- Protected routes for authenticated users

### Listings Management
- Browse vacation rentals by category (Trending, Rooms, Iconic Cities, Mountain, Castles, Amazing Pools, Campings, Farms, Arctic Places, Domes)
- Create, edit, and delete listings (for authenticated users)
- Image upload and management with Cloudinary integration
- Location-based search with Mapbox integration
- Price filtering and sorting options

### Interactive Maps
- Real-time location display using Mapbox
- Interactive map markers for each listing
- Geolocation services for enhanced user experience

### Review System
- Rate listings from 1-5 stars
- Add detailed comments and reviews
- View aggregated ratings and reviews
- User-specific review management

### Responsive Design
- Mobile-first responsive design
- Cross-platform compatibility (desktop, tablet, mobile)
- Modern UI with smooth animations and transitions
- Intuitive navigation and user experience

### Data Management
- MongoDB database with Mongoose ODM
- Cloudinary for image storage and optimization
- Real-time data synchronization
- Efficient data validation and error handling

## Technologies Used

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Passport.js**: Authentication middleware
- **Express Session**: Session management
- **Multer**: File upload handling
- **Cloudinary**: Cloud image storage and management

### Frontend
- **EJS**: Server-side templating engine
- **Bootstrap**: CSS framework for responsive design
- **Mapbox**: Interactive maps and geolocation
- **Font Awesome**: Icon library

### Development Tools
- **Method Override**: HTTP method override
- **Connect Flash**: Flash message middleware
- **Joi**: Data validation library
- **Dotenv**: Environment variable management

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mystay.git
cd mystay
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory with the following variables:
```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAPBOX_TOKEN=your_mapbox_access_token
```

### 4. Database Setup
- Create a MongoDB Atlas account or use local MongoDB
- Set up your database connection string in the `.env` file
- The application will automatically create necessary collections

### 5. Cloudinary Setup (for image uploads)
- Create a Cloudinary account
- Get your cloud name, API key, and API secret
- Add them to your `.env` file

### 6. Mapbox Setup (for maps)
- Create a Mapbox account
- Generate an access token
- Add it to your `.env` file

### 7. Run the Application
```bash
node app.js
```
The application will be available at `http://localhost:8080`

## Folder Structure

```
MyStay/
├── app.js                 # Main application entry point
├── cloudConfig.js         # Cloudinary configuration
├── controllers/           # Route controllers
│   ├── listing.js        # Listing CRUD operations
│   ├── reviews.js        # Review management
│   └── users.js          # User authentication
├── init/                 # Database initialization
│   ├── data.js          # Sample data
│   └── index.js         # Database setup
├── middleware.js         # Custom middleware
├── models/              # Database models
│   ├── listing.js       # Listing schema
│   ├── review.js        # Review schema
│   └── user.js          # User schema
├── public/              # Static assets
│   ├── css/            # Stylesheets
│   │   ├── rating.css  # Rating component styles
│   │   └── style.css   # Main stylesheet
│   └── js/             # Client-side JavaScript
│       ├── map.js      # Map functionality
│       └── script.js   # General scripts
├── routes/              # Express routes
│   ├── listing.js      # Listing routes
│   ├── review.js       # Review routes
│   └── user.js         # User routes
├── utils/              # Utility functions
│   ├── ExpressError.js # Error handling
│   └── wrapAsync.js    # Async wrapper
├── views/              # EJS templates
│   ├── error.ejs       # Error page
│   ├── includes/       # Reusable components
│   │   ├── flash.ejs   # Flash messages
│   │   ├── footer.ejs  # Footer component
│   │   └── navbar.ejs  # Navigation bar
│   ├── layouts/        # Layout templates
│   │   └── boilerplate.ejs
│   ├── listings/       # Listing pages
│   │   ├── edit.ejs    # Edit listing
│   │   ├── index.ejs   # Listings index
│   │   ├── new.ejs     # Create listing
│   │   └── show.ejs    # Show listing
│   └── users/          # User pages
│       ├── login.ejs   # Login page
│       └── signup.ejs  # Registration page
└── schema.js           # Joi validation schemas
```

## Key Features Explained

### Authentication System
- Uses Passport.js with local strategy
- Secure session management with MongoDB store
- Flash messages for user feedback
- Protected routes for authenticated users

### Listing Management
- CRUD operations for vacation rentals
- Category-based filtering (10 different categories)
- Image upload with Cloudinary integration
- Location-based search with Mapbox integration
- Price validation and filtering

### Review System
- Star-based rating system (1-5 stars)
- Comment functionality
- User-specific review management
- Automatic review cleanup when listings are deleted

### Responsive Design
- Mobile-first approach
- Bootstrap-based responsive grid
- Custom CSS for enhanced styling
- Cross-browser compatibility

## API Endpoints

### Authentication
- `GET /login` - Login page
- `POST /login` - User login
- `GET /signup` - Registration page
- `POST /signup` - User registration
- `GET /logout` - User logout

### Listings
- `GET /listings` - View all listings
- `GET /listings/new` - Create new listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View specific listing
- `GET /listings/:id/edit` - Edit listing form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Reviews
- `POST /listings/:id/reviews` - Add review
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

## Future Enhancements

### Planned Features
- **Advanced Search**: Filter by price range, amenities, and dates
- **Booking System**: Real-time availability and reservation management
- **Payment Integration**: Secure payment processing
- **Push Notifications**: Real-time updates and alerts
- **Mobile App**: Native iOS and Android applications
- **Analytics Dashboard**: Host and guest analytics
- **Multi-language Support**: Internationalization
- **Advanced Maps**: Route planning and nearby attractions

### Technical Improvements
- **API Documentation**: Swagger/OpenAPI integration
- **Testing**: Unit and integration tests
- **Performance**: Caching and optimization
- **Security**: Rate limiting and advanced security measures
- **Monitoring**: Application monitoring and logging

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for improvements or feature requests.

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


---

**MyStay** - Your perfect vacation rental platform! 🏠✈️
