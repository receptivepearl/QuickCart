import { clerkClient } from "@clerk/nextjs/server";

const authAdmin = async (userId) => {
  try {
    if (!userId) return false;
    const user = await clerkClient.users.getUser(userId);
    return user?.publicMetadata?.role === "admin";
  } catch (error) {
    return false;
  }
};

export default authAdmin;
