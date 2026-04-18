import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Find the Sujal user
    const sujalUser = await prisma.user.findUnique({
      where: { email: "sujalpatne05@gmail.com" }
    });

    if (!sujalUser) {
      console.log("Sujal user not found");
      return;
    }

    console.log("Found Sujal user:", sujalUser);

    // Hash the password "Sujal@123"
    const hashedPassword = await bcrypt.hash("Sujal@123", 10);

    // Update the user with hashed password and username
    const updatedUser = await prisma.user.update({
      where: { email: "sujalpatne05@gmail.com" },
      data: {
        password: hashedPassword,
        username: "sujal"
      }
    });

    console.log("Updated Sujal user:", updatedUser);
    console.log("Password hashed successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
