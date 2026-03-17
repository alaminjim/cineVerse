import express from "express";
const app = express();
// app.use(
//   cors({
//     origin: [
//       envConfig.FRONTEND_URL,
//       envConfig.BETTER_AUTH_URL,
//       "http://localhost:3000",
//       "http://localhost:5000",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );
app.use(express.json());
// app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("hello health care");
});
export default app;
