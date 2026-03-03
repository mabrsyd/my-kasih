import type { Metadata } from 'next';
import ReasonsClient from './ReasonsClient';

export const metadata: Metadata = {
  title: 'Alasanku | My Kasih',
  description: 'Alasan-alasan mengapa aku mencintaimu',
  robots: { index: false, follow: false },
};

export default function ReasonsPage() {
  return <ReasonsClient />;
}
