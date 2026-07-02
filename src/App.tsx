import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LoadingBrew } from '@/components/ui/LoadingBrew'
import { AuthGate } from '@/features/auth/AuthGate'
import { HomeScreen } from '@/features/home/HomeScreen'
import { QuestLogScreen } from '@/features/quests/QuestLogScreen'
import { TrendRadarScreen } from '@/features/trends/TrendRadarScreen'
import { VaultScreen } from '@/features/vault/VaultScreen'
import { ProfileScreen } from '@/features/profile/ProfileScreen'

// Leaflet is heavy — load the map on demand
const MapScreen = lazy(() =>
  import('@/features/map/MapScreen').then((m) => ({ default: m.MapScreen })),
)

export default function App() {
  return (
    <AuthGate>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomeScreen />} />
          <Route path="/quests" element={<QuestLogScreen />} />
          <Route path="/radar" element={<TrendRadarScreen />} />
          <Route path="/vault" element={<VaultScreen />} />
          <Route
            path="/map"
            element={
              <Suspense fallback={<LoadingBrew />}>
                <MapScreen />
              </Suspense>
            }
          />
          {/* calendar merged into Quest Log → Schedule */}
          <Route path="/calendar" element={<Navigate to="/quests" replace />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthGate>
  )
}
