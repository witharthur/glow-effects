import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.name.trim()) {
      setError("Пожалуйста, введите имя");
      setIsLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setError("Пожалуйста, введите email");
      setIsLoading(false);
      return;
    }
    if (!formData.password.trim()) {
      setError("Пожалуйста, введите пароль");
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to feed page
      navigate("/feed");
    }, 1500);
  };

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.password.trim() &&
    formData.confirmPassword.trim() &&
    formData.password === formData.confirmPassword;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Регистрация</h1>
          <p className="text-muted-foreground">Создайте аккаунт для начала</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
              Ваше имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите ваше имя"
              className="w-full px-4 py-3 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введите ваш email"
              className="w-full px-4 py-3 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              className="w-full px-4 py-3 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground mb-2">
              Подтвердите пароль
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Подтвердите пароль"
              className="w-full px-4 py-3 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '14px',
              padding: '16px 32px',
              background: isLoading || isFormValid ? 'rgba(97, 21, 205, 1)' : 'rgba(200, 150, 230, 1)',
              color: 'white',
              border: 'none',
              fontSize: '15px',
              fontWeight: '600',
              cursor: isFormValid || isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 200ms',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: isFormValid || isLoading ? 1 : 0.7,
              boxSizing: 'border-box',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
              </>
            ) : (
              "Registration"
            )}
          </button>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground text-sm">
              Уже есть аккаунт?{" "}
              <button
                type="button"
                onClick={() => navigate("/feed")}
                className="text-primary font-semibold hover:underline transition-colors"
              >
                Войти
              </button>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Registration;
