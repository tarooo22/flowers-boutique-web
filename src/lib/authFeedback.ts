export function authFeedback(code: string, isLogin: boolean) {
  if (code === "email_in_use") {
    return "This email already has an account. Please sign in instead.";
  }
  if (code === "invalid_registration") {
    return "Enter your full name, a valid email address, and a password of at least 8 characters.";
  }
  if (code === "invalid_credentials") {
    return "The email or password is incorrect. Please try again.";
  }
  return isLogin
    ? "Sign in could not be completed. Please try again."
    : "Account creation could not be completed. Please try again.";
}
