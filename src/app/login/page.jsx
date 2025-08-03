import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
