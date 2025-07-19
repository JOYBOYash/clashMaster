
'use client';

<<<<<<< HEAD
import { useAuth } from '@/context/auth-context';
=======
>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4
import { LandingPage } from '@/components/landing-page';

export default function RootPage() {
<<<<<<< HEAD
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Always show the landing page, regardless of login state.
=======
  // The landing page is now accessible to both logged-in and guest users.
  // The header will provide navigation for logged-in users.
>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4
  return <LandingPage />;
}
