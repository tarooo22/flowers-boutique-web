/**
 * Builder Asset Mapping System
 * Maps Flower’s Boutique product flowers to builder asset images
 * Supports layered bouquet composition with wrappers, ribbons, and flowers
 */

export interface BuilderFlowerAsset {
  id: string;
  nameKa: string;
  nameEn: string;
  assetPath: string;
  thumbnailPath: string;
  availableColors: string[];
  defaultColor: string;
}

export interface BuilderWrapperAsset {
  id: string;
  nameKa: string;
  nameEn: string;
  backPath: string;
  frontPath: string;
  color: string;
  hexColor: string;
}

export interface BuilderRibbonAsset {
  id: string;
  nameKa: string;
  nameEn: string;
  assetPath: string;
  color: string;
  hexColor: string;
}

// Flower asset mapping: Georgian name → builder asset
export const BUILDER_FLOWERS: Record<string, BuilderFlowerAsset> = {
  'ვარდი': {
    id: 'rose',
    nameKa: 'ვარდი',
    nameEn: 'Rose',
    assetPath: '/src/assets/bouquet-builder/builder-rose-red-long.png',
    thumbnailPath: '/src/assets/bouquet-builder/builder-rose-red-long.png',
    availableColors: ['red', 'pink', 'white'],
    defaultColor: 'red',
  },
  'სპრეი ვარდი': {
    id: 'spray-rose',
    nameKa: 'სპრეი ვარდი',
    nameEn: 'Spray Rose',
    assetPath: '/src/assets/bouquet-builder/builder-spray-rose-white-long.png',
    thumbnailPath: '/src/assets/bouquet-builder/builder-spray-rose-white-long.png',
    availableColors: ['white', 'pink', 'red'],
    defaultColor: 'white',
  },
  'ლილია': {
    id: 'lily',
    nameKa: 'ლილია',
    nameEn: 'Lily',
    assetPath: '/src/assets/bouquet-builder/builder-lily-pink-long.png',
    thumbnailPath: '/src/assets/bouquet-builder/builder-lily-pink-long.png',
    availableColors: ['pink', 'white', 'red'],
    defaultColor: 'pink',
  },
  'მზესუმზირა': {
    id: 'sunflower',
    nameKa: 'მზესუმზირა',
    nameEn: 'Sunflower',
    assetPath: '/src/assets/bouquet-builder/builder-sunflower-yellow-photo.png',
    thumbnailPath: '/src/assets/bouquet-builder/builder-sunflower-yellow-photo.png',
    availableColors: ['yellow'],
    defaultColor: 'yellow',
  },
  'ჰორტენზია': {
    id: 'hydrangea',
    nameKa: 'ჰორტენზია',
    nameEn: 'Hydrangea',
    assetPath: '/src/assets/bouquet-builder/builder-hydrangea-blue-long.png',
    thumbnailPath: '/src/assets/bouquet-builder/builder-hydrangea-blue-long.png',
    availableColors: ['blue', 'pink', 'white'],
    defaultColor: 'blue',
  },
  'პიონი': {
    id: 'peony',
    nameKa: 'პიონი',
    nameEn: 'Peony',
    assetPath: '/src/assets/bouquet-builder/builder-peony-pink-long.png',
    thumbnailPath: '/src/assets/bouquet-builder/builder-peony-pink-long.png',
    availableColors: ['pink', 'white', 'red'],
    defaultColor: 'pink',
  },
  'ეუსტომა': {
    id: 'eustoma',
    nameKa: 'ეუსტომა',
    nameEn: 'Eustoma',
    assetPath: '/src/assets/bouquet-builder/builder-eustoma-white-long.png',
    thumbnailPath: '/src/assets/bouquet-builder/builder-eustoma-white-long.png',
    availableColors: ['white', 'pink', 'purple'],
    defaultColor: 'white',
  },
  'ალსტრომერია': {
    id: 'alstroemeria',
    nameKa: 'ალსტრომერია',
    nameEn: 'Alstroemeria',
    assetPath: '/src/assets/bouquet-builder/builder-alstroemeria-white-long.png',
    thumbnailPath: '/src/assets/bouquet-builder/builder-alstroemeria-white-long.png',
    availableColors: ['white', 'pink', 'orange'],
    defaultColor: 'white',
  },
  'მოლუკელა': {
    id: 'moluccella',
    nameKa: 'მოლუკელა',
    nameEn: 'Moluccella',
    assetPath: '/src/assets/bouquet-builder/builder-moluccella-green-photo.png',
    thumbnailPath: '/src/assets/bouquet-builder/builder-moluccella-green-photo.png',
    availableColors: ['green'],
    defaultColor: 'green',
  },
};

// Wrapper options: color → builder assets
export const BUILDER_WRAPPERS: Record<string, BuilderWrapperAsset> = {
  'cream': {
    id: 'cream',
    nameKa: 'კრემი',
    nameEn: 'Cream',
    backPath: '/src/assets/bouquet-builder/builder-wrap-cream-back.png',
    frontPath: '/src/assets/bouquet-builder/builder-wrap-cream-front.png',
    color: 'cream',
    hexColor: '#F5F1ED',
  },
  'burgundy': {
    id: 'burgundy',
    nameKa: 'ღრმა წაბლი',
    nameEn: 'Burgundy',
    backPath: '/src/assets/bouquet-builder/builder-wrap-burgundy-back.png',
    frontPath: '/src/assets/bouquet-builder/builder-wrap-burgundy-front.png',
    color: 'burgundy',
    hexColor: '#6B2C3E',
  },
  'light-green': {
    id: 'light-green',
    nameKa: 'ღია მწვანე',
    nameEn: 'Light Green',
    backPath: '/src/assets/bouquet-builder/builder-wrap-light-green-back.png',
    frontPath: '/src/assets/bouquet-builder/builder-wrap-light-green-front.png',
    color: 'light-green',
    hexColor: '#C8D5B7',
  },
  'light-pink': {
    id: 'light-pink',
    nameKa: 'ღია ვარდისფერი',
    nameEn: 'Light Pink',
    backPath: '/src/assets/bouquet-builder/builder-wrap-light-pink-back.png',
    frontPath: '/src/assets/bouquet-builder/builder-wrap-light-pink-front.png',
    color: 'light-pink',
    hexColor: '#E8D5D0',
  },
  'yellow': {
    id: 'yellow',
    nameKa: 'ოქროსფერი',
    nameEn: 'Yellow',
    backPath: '/src/assets/bouquet-builder/builder-wrap-yellow-back.png',
    frontPath: '/src/assets/bouquet-builder/builder-wrap-yellow-front.png',
    color: 'yellow',
    hexColor: '#F4D89F',
  },
};

// Ribbon options: color → builder assets
export const BUILDER_RIBBONS: Record<string, BuilderRibbonAsset> = {
  'burgundy': {
    id: 'burgundy',
    nameKa: 'ღრმა წაბლი',
    nameEn: 'Burgundy',
    assetPath: '/src/assets/bouquet-builder/builder-ribbon-burgundy-photo.png',
    color: 'burgundy',
    hexColor: '#6B2C3E',
  },
  'ivory': {
    id: 'ivory',
    nameKa: 'სპილოს ძვალი',
    nameEn: 'Ivory',
    assetPath: '/src/assets/bouquet-builder/builder-ribbon-ivory-photo.png',
    color: 'ivory',
    hexColor: '#F5F1ED',
  },
  'light-green': {
    id: 'light-green',
    nameKa: 'ღია მწვანე',
    nameEn: 'Light Green',
    assetPath: '/src/assets/bouquet-builder/builder-ribbon-light-green-photo.png',
    color: 'light-green',
    hexColor: '#C8D5B7',
  },
  'white': {
    id: 'white',
    nameKa: 'თეთრი',
    nameEn: 'White',
    assetPath: '/src/assets/bouquet-builder/builder-ribbon-white-photo.png',
    color: 'white',
    hexColor: '#FFFFFF',
  },
};

// Default bouquet configuration
export const DEFAULT_BOUQUET_CONFIG = {
  wrapper: 'cream',
  ribbon: 'burgundy',
  flowers: [] as Array<{ id: string; nameKa: string; quantity: number; color: string }>,
};

// Helper: Get builder asset for a flower
export function getBuilderFlowerAsset(nameKa: string): BuilderFlowerAsset | null {
  return BUILDER_FLOWERS[nameKa] || null;
}

// Helper: Get wrapper asset
export function getWrapperAsset(wrapperId: string): BuilderWrapperAsset | null {
  return BUILDER_WRAPPERS[wrapperId] || null;
}

// Helper: Get ribbon asset
export function getRibbonAsset(ribbonId: string): BuilderRibbonAsset | null {
  return BUILDER_RIBBONS[ribbonId] || null;
}
