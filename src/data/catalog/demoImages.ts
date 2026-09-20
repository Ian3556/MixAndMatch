export const DEMO_CATALOG_IMAGE_BUCKET = 'mixandmatch-demo-catalog';

export const DEMO_CATALOG_IMAGE_ASSETS = {
  t_shirt: {
    localPath: 'assets/catalog/demo/t-shirt.png',
    storagePath: 'categories/t-shirt.png',
  },
  shirt: {
    localPath: 'assets/catalog/demo/shirt.png',
    storagePath: 'categories/shirt.png',
  },
  sweater: {
    localPath: 'assets/catalog/demo/sweater.png',
    storagePath: 'categories/sweater.png',
  },
  cardigan: {
    localPath: 'assets/catalog/demo/cardigan.png',
    storagePath: 'categories/cardigan.png',
  },
  hoodie: {
    localPath: 'assets/catalog/demo/hoodie.png',
    storagePath: 'categories/hoodie.png',
  },
  jacket: {
    localPath: 'assets/catalog/demo/jacket.png',
    storagePath: 'categories/jacket.png',
  },
  coat: {
    localPath: 'assets/catalog/demo/coat.png',
    storagePath: 'categories/coat.png',
  },
  trousers: {
    localPath: 'assets/catalog/demo/trousers.png',
    storagePath: 'categories/trousers.png',
  },
  jeans: {
    localPath: 'assets/catalog/demo/jeans.png',
    storagePath: 'categories/jeans.png',
  },
  shorts: {
    localPath: 'assets/catalog/demo/shorts.png',
    storagePath: 'categories/shorts.png',
  },
  skirt: {
    localPath: 'assets/catalog/demo/skirt.png',
    storagePath: 'categories/skirt.png',
  },
  dress: {
    localPath: 'assets/catalog/demo/dress.png',
    storagePath: 'categories/dress.png',
  },
  sneakers: {
    localPath: 'assets/catalog/demo/sneakers.png',
    storagePath: 'categories/sneakers.png',
  },
  boots: {
    localPath: 'assets/catalog/demo/boots.png',
    storagePath: 'categories/boots.png',
  },
  loafers: {
    localPath: 'assets/catalog/demo/loafers.png',
    storagePath: 'categories/loafers.png',
  },
  bag: {
    localPath: 'assets/catalog/demo/bag.png',
    storagePath: 'categories/bag.png',
  },
  hat: {
    localPath: 'assets/catalog/demo/hat.png',
    storagePath: 'categories/hat.png',
  },
} as const;

export type DemoCatalogImageKey = keyof typeof DEMO_CATALOG_IMAGE_ASSETS;

export function isDemoCatalogImageKey(value: string): value is DemoCatalogImageKey {
  return Object.prototype.hasOwnProperty.call(DEMO_CATALOG_IMAGE_ASSETS, value);
}
