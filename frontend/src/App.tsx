import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/state/auth";
import { useTheme } from "@/state/theme";

const HomePage = lazy(() =>
  import("@/pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const LoginPage = lazy(() =>
  import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("@/pages/RegisterPage").then((m) => ({ default: m.RegisterPage })),
);
const LessonsPage = lazy(() =>
  import("@/pages/LessonsPage").then((m) => ({ default: m.LessonsPage })),
);
const LessonDetailPage = lazy(() =>
  import("@/pages/LessonDetailPage").then((m) => ({
    default: m.LessonDetailPage,
  })),
);
// Practice is the heaviest route — it pulls in TensorFlow.js and MediaPipe.
// Keeping it lazy stops every other page from paying for that download.
const PracticePage = lazy(() =>
  import("@/pages/PracticePage").then((m) => ({ default: m.PracticePage })),
);

function RouteFallback(): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-2 py-16 text-[var(--color-fg-muted)]"
    >
      <Loader2 className="animate-spin" aria-hidden="true" />
      Memuat halaman…
    </div>
  );
}

export default function App(): JSX.Element {
  const bootstrap = useAuth((s) => s.bootstrap);
  const initTheme = useTheme((s) => s.init);

  useEffect(() => {
    initTheme();
    void bootstrap();
  }, [bootstrap, initTheme]);

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="lessons" element={<LessonsPage />} />
          <Route
            path="lessons/:slug"
            element={
              <ProtectedRoute>
                <LessonDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="practice/:slug"
            element={
              <ProtectedRoute>
                <PracticePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function NotFound(): JSX.Element {
  return (
    <div className="text-center space-y-3">
      <h1 className="text-3xl font-bold">Halaman tidak ditemukan</h1>
      <p className="text-[var(--color-fg-muted)]">
        URL yang Anda buka tidak terdaftar. Coba kembali ke beranda.
      </p>
    </div>
  );
}
