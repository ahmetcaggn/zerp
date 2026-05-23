import type { StockDashboardData } from '../types/stock-dashboard'

const commonTabs: StockDashboardData['tabs'] = [
  { key: 'resources', label: 'Stoklar' },
  { key: 'movements', label: 'Hareketler' },
  { key: 'counts', label: 'Sayımlar' },
]

const commonQuickActions: StockDashboardData['quickActions'] = [
  {
    id: 'add-resource',
    label: 'Stok Ekle',
    description: 'Yeni stok kalemi tanımlayarak depoya ürün ekle.',
  },
  {
    id: 'start-count',
    label: 'Stok Sayımı Başlat',
    description: 'Hızlı sayım süreci başlatıp farkları takip et.',
  },
  {
    id: 'stock-report',
    label: 'Stok Raporu',
    description: 'Kritik seviyeleri ve maliyetleri özetleyen raporu aç.',
  },
  {
    id: 'stock-movements',
    label: 'Stok Hareketleri',
    description: 'Giriş, çıkış ve düzeltme kayıtlarını görüntüle.',
  },
]

export const stockDashboardMockByShopId: Record<string, StockDashboardData> = {
  'shop-beyoglu': {
    shopId: 'shop-beyoglu',
    shopName: 'Beyoğlu Şubesi',
    title: 'Stok Yönetimi',
    subtitle: 'Stoklarınızı kolayca görüntüleyin, yönetin ve takip edin.',
    reportDateLabel: '17 Mayıs 2026',
    lastUpdatedAt: '2026-05-17T21:15:00+03:00',
    tabs: commonTabs,
    metrics: [
      { id: 'resourceKinds', label: 'Toplam Stok Çeşidi', value: 156, unit: 'count', helperText: 'Aktif ürün', tone: 'success' },
      { id: 'totalQuantity', label: 'Toplam Stok Miktarı', value: 8742, unit: 'count', helperText: 'Tüm depo', tone: 'info' },
      { id: 'inventoryValue', label: 'Toplam Stok Değeri', value: 1285420, unit: 'currency', helperText: 'Maliyet değeri', tone: 'warning' },
      { id: 'criticalResources', label: 'Kritik Stoklar', value: 12, unit: 'count', helperText: 'Stok eşiğinin altında', tone: 'danger' },
      { id: 'pendingOrders', label: 'Bekleyen Siparişler', value: 7, unit: 'count', helperText: 'Yeniden sipariş', tone: 'accent' },
    ],
    searchPlaceholder: 'Stok ara...',
    categoryOptions: [
      { label: 'Tümü', value: 'all' },
      { label: 'Kahve', value: 'coffee' },
      { label: 'Süt Ürünleri', value: 'milk' },
      { label: 'Ambalaj', value: 'packaging' },
    ],
    unitOptions: [
      { label: 'Tümü', value: 'all' },
      { label: 'kg', value: 'kg' },
      { label: 'lt', value: 'lt' },
      { label: 'adet', value: 'piece' },
    ],
    statusOptions: [
      { label: 'Tümü', value: 'all' },
      { label: 'Yeterli', value: 'healthy' },
      { label: 'Azalan Stok', value: 'low' },
      { label: 'Kritik', value: 'critical' },
    ],
    resources: [
      { id: 'res-1', name: 'Espresso Çekirdeği', category: 'Kahve', categoryColor: '#3b82f6', unitType: 'kg', quantity: 48, reorderThreshold: 16, unitPrice: 320, stockValue: 15360, status: 'healthy', statusLabel: 'Yeterli' },
      { id: 'res-2', name: 'Tam Yağlı Süt', category: 'Süt Ürünleri', categoryColor: '#60a5fa', unitType: 'lt', quantity: 120, reorderThreshold: 32, unitPrice: 28.5, stockValue: 3420, status: 'healthy', statusLabel: 'Yeterli' },
      { id: 'res-3', name: 'Toz Şeker', category: 'Tatlandırıcı', categoryColor: '#f59e0b', unitType: 'kg', quantity: 32, reorderThreshold: 20, unitPrice: 18, stockValue: 576, status: 'low', statusLabel: 'Azalan Stok' },
      { id: 'res-4', name: 'Kağıt Bardak 12oz', category: 'Ambalaj', categoryColor: '#8b5cf6', unitType: 'adet', quantity: 250, reorderThreshold: 120, unitPrice: 1.2, stockValue: 300, status: 'healthy', statusLabel: 'Yeterli' },
      { id: 'res-5', name: 'Bardak Kapağı', category: 'Ambalaj', categoryColor: '#8b5cf6', unitType: 'adet', quantity: 80, reorderThreshold: 100, unitPrice: 0.85, stockValue: 68, status: 'low', statusLabel: 'Azalan Stok' },
      { id: 'res-6', name: 'Çikolata Parçacıklı Sos', category: 'Soslar', categoryColor: '#22c55e', unitType: 'kg', quantity: 5, reorderThreshold: 12, unitPrice: 150, stockValue: 750, status: 'critical', statusLabel: 'Kritik' },
      { id: 'res-7', name: 'Vanilya Şurup', category: 'Şuruplar', categoryColor: '#f59e0b', unitType: 'lt', quantity: 12, reorderThreshold: 6, unitPrice: 95, stockValue: 1140, status: 'healthy', statusLabel: 'Yeterli' },
      { id: 'res-8', name: 'Yeşil Çay', category: 'Çay', categoryColor: '#65a30d', unitType: 'kg', quantity: 7, reorderThreshold: 14, unitPrice: 125, stockValue: 875, status: 'critical', statusLabel: 'Kritik' },
    ],
    movements: [
      { id: 'mov-1', resourceName: 'Espresso Çekirdeği', type: 'purchase', typeLabel: 'Satın Alma', movementDate: '2026-05-17', quantityLabel: '+16 kg', actor: 'Depo Sorumlusu', timestampLabel: '17 Mayıs 14:20', notes: 'Tedarik giriş' },
      { id: 'mov-2', resourceName: 'Tam Yağlı Süt', type: 'consumption', typeLabel: 'Tüketim', movementDate: '2026-05-17', quantityLabel: '-24 lt', actor: 'Satış Operasyonu', timestampLabel: '17 Mayıs 12:10', notes: 'Günlük kullanım' },
      { id: 'mov-3', resourceName: 'Kağıt Bardak 12oz', type: 'adjustment', typeLabel: 'Düzeltme', movementDate: '2026-05-16', quantityLabel: '-12 adet', actor: 'Vardiya Müdürü', timestampLabel: '16 Mayıs 19:45', notes: 'Sayım farkı düzeltildi' },
      { id: 'mov-4', resourceName: 'Vanilya Şurup', type: 'purchase', typeLabel: 'Satın Alma', movementDate: '2026-05-16', quantityLabel: '+6 lt', actor: 'Satın Alma', timestampLabel: '16 Mayıs 10:15', notes: 'Acil replenishment' },
    ],
    counts: [
      { id: 'count-1', countDate: '2026-05-17', countDateLabel: '17 Mayıs 2026', statusLabel: 'Tamamlandı', status: 'completed', discrepancyLabel: '2 fark bulundu', responsible: 'Neslihan A.' },
      { id: 'count-2', countDate: '2026-05-12', countDateLabel: '12 Mayıs 2026', statusLabel: 'Devam Ediyor', status: 'inProgress', discrepancyLabel: 'Sayım sürüyor', responsible: 'Baran K.' },
      { id: 'count-3', countDate: '2026-05-03', countDateLabel: '03 Mayıs 2026', statusLabel: 'Taslak', status: 'draft', discrepancyLabel: 'Planlama bekliyor', responsible: 'Merve T.' },
    ],
    distribution: [
      { label: 'Yeterli', count: 112, percentage: 71.8, color: '#20b486' },
      { label: 'Azalan Stok', count: 28, percentage: 17.9, color: '#f59e0b' },
      { label: 'Kritik', count: 16, percentage: 10.3, color: '#ef4444' },
    ],
    valuableResources: [
      { id: 'val-1', name: 'Espresso Çekirdeği', value: 15360 },
      { id: 'val-2', name: 'Tam Yağlı Süt', value: 3420 },
      { id: 'val-3', name: 'Vanilya Şurup', value: 1140 },
      { id: 'val-4', name: 'Çikolata Parçacıklı Sos', value: 750 },
      { id: 'val-5', name: 'Toz Şeker', value: 576 },
    ],
    quickActions: commonQuickActions,
    alert: {
      title: 'Dikkat Edilmesi Gerekenler',
      description: '12 stok kalemi minimum stok seviyesinin altında. Yeniden sipariş oluşturmanız önerilir.',
      ctaLabel: 'Detayları Gör',
    },
  },
  'shop-kadikoy': {
    shopId: 'shop-kadikoy',
    shopName: 'Kadıköy Şubesi',
    title: 'Stok Yönetimi',
    subtitle: 'Stoklarınızı kolayca görüntüleyin, yönetin ve takip edin.',
    reportDateLabel: '17 Mayıs 2026',
    lastUpdatedAt: '2026-05-17T21:05:00+03:00',
    tabs: commonTabs,
    metrics: [
      { id: 'resourceKinds', label: 'Toplam Stok Çeşidi', value: 168, unit: 'count', helperText: 'Aktif ürün', tone: 'success' },
      { id: 'totalQuantity', label: 'Toplam Stok Miktarı', value: 9260, unit: 'count', helperText: 'Tüm depo', tone: 'info' },
      { id: 'inventoryValue', label: 'Toplam Stok Değeri', value: 1368420, unit: 'currency', helperText: 'Maliyet değeri', tone: 'warning' },
      { id: 'criticalResources', label: 'Kritik Stoklar', value: 9, unit: 'count', helperText: 'Stok eşiğinin altında', tone: 'danger' },
      { id: 'pendingOrders', label: 'Bekleyen Siparişler', value: 5, unit: 'count', helperText: 'Yeniden sipariş', tone: 'accent' },
    ],
    searchPlaceholder: 'Stok ara...',
    categoryOptions: [
      { label: 'Tümü', value: 'all' },
      { label: 'Kahve', value: 'coffee' },
      { label: 'Süt Ürünleri', value: 'milk' },
      { label: 'Tatlı', value: 'dessert' },
    ],
    unitOptions: [
      { label: 'Tümü', value: 'all' },
      { label: 'kg', value: 'kg' },
      { label: 'lt', value: 'lt' },
      { label: 'adet', value: 'piece' },
    ],
    statusOptions: [
      { label: 'Tümü', value: 'all' },
      { label: 'Yeterli', value: 'healthy' },
      { label: 'Azalan Stok', value: 'low' },
      { label: 'Kritik', value: 'critical' },
    ],
    resources: [
      { id: 'kad-1', name: 'Espresso Çekirdeği', category: 'Kahve', categoryColor: '#3b82f6', unitType: 'kg', quantity: 55, reorderThreshold: 18, unitPrice: 318, stockValue: 17490, status: 'healthy', statusLabel: 'Yeterli' },
      { id: 'kad-2', name: 'Yulaf Sütü', category: 'Süt Ürünleri', categoryColor: '#60a5fa', unitType: 'lt', quantity: 48, reorderThreshold: 20, unitPrice: 44, stockValue: 2112, status: 'low', statusLabel: 'Azalan Stok' },
      { id: 'kad-3', name: 'Mocha Sos', category: 'Soslar', categoryColor: '#22c55e', unitType: 'kg', quantity: 8, reorderThreshold: 14, unitPrice: 138, stockValue: 1104, status: 'critical', statusLabel: 'Kritik' },
      { id: 'kad-4', name: 'Cheesecake Dilimi', category: 'Tatlı', categoryColor: '#f59e0b', unitType: 'adet', quantity: 22, reorderThreshold: 10, unitPrice: 28, stockValue: 616, status: 'healthy', statusLabel: 'Yeterli' },
    ],
    movements: [
      { id: 'kad-mov-1', resourceName: 'Yulaf Sütü', type: 'purchase', typeLabel: 'Satın Alma', movementDate: '2026-05-17', quantityLabel: '+10 lt', actor: 'Satın Alma', timestampLabel: '17 Mayıs 11:30', notes: 'Şube takviyesi' },
      { id: 'kad-mov-2', resourceName: 'Mocha Sos', type: 'adjustment', typeLabel: 'Düzeltme', movementDate: '2026-05-17', quantityLabel: '-2 kg', actor: 'Mağaza Müdürü', timestampLabel: '17 Mayıs 09:00', notes: 'Hasarlı ürün ayrıldı' },
    ],
    counts: [
      { id: 'kad-count-1', countDate: '2026-05-15', countDateLabel: '15 Mayıs 2026', statusLabel: 'Tamamlandı', status: 'completed', discrepancyLabel: 'Fark yok', responsible: 'Neslihan A.' },
      { id: 'kad-count-2', countDate: '2026-05-08', countDateLabel: '08 Mayıs 2026', statusLabel: 'Taslak', status: 'draft', discrepancyLabel: 'Planlanıyor', responsible: 'Ece Y.' },
    ],
    distribution: [
      { label: 'Yeterli', count: 123, percentage: 73.2, color: '#20b486' },
      { label: 'Azalan Stok', count: 30, percentage: 17.9, color: '#f59e0b' },
      { label: 'Kritik', count: 15, percentage: 8.9, color: '#ef4444' },
    ],
    valuableResources: [
      { id: 'kad-val-1', name: 'Espresso Çekirdeği', value: 17490 },
      { id: 'kad-val-2', name: 'Yulaf Sütü', value: 2112 },
      { id: 'kad-val-3', name: 'Mocha Sos', value: 1104 },
    ],
    quickActions: commonQuickActions,
    alert: {
      title: 'Dikkat Edilmesi Gerekenler',
      description: '9 stok kalemi minimum stok seviyesinin altında. Bugün satın alma planı oluşturmanız önerilir.',
      ctaLabel: 'Detayları Gör',
    },
  },
}
