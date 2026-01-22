import { Metadata } from 'next';
import AboutUs from '@/components/pages/AboutUs';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about HisabHub - your trusted partner for professional tax services, ITR filing, and financial consulting.',
};

export default function AboutPage() {
  return <AboutUs />;
}