import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AuthGate } from '@/features/auth/AuthGate'
import { HomeScreen } from '@/features/home/HomeScreen'
import { QuestLogScreen } from '@/features/quests/QuestLogScreen'
import { TrendRadarScreen } from '@/features/trends/TrendRadarScreen'
import { VaultScreen } from '@/features/vault/VaultScreen'
import { CalendarScreen } from '@/features/calendar/CalendarScreen'
import { ProfileScreen } from '@/features/profile/ProfileScreen'

export default function App() {
  return (
    <AuthGate>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomeScreen />} />
          <Route path="/quests" element={<QuestLogScreen />} />
          <Route path="/radar" element={<TrendRadarScreen />} />
          <Route path="/vault" element={<VaultScreen />} />
          <Route path="/calendar" element={<CalendarScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthGate>
  )
}
