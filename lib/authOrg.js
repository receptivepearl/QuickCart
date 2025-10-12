import { clerkClient } from "@clerk/nextjs/server";

const authOrg = async (userId) => {
  try {
    if (!userId) return false;
    const user = await clerkClient.users.getUser(userId);
    const role = user?.publicMetadata?.role;
    return role === "org" || role === "organization";
  } catch (error) {
    return false;
  }
};

export default authOrg;
