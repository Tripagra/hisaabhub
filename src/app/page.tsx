import { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';

export const metadata: Metadata = {
  title: 'Professional Tax Services & ITR Filing',
  description: 'Get expert tax filing services, GST registration, and financial consulting. File your ITR with guaranteed accuracy and maximum refunds.',
  openGraph: {
    title: 'Professional Tax Services & ITR Filing | HisabHub',
    description: 'Get expert tax filing services, GST registration, and financial consulting.',
  },
};

export default function Home() {
  return <HomePage />;
}