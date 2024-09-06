"use client";

import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default function ClientLogoutButton() {
  const pathname = usePathname();
  const hideOnPaths = ['/', '/login', '/signup'];

  if (hideOnPaths.includes(pathname)) {
    return null;
  }

  return <LogoutButton />;
}