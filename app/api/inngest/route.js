import { serve } from "inngest/next";
import { syncUserCreation, syncUserUpdation, syncUserDeletion } from "@/config/inngest";
import { createUserOrder } from "@/config/inngest";  
import { inngest } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    createUserOrder,
  ],
});