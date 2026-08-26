import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import MobileTopBar from './MobileTopBar';
import BottomTabBar from './BottomTabBar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-sol-negro text-sol-blanco">
      <AnnouncementBar />
      <Navbar />
      <MobileTopBar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <WhatsAppButton />
      <BottomTabBar />
    </div>
  );
}
