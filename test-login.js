// Test login endpoint
const credentials = {
  username: "superadmin",
  password: "superadmin123"
};

console.log("🧪 Testing login endpoint...");
console.log("📝 Credentials:", { username: credentials.username, password: "***" });

fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(credentials)
})
  .then(res => res.json())
  .then(data => {
    console.log("\n✅ Response received:");
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log("\n✅ Login successful!");
      console.log("Token:", data.token.substring(0, 50) + "...");
      console.log("User:", data.user);
    } else {
      console.log("\n❌ Login failed!");
      console.log("Error:", data.error);
    }
  })
  .catch(err => {
    console.error("\n❌ Error:", err.message);
  });
