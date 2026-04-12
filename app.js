const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Route files
const coworkingspaces = require("./routes/coworkingspaces");
const reservations = require("./routes/reservations");
const auth = require("./routes/auth");
const rooms = require("./routes/rooms");
const timeslots = require("./routes/timeslots");

const app = express();

// =====================================================
// Swagger config
// =====================================================
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Coworking Booking API",
      version: "2.0.0",
      description: "Room + TimeSlot Reservation System",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api/v1`,
      },
    ],
  },
  apis: ["./docs/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// =====================================================
// Middleware
// =====================================================
app.set("query parser", "extended");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// =====================================================
// Routes
// =====================================================
app.use("/api/v1/auth", auth);
app.use("/api/v1/coworkingspaces", coworkingspaces);
app.use("/api/v1/rooms", rooms);
app.use("/api/v1/timeslots", timeslots);
app.use("/api/v1/reservations", reservations);

module.exports = app;