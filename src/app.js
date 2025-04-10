import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(    
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
        allowedHeaders: 'Content-Type, Authorization'
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

app.use(express.static("public"));
app.use(cookieParser());


import ReservationRoutes from "./routes/reservation.route.js";
import RestaurantRoutes from "./routes/restaurant.routes.js";
import UserRoutes from "./routes/user.routes.js"


app.get('/', (req, res) => {
    res.send('Success !!')
})


app.use("/api/v1/reservations", ReservationRoutes);
app.use("/api/v1/restaurant", RestaurantRoutes);
app.use("/api/v1/user", UserRoutes);


export default app;
