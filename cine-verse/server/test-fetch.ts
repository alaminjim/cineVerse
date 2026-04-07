async function test() {
  try {
    const response = await fetch("https://text.pollinations.ai/hello%20world");
    const text = await response.text();
    console.log("Success fetch:", text.slice(0, 50));
    
    // Test POST
    const postRes = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Who are you?" }]
      })
    });
    const postText = await postRes.text();
    console.log("Success POST:", postText.slice(0, 50));
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
