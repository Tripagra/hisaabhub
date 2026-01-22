import { Metadata } from 'next';
import PrivacyPolicy from '@/components/pages/PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how HisabHub protects your personal information and data privacy.',
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}