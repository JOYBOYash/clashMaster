import { MainHeader } from '@/components/main-header';
import { ClashTrackDashboard } from '@/components/clash-track-dashboard';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <MainHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClashTrackDashboard />
      </main>
    </div>
  );
}
