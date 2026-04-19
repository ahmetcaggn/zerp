export const trMessages = {
  common: {
    appName: 'ZERP',
    loading: 'Yukleniyor...',
    unauthorized: 'Bu alana erisim yetkiniz yok.',
  },
  nav: {
    home: 'Ana Sayfa',
    login: 'Giris',
    register: 'Kayit Ol',
    dashboard: 'Panel',
    logout: 'Cikis',
    language: 'Dil',
    menu: 'Menü',
  },
  home: {
    title: 'ZERP Frontend Template',
    description:
      'Tenant, client ve admin uygulamalari icin olceklenebilir Next.js + MUI template altyapisi.',
    cta: 'Panele Git',
  },
  auth: {
    loginTitle: 'Giris',
    registerTitle: 'Kayit Ol',
    redirecting: 'Kimlik saglayicisina yonlendiriliyorsunuz...',
  },
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Aktif varyanta gore moduler panel gorunumu',
  },
  employees: {
    title: 'Calisanlar',
    createButton: 'Calisan Ekle',
    editButton: 'Duzenle',
    deleteButton: 'Sil',
    emptyState: 'Henuz calisan bulunmuyor.',
    searchPlaceholder: 'Ad veya e-posta ile ara...',
    deletedTitle: 'Silinmis Calisanlar',
    restoreButton: 'Geri Yukle',
  },
  tickets: {
    title: 'Destek Talepleri',
    createButton: 'Yeni Talep',
    emptyState: 'Henuz destek talebi bulunmuyor.',
    addComment: 'Yorum Ekle',
    closeTicket: 'Talebi Kapat',
    commentPlaceholder: 'Yorumunuzu yazin...',
  },
  teams: {
    title: 'Takimlar',
    emptyState: 'Henuz takim bulunmuyor.',
    membersLabel: 'Uyeler',
  },
  notifications: {
    title: 'Bildirimler',
    sendButton: 'Gonder',
    recipientsLabel: 'Alicilar',
    subjectLabel: 'Konu',
    bodyLabel: 'Mesaj',
    sentSuccess: 'Bildirim basariyla gonderildi.',
  },
} as const
