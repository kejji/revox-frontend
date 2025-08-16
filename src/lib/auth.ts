import { signOut } from "aws-amplify/auth";
import type { NavigateFunction } from "react-router-dom";

export async function doSignOut(navigate: NavigateFunction) {
  try {
    await signOut();
  } catch (err) {
    console.error("Sign out failed:", err);
  } finally {
    navigate("/revox/auth");
  }
}
