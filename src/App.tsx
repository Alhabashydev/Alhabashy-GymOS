import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { AppPage } from './types/gym';
import { GymProvider } from './hooks/useGymStore';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Workouts } from './pages/Workouts';
import { WorkoutDayDetail } from './pages/WorkoutDayDetail';
import { StartWorkout } from './pages/StartWorkout';
import { History } from './pages/History';
import { BodyWeight } from './pages/BodyWeight';
import { Settings } from './pages/Settings';
import { pageToPath } from './utils/routes';

function useGymNavigate() {
  const navigate = useNavigate();
  return (page: AppPage, id?: string) => {
    navigate(pageToPath(page, id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

function DashboardRoute() {
  const go = useGymNavigate();
  return <Dashboard onNavigate={go} />;
}

function WorkoutsRoute() {
  const go = useGymNavigate();
  return <Workouts onNavigate={go} />;
}

function WorkoutDayDetailRoute() {
  const go = useGymNavigate();
  const { dayId } = useParams<{ dayId: string }>();
  return <WorkoutDayDetail dayId={dayId} onNavigate={go} />;
}

function StartWorkoutRoute() {
  const go = useGymNavigate();
  return <StartWorkout onNavigate={go} />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<DashboardRoute />} />
            <Route path="/plan" element={<WorkoutsRoute />} />
            <Route path="/plan/day/:dayId" element={<WorkoutDayDetailRoute />} />
            <Route path="/train" element={<StartWorkoutRoute />} />
            <Route path="/history" element={<History />} />
            <Route path="/weight" element={<BodyWeight />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}

export default function App() {
  return (
    <GymProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </GymProvider>
  );
}
