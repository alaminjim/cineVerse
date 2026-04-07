import axios from "axios";

async function test() {
  try {
    const response = await axios.get("https://text.pollinations.ai/hello%20world");
    console.log("Success:", response.data);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
