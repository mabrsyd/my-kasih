import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeartCursor from '@/components/HeartCursor';
import MusicPlayer from '@/components/MusicPlayer';
import RomanticBackground from '@/components/RomanticBackground';
import KonamiEgg from '@/components/KonamiEgg';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <RomanticBackground />
            <HeartCursor />
            <KonamiEgg />
            <Navbar />
            <main className="pt-16 min-h-screen">{children}</main>
            <MusicPlayer />
            <Footer />
        </>
    );
}
