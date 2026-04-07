import axios from "axios";

async function test() {
  try {
    const response = await axios.post("https://text.pollinations.ai/", {
      messages: [
        { role: "system", "content": "You are CineBuddy" },
        { role: "user", "content": "Hello! What is your name?" }
      ],
      model: "mistral"
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("Success:", response.data);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
