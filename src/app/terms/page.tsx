import { Metadata } from 'next';
import TermsOfService from '@/components/pages/TermsOfService';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read our terms of service and user agreement for HisabHub services.',
};

export default function TermsPage() {
  return <TermsOfService />;
}