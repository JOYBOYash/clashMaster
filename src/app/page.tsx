import { MainHeader } from '@/components/main-header';
import { ClashTrackDashboard } from '@/components/clash-track-dashboard';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <MainHeader />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <ClashTrackDashboard />
      </main>
    </div>
  );
}
