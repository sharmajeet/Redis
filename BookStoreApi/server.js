require("dotenv").config();
const express = require("express");
const connectDB = require("./database/db.js");

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { SwaggerTheme, SwaggerThemeNameEnum } = require('swagger-themes');


const bookRoutes = require("./routes/book-routes.js");
const authRoutes = require("./routes/auth-routes.js");
const homeRoutes = require("./routes/home-routes.js");
const cloudinaryRoutes = require("./routes/cloudinary-routes.js");
const imageRoutes = require("./routes/image-routes.js");

const app = express();
const theme = new SwaggerTheme();


// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'], // Make sure your route files have Swagger annotations
};

const options = {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK_MONOKAI),
    explorer: true,
  };

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,options));


// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', homeRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
