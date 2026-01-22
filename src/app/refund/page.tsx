import { Metadata } from 'next';
import RefundPolicy from '@/components/pages/RefundPolicy';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Understand our refund policy and terms for HisabHub services.',
};

export default function RefundPage() {
  return <RefundPolicy />;
}