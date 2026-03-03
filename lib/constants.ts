// ============================================
// IDENTITAS PASANGAN — ubah sesuai kebutuhan
// ============================================
export const PARTNER_NAME = process.env.NEXT_PUBLIC_PARTNER_NAME || 'Sayangku';
export const YOUR_NAME    = process.env.NEXT_PUBLIC_YOUR_NAME    || 'Untukmu';

/** Tanggal mulai hubungan / hari pernikahan (ISO 8601) */
export const LOVE_START_DATE = process.env.NEXT_PUBLIC_LOVE_START_DATE || '2023-01-01T00:00:00';

/** Tanggal ulang tahun istri (MM-DD, tanpa tahun) */
export const PARTNER_BIRTHDAY = process.env.NEXT_PUBLIC_PARTNER_BIRTHDAY || '04-15';

// ============================================
// SITE
// ============================================
export const SITE_NAME        = process.env.NEXT_PUBLIC_SITE_TITLE || 'My Kasih';
export const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A romantic love story';
export const SITE_URL         = process.env.NEXT_PUBLIC_SITE_URL   || 'http://localhost:3000';

// ============================================
// NAVIGASI
// ============================================
export const NAVIGATION_LINKS = [
  { label: 'Home',     href: '/',         id: 'home'    },
  { label: 'About',   href: '/about',    id: 'about'   },
  { label: 'Memories',href: '/memories', id: 'memories'},
  { label: 'Gallery', href: '/gallery',  id: 'gallery' },
  { label: 'Letter',  href: '/letter',   id: 'letter'  },
] as const;

// ============================================
// HERO MESSAGES (bahasa Indonesia)
// ============================================
export const HERO_MESSAGES = [
  'Kamu adalah alasan terbaik aku bangun setiap pagi',
  'Bersamamu, setiap hari terasa seperti petualangan indah',
  'Rinduku padamu tidak pernah berkurang sedetik pun',
  'Kamu bukan hanya cintaku, kamu adalah rumahku',
  'Aku jatuh cinta padamu setiap hari, berulang kali',
  'Dengan kamu, aku menemukan arti kebahagiaan yang sesungguhnya',
  'Kamu adalah doa yang terkabul yang tidak pernah kusadari kupanjatkan',
  'Di sisimu adalah tempat paling aman di dunia ini',
  'Setiap kenangan bersamamu adalah harta yang tidak ternilai',
  'Cintamu adalah melodi terindah dalam symphony hidupku',
] as const;

// ============================================
// ALASAN MENCINTAI — edit sesuai hatimu
// ============================================
export const LOVE_REASONS = [
  { emoji: '✨', text: 'Cara matamu berbinar saat bercerita tentang hal yang kamu suka' },
  { emoji: '🌸', text: 'Tawamu yang tulus dan hangat yang selalu membuat ruangan terasa lebih cerah' },
  { emoji: '🎵', text: 'Kamu hafal setiap lirik lagu yang kusukai, bahkan yang tidak populer sekalipun' },
  { emoji: '🌙', text: 'Di malam-malam sulit, suaramu adalah satu-satunya yang membuatku tenang' },
  { emoji: '🤍', text: 'Kamu mencintai orang-orang di sekitarmu dengan hati yang sangat besar' },
  { emoji: '🌿', text: 'Cara kamu memperhatikan detail-detail kecil yang orang lain abaikan' },
  { emoji: '💌', text: 'Setiap pesan darimu selalu membuatku tersenyum, kapanpun tiba' },
  { emoji: '🕊️', text: 'Keberanianmu menghadapi hidup, meski kamu tahu betapa sulitnya' },
  { emoji: '🫶', text: 'Tanganmu yang hangat saat menggenggam tanganku dalam gelap' },
  { emoji: '🌺', text: 'Cara kamu merawat orang yang kamu sayangi dengan sangat telaten' },
  { emoji: '⭐', text: 'Kamu membuat aku menjadi versi terbaik dari diriku sendiri' },
  { emoji: '🎀', text: 'Cara kamu mengingat hal-hal kecil yang pernah aku ceritakan' },
  { emoji: '🌊', text: 'Kedalaman perasaanmu yang tidak pernah berhenti mengagumkanku' },
  { emoji: '🍃', text: 'Bersamamu, setiap tempat biasa terasa seperti petualangan baru' },
  { emoji: '💫', text: 'Caramu tertawa hingga menutup mulut, malu-malu tapi bahagia' },
  { emoji: '🌷', text: 'Kamu adalah orang paling jujur yang pernah kukenal' },
  { emoji: '🎈', text: 'Semangatmu yang selalu memberi warna dalam hari-hariku yang abu-abu' },
  { emoji: '🕯️', text: 'Di sisimu adalah tempat paling aman dan hangat di seluruh dunia' },
  { emoji: '🫧', text: 'Cara kamu mencintaiku apa adanya, termasuk semua kekuranganku' },
  { emoji: '♾️', text: 'Dan seribu satu alasan lain yang terus bertambah setiap harinya' },
] as const;
