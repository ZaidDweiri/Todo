import { auth } from "@clerk/nextjs/server";

export async function getCurrentUserId(): Promise<string | null> {
  const { userId } =await auth();
  return userId;
}


/**
 * دالة مساعدة للتحقق مما إذا كان المستخدم مصادقًا
 * تُرجع true إذا كان المستخدم مصادقًا، وfalse خلاف ذلك
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await auth();
  return !!userId;
}
