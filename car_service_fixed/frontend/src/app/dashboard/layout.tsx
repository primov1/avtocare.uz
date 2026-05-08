import type { Metadata } from 'next';
import DashboardLayout from "../../components/layout/DashboardLayout";
import { DashboardProvider } from "../../contexts/DashboardContext";

export const metadata: Metadata = {
  title: { default: 'Dashboard', template: '%s | AutoCare' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </DashboardProvider>
  );
}
