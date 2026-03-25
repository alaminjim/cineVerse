import app from "./app.js";
import { Admin } from "./app/seed/seedingAdmin.js";

const port = 5000;

const server = async () => {
  try {
    await Admin();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

server();
