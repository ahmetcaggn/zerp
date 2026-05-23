import type {
  MenuCategoryResponseDto,
  MenuItemResponseDto,
  MenuResponseDto,
  ProductResponseDto,
} from '../types/sale'

interface MockCatalogData {
  menus: MenuResponseDto[]
  menuCategories: MenuCategoryResponseDto[]
  menuItems: MenuItemResponseDto[]
  products: ProductResponseDto[]
}

interface MockMenuItemVisual {
  imageUrl: string
  badge?: string
}

const tenantId = 'tenant-mock'

const mockMenuItemVisualsById: Record<string, MockMenuItemVisual> = {
  'mock-menu-item-taraftar-burger-menu-kadikoy': {
    imageUrl:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    badge: 'Chef Choice',
  },
  'mock-menu-item-taraftar-burger-menu-2-kadikoy': {
    imageUrl:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    badge: 'Best Seller',
  },
  'mock-menu-item-kola-menu-kadikoy': {
    imageUrl:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80',
    badge: 'Cold Combo',
  },
  'mock-menu-item-ayran-menu-kadikoy': {
    imageUrl:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    badge: 'Fresh Pick',
  },
  'mock-menu-item-karisik-izgara-kadikoy': {
    imageUrl:
      'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1200&q=80',
    badge: 'Premium Grill',
  },
  'mock-menu-item-popular-burger-kadikoy': {
    imageUrl:
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1200&q=80',
    badge: 'Popular',
  },
  'mock-menu-item-sufle-kadikoy': {
    imageUrl:
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80',
    badge: 'Sweet Bite',
  },
  'mock-menu-item-avocado-beyoglu': {
    imageUrl:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    badge: 'All Day',
  },
  'mock-menu-item-lemonade-beyoglu': {
    imageUrl:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80',
    badge: 'Grab & Go',
  },
  'mock-menu-item-bagel-beyoglu': {
    imageUrl:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
    badge: 'Bakery',
  },
  'mock-menu-item-tiramisu-beyoglu': {
    imageUrl:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    badge: 'Dessert',
  },
  'mock-menu-item-bowl-besiktas': {
    imageUrl:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    badge: 'Office Lunch',
  },
  'mock-menu-item-sandwich-besiktas': {
    imageUrl:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80',
    badge: 'Quick Pick',
  },
  'mock-menu-item-coldbrew-besiktas': {
    imageUrl:
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80',
    badge: 'Cold Bar',
  },
  'mock-menu-item-mocha-uskudar': {
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    badge: 'Signature',
  },
  'mock-menu-item-cookie-uskudar': {
    imageUrl:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80',
    badge: 'Daily Fresh',
  },
}

function createMenu(menu: MenuResponseDto): MenuResponseDto {
  return menu
}

function createProduct(product: ProductResponseDto): ProductResponseDto {
  return product
}

function createMenuCategory(category: MenuCategoryResponseDto): MenuCategoryResponseDto {
  return category
}

function createMenuItem(item: MenuItemResponseDto): MenuItemResponseDto {
  return item
}

export const mockCatalogByShopId: Record<string, MockCatalogData> = {
  'shop-kadikoy': {
    menus: [
      createMenu({
        id: 'mock-menu-1-kadikoy',
        name: 'Menu#1',
        description: undefined,
        active: true,
        language: 'TR',
        shopId: 'shop-kadikoy',
        shopName: 'Kadikoy Subesi',
        tenantId,
      }),
    ],
    menuCategories: [
      createMenuCategory({
        id: 'mock-category-burgers-kadikoy',
        name: 'Burgerler',
        description: undefined,
        menuId: 'mock-menu-1-kadikoy',
        menuName: 'Menu#1',
        tenantId,
      }),
      createMenuCategory({
        id: 'mock-category-drinks-kadikoy',
        name: 'Icecekler',
        description: undefined,
        menuId: 'mock-menu-1-kadikoy',
        menuName: 'Menu#1',
        tenantId,
      }),
      createMenuCategory({
        id: 'mock-category-grills-kadikoy',
        name: 'Izgaralar',
        description: undefined,
        menuId: 'mock-menu-1-kadikoy',
        menuName: 'Menu#1',
        tenantId,
      }),
      createMenuCategory({
        id: 'mock-category-popular-kadikoy',
        name: 'Populer',
        description: undefined,
        menuId: 'mock-menu-1-kadikoy',
        menuName: 'Menu#1',
        tenantId,
      }),
      createMenuCategory({
        id: 'mock-category-desserts-kadikoy',
        name: 'Tatlilar',
        description: undefined,
        menuId: 'mock-menu-1-kadikoy',
        menuName: 'Menu#1',
        tenantId,
      }),
    ],
    menuItems: [
      createMenuItem({
        id: 'mock-menu-item-taraftar-burger-menu-kadikoy',
        name: 'Taraftar burger menu',
        description: '',
        price: 299.99,
        calories: 500,
        weight: '150',
        ingredients: ['marul', 'kiyma', 'ekmek'],
        allergens: ['Sut urunleri'],
        categoryId: 'mock-category-burgers-kadikoy',
        categoryName: 'Burgerler',
        productItems: [
          { productId: 'mock-product-hamburger-kadikoy', quantity: 1 },
          { productId: 'mock-product-kutu-kola-kadikoy', quantity: 1 },
          { productId: 'mock-product-patates-kadikoy', quantity: 1 },
        ],
        tenantId,
      }),
      createMenuItem({
        id: 'mock-menu-item-taraftar-burger-menu-2-kadikoy',
        name: 'Taraftar burger menu#2',
        description: '',
        price: 249.99,
        calories: 460,
        weight: '140',
        ingredients: ['hamburger ekmegi', 'kiyma', 'patates'],
        allergens: ['Gluten'],
        categoryId: 'mock-category-burgers-kadikoy',
        categoryName: 'Burgerler',
        productItems: [
          { productId: 'mock-product-ayran-kadikoy', quantity: 1 },
          { productId: 'mock-product-hamburger-kadikoy', quantity: 1 },
          { productId: 'mock-product-patates-kadikoy', quantity: 1 },
        ],
        tenantId,
      }),
      createMenuItem({
        id: 'mock-menu-item-kola-menu-kadikoy',
        name: 'Kola Menu',
        description: '',
        price: 129.99,
        categoryId: 'mock-category-drinks-kadikoy',
        categoryName: 'Icecekler',
        productItems: [{ productId: 'mock-product-kutu-kola-kadikoy', quantity: 1 }],
        tenantId,
      }),
      createMenuItem({
        id: 'mock-menu-item-ayran-menu-kadikoy',
        name: 'Ayran Menu',
        description: '',
        price: 89.99,
        categoryId: 'mock-category-drinks-kadikoy',
        categoryName: 'Icecekler',
        productItems: [{ productId: 'mock-product-ayran-kadikoy', quantity: 1 }],
        tenantId,
      }),
      createMenuItem({
        id: 'mock-menu-item-karisik-izgara-kadikoy',
        name: 'Karisik Izgara',
        description: '',
        price: 359.99,
        categoryId: 'mock-category-grills-kadikoy',
        categoryName: 'Izgaralar',
        productItems: [{ productId: 'mock-product-hamburger-kadikoy', quantity: 1 }],
        tenantId,
      }),
      createMenuItem({
        id: 'mock-menu-item-popular-burger-kadikoy',
        name: 'Popular Burger',
        description: '',
        price: 279.99,
        categoryId: 'mock-category-popular-kadikoy',
        categoryName: 'Populer',
        productItems: [
          { productId: 'mock-product-hamburger-kadikoy', quantity: 1 },
          { productId: 'mock-product-patates-kadikoy', quantity: 1 },
        ],
        tenantId,
      }),
      createMenuItem({
        id: 'mock-menu-item-sufle-kadikoy',
        name: 'Sufle',
        description: '',
        price: 149.99,
        categoryId: 'mock-category-desserts-kadikoy',
        categoryName: 'Tatlilar',
        productItems: [{ productId: 'mock-product-sufle-kadikoy', quantity: 1 }],
        tenantId,
      }),
    ],
    products: [
      createProduct({
        id: 'mock-product-ayran-kadikoy',
        name: 'Ayran 33cl',
        description: '',
        preparationTime: 0,
        isActive: false,
        shopId: 'shop-kadikoy',
        shopName: 'Kadikoy Subesi',
        tenantId,
      }),
      createProduct({
        id: 'mock-product-hamburger-kadikoy',
        name: 'Hamburger',
        description: '',
        preparationTime: 5,
        isActive: false,
        shopId: 'shop-kadikoy',
        shopName: 'Kadikoy Subesi',
        tenantId,
      }),
      createProduct({
        id: 'mock-product-kutu-kola-kadikoy',
        name: 'Kutu kola',
        description: '',
        preparationTime: 0,
        isActive: false,
        shopId: 'shop-kadikoy',
        shopName: 'Kadikoy Subesi',
        tenantId,
      }),
      createProduct({
        id: 'mock-product-patates-kadikoy',
        name: 'Patates kizartmasi',
        description: '',
        preparationTime: 4,
        isActive: false,
        shopId: 'shop-kadikoy',
        shopName: 'Kadikoy Subesi',
        tenantId,
      }),
      createProduct({
        id: 'mock-product-kofte-kadikoy',
        name: 'Izgara kofte',
        description: '',
        preparationTime: 8,
        isActive: false,
        shopId: 'shop-kadikoy',
        shopName: 'Kadikoy Subesi',
        tenantId,
      }),
      createProduct({
        id: 'mock-product-sufle-kadikoy',
        name: 'Sufle',
        description: '',
        preparationTime: 6,
        isActive: false,
        shopId: 'shop-kadikoy',
        shopName: 'Kadikoy Subesi',
        tenantId,
      }),
    ],
  },
  'shop-beyoglu': {
    menus: [
      createMenu({
        id: 'mock-menu-tourist-beyoglu',
        name: 'All Day Favorites',
        description: 'Yuksek sirkulasyona uygun hizli tuketim urunleri.',
        active: true,
        language: 'EN',
        shopId: 'shop-beyoglu',
        shopName: 'Beyoglu Subesi',
        tenantId,
      }),
      createMenu({
        id: 'mock-menu-dessert-beyoglu',
        name: 'Desserts & Bakery',
        description: 'Tatli vitrin ve firin urunleri.',
        active: true,
        language: 'EN',
        shopId: 'shop-beyoglu',
        shopName: 'Beyoglu Subesi',
        tenantId,
      }),
    ],
    menuCategories: [
      createMenuCategory({
        id: 'mock-category-favorites-breakfast-beyoglu',
        name: 'All Day Breakfast',
        description: 'Gun boyu servis edilen kahvalti favorileri.',
        menuId: 'mock-menu-tourist-beyoglu',
        menuName: 'All Day Favorites',
        tenantId,
      }),
      createMenuCategory({
        id: 'mock-category-favorites-drinks-beyoglu',
        name: 'Grab & Go Drinks',
        description: 'Yuksek sirkulasyona uygun hizli icecek secenekleri.',
        menuId: 'mock-menu-tourist-beyoglu',
        menuName: 'All Day Favorites',
        tenantId,
      }),
      createMenuCategory({
        id: 'mock-category-dessert-bakery-beyoglu',
        name: 'Bakery Shelf',
        description: 'Croissant, muffin ve gunluk bakery urunleri.',
        menuId: 'mock-menu-dessert-beyoglu',
        menuName: 'Desserts & Bakery',
        tenantId,
      }),
      createMenuCategory({
        id: 'mock-category-dessert-sweets-beyoglu',
        name: 'Sweet Counter',
        description: 'Tatli vitrin urunleri ve dilim pastalar.',
        menuId: 'mock-menu-dessert-beyoglu',
        menuName: 'Desserts & Bakery',
        tenantId,
      }),
    ],
    menuItems: [
      createMenuItem({
        id: 'mock-menu-item-avocado-beyoglu',
        name: 'Avocado Toast',
        description: 'Gun boyu servis edilen imza kahvaltilik.',
        price: 225,
        categoryId: 'mock-category-favorites-breakfast-beyoglu',
        categoryName: 'All Day Breakfast',
        tenantId,
      }),
      createMenuItem({
        id: 'mock-menu-item-lemonade-beyoglu',
        name: 'House Lemonade',
        description: 'Ev yapimi ferah limonata.',
        price: 125,
        categoryId: 'mock-category-favorites-drinks-beyoglu',
        categoryName: 'Grab & Go Drinks',
        productItems: [{ productId: 'mock-product-lemonade-beyoglu', quantity: 1 }],
        tenantId,
      }),
      createMenuItem({
        id: 'mock-menu-item-bagel-beyoglu',
        name: 'Cream Cheese Bagel',
        description: 'Yogun saatler icin hizli servis bagel.',
        price: 145,
        categoryId: 'mock-category-dessert-bakery-beyoglu',
        categoryName: 'Bakery Shelf',
        productItems: [{ productId: 'mock-product-bagel-beyoglu', quantity: 1 }],
        tenantId,
      }),
      createMenuItem({
        id: 'mock-menu-item-tiramisu-beyoglu',
        name: 'Mini Tiramisu',
        description: 'Vitrinde gunluk sunulan hafif tatli.',
        price: 160,
        categoryId: 'mock-category-dessert-sweets-beyoglu',
        categoryName: 'Sweet Counter',
        tenantId,
      }),
    ],
    products: [
      createProduct({
        id: 'mock-product-turkish-beyoglu',
        name: 'Turkish Coffee',
        description: 'Klasik Turk kahvesi.',
        preparationTime: 5,
        isActive: true,
        shopId: 'shop-beyoglu',
        shopName: 'Beyoglu Subesi',
        tenantId,
      }),
      createProduct({
        id: 'mock-product-filter-beyoglu',
        name: 'Filter Coffee',
        description: 'Gunluk tek koken demleme.',
        preparationTime: 4,
        isActive: true,
        shopId: 'shop-beyoglu',
        shopName: 'Beyoglu Subesi',
        tenantId,
      }),
      createProduct({
        id: 'mock-product-bagel-beyoglu',
        name: 'Cream Cheese Bagel',
        description: 'Krem peynirli bagel.',
        preparationTime: 6,
        isActive: true,
        shopId: 'shop-beyoglu',
        shopName: 'Beyoglu Subesi',
        tenantId,
      }),
      createProduct({
        id: 'mock-product-lemonade-beyoglu',
        name: 'Lemonade',
        description: 'Ev yapimi limonata.',
        preparationTime: 3,
        isActive: true,
        shopId: 'shop-beyoglu',
        shopName: 'Beyoglu Subesi',
        tenantId,
      }),
    ],
  },
  'shop-besiktas': {
    menus: [
      createMenu({
        id: 'mock-menu-office-besiktas',
        name: 'Office Lunch',
        description: 'Oglen trafigine uygun hizli menuler.',
        active: true,
        language: 'TR',
        shopId: 'shop-besiktas',
        shopName: 'Besiktas Subesi',
        tenantId,
      }),
      createMenu({
        id: 'mock-menu-cold-besiktas',
        name: 'Cold Bar',
        description: 'Soguk icecekler ve yaz serileri.',
        active: true,
        language: 'TR',
        shopId: 'shop-besiktas',
        shopName: 'Besiktas Subesi',
        tenantId,
      }),
    ],
    menuCategories: [
      createMenuCategory({
        id: 'mock-category-office-bowls-besiktas',
        name: 'Lunch Bowls',
        description: 'Oglen trafigine uygun hizli servis tabaklari.',
        menuId: 'mock-menu-office-besiktas',
        menuName: 'Office Lunch',
        tenantId,
      }),
      createMenuCategory({
        id: 'mock-category-office-sandwich-besiktas',
        name: 'Sandvicler',
        description: 'Hazirlanmasi hizli ofis tipi sandvicler.',
        menuId: 'mock-menu-office-besiktas',
        menuName: 'Office Lunch',
        tenantId,
      }),
      createMenuCategory({
        id: 'mock-category-cold-refreshers-besiktas',
        name: 'Serinleticiler',
        description: 'Limonata, soda bazli ve buzlu icecekler.',
        menuId: 'mock-menu-cold-besiktas',
        menuName: 'Cold Bar',
        tenantId,
      }),
    ],
    menuItems: [
      createMenuItem({
        id: 'mock-menu-item-bowl-besiktas',
        name: 'Tavuklu Lunch Bowl',
        description: 'Ofis cikisli hizli tuketime uygun bowl.',
        price: 235,
        categoryId: 'mock-category-office-bowls-besiktas',
        categoryName: 'Lunch Bowls',
        productItems: [{ productId: 'mock-product-sandwich-besiktas', quantity: 1 }],
        tenantId,
      }),
      createMenuItem({
        id: 'mock-menu-item-sandwich-besiktas',
        name: 'Tavuklu Sandvic',
        description: 'Izgara tavuk ve yesillikle hazirlanir.',
        price: 210,
        categoryId: 'mock-category-office-sandwich-besiktas',
        categoryName: 'Sandvicler',
        productItems: [{ productId: 'mock-product-sandwich-besiktas', quantity: 1 }],
        tenantId,
      }),
      createMenuItem({
        id: 'mock-menu-item-coldbrew-besiktas',
        name: 'Cold Brew',
        description: 'Yogun ama dengeli soguk demleme kahve.',
        price: 135,
        categoryId: 'mock-category-cold-refreshers-besiktas',
        categoryName: 'Serinleticiler',
        productItems: [{ productId: 'mock-product-coldbrew-besiktas', quantity: 1 }],
        tenantId,
      }),
    ],
    products: [
      createProduct({
        id: 'mock-product-coldbrew-besiktas',
        name: 'Cold Brew',
        description: 'Yogun ve serinletici cold brew.',
        preparationTime: 2,
        isActive: true,
        shopId: 'shop-besiktas',
        shopName: 'Besiktas Subesi',
        tenantId,
      }),
      createProduct({
        id: 'mock-product-sandwich-besiktas',
        name: 'Chicken Sandwich',
        description: 'Izgara tavuklu gunun sandvici.',
        preparationTime: 8,
        isActive: true,
        shopId: 'shop-besiktas',
        shopName: 'Besiktas Subesi',
        tenantId,
      }),
      createProduct({
        id: 'mock-product-brownie-besiktas',
        name: 'Brownie',
        description: 'Servise hazir vitrin urunu.',
        preparationTime: 1,
        isActive: false,
        shopId: 'shop-besiktas',
        shopName: 'Besiktas Subesi',
        tenantId,
      }),
    ],
  },
  'shop-uskudar': {
    menus: [
      createMenu({
        id: 'mock-menu-neighborhood-uskudar',
        name: 'Mahalle Favorileri',
        description: 'Gunun her saatine uygun temel urunler.',
        active: true,
        language: 'TR',
        shopId: 'shop-uskudar',
        shopName: 'Uskudar Subesi',
        tenantId,
      }),
    ],
    menuCategories: [
      createMenuCategory({
        id: 'mock-category-neighborhood-coffee-uskudar',
        name: 'Kahve Klasikleri',
        description: 'Mahalle mudavimlerinin en cok tercih ettigi kahveler.',
        menuId: 'mock-menu-neighborhood-uskudar',
        menuName: 'Mahalle Favorileri',
        tenantId,
      }),
      createMenuCategory({
        id: 'mock-category-neighborhood-snacks-uskudar',
        name: 'Atistirmaliklar',
        description: 'Cookie, mini tatlilar ve hizli atistirmaliklar.',
        menuId: 'mock-menu-neighborhood-uskudar',
        menuName: 'Mahalle Favorileri',
        tenantId,
      }),
    ],
    menuItems: [
      createMenuItem({
        id: 'mock-menu-item-mocha-uskudar',
        name: 'Mocha',
        description: 'Cikolata ve espresso dengesiyle servis edilir.',
        price: 170,
        categoryId: 'mock-category-neighborhood-coffee-uskudar',
        categoryName: 'Kahve Klasikleri',
        productItems: [{ productId: 'mock-product-mocha-uskudar', quantity: 1 }],
        tenantId,
      }),
      createMenuItem({
        id: 'mock-menu-item-cookie-uskudar',
        name: 'Cookie',
        description: 'Gunluk cikolata parcacikli kurabiye.',
        price: 85,
        categoryId: 'mock-category-neighborhood-snacks-uskudar',
        categoryName: 'Atistirmaliklar',
        productItems: [{ productId: 'mock-product-cookie-uskudar', quantity: 1 }],
        tenantId,
      }),
    ],
    products: [
      createProduct({
        id: 'mock-product-mocha-uskudar',
        name: 'Mocha',
        description: 'Cikolata ve espresso dengesi.',
        preparationTime: 6,
        isActive: true,
        shopId: 'shop-uskudar',
        shopName: 'Uskudar Subesi',
        tenantId,
      }),
      createProduct({
        id: 'mock-product-cookie-uskudar',
        name: 'Cookie',
        description: 'Gunluk cikolata parcacikli kurabiye.',
        preparationTime: 1,
        isActive: true,
        shopId: 'shop-uskudar',
        shopName: 'Uskudar Subesi',
        tenantId,
      }),
    ],
  },
}

export function findMockMenuById(menuId: string): MenuResponseDto | undefined {
  return Object.values(mockCatalogByShopId)
    .flatMap((catalog) => catalog.menus)
    .find((menu) => menu.id === menuId)
}

export function findMockMenuCategoriesByMenuId(menuId: string): MenuCategoryResponseDto[] {
  return Object.values(mockCatalogByShopId)
    .flatMap((catalog) => catalog.menuCategories)
    .filter((category) => category.menuId === menuId)
}

export function findMockCategoryById(categoryId: string): MenuCategoryResponseDto | undefined {
  return Object.values(mockCatalogByShopId)
    .flatMap((catalog) => catalog.menuCategories)
    .find((category) => category.id === categoryId)
}

export function findMockMenuItemsByCategoryId(categoryId: string): MenuItemResponseDto[] {
  return Object.values(mockCatalogByShopId)
    .flatMap((catalog) => catalog.menuItems)
    .filter((item) => item.categoryId === categoryId)
}

export function findMockProductsByShopId(shopId: string): ProductResponseDto[] {
  return mockCatalogByShopId[shopId]?.products ?? []
}

export function findMockMenuItemVisualById(menuItemId: string): MockMenuItemVisual | undefined {
  return mockMenuItemVisualsById[menuItemId]
}
