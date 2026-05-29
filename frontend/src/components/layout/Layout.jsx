import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import client from '../../api/client';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    client.post(`/page-visit?path=${encodeURIComponent(pathname)}`).catch(() => {});
  }, [pathname]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
