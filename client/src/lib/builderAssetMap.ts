/**
 * Builder Asset Mapping System
 * Maps Flower’s Boutique product names to builder asset paths (S3-hosted)
 */

export const BUILDER_ASSETS = {
  // Wrapper layers
  wrapper: {
    back: '/manus-storage/builder-bouquet-wrapper-back_39f6483c.png',
    front: '/manus-storage/builder-bouquet-wrapper-front_ad8479da.png',
  },
  
  // Wrapper color variations (back + front)
  wrappers: {
    cream: {
      back: '/manus-storage/builder-wrap-cream-back_e0513a4a.png',
      front: '/manus-storage/builder-wrap-cream-front_bd5ce91f.png',
    },
    burgundy: {
      back: '/manus-storage/builder-wrap-burgundy-back_1a0d76b3.png',
      front: '/manus-storage/builder-wrap-burgundy-front_f777cdfc.png',
    },
    'light-green': {
      back: '/manus-storage/builder-wrap-light-green-back_19a8c092.png',
      front: '/manus-storage/builder-wrap-light-green-front_d1e6fddc.png',
    },
    'light-pink': {
      back: '/manus-storage/builder-wrap-light-pink-back_b213e159.png',
      front: '/manus-storage/builder-wrap-light-pink-front_afee8d50.png',
    },
    yellow: {
      back: '/manus-storage/builder-wrap-yellow-back_118c3221.png',
      front: '/manus-storage/builder-wrap-yellow-front_c75c9b96.png',
    },
  },

  // Ribbon assets
  ribbon: {
    only: '/manus-storage/builder-ribbon-only_d04ee68c.png',
    burgundy: '/manus-storage/builder-ribbon-burgundy-photo_fcbee894.png',
    ivory: '/manus-storage/builder-ribbon-ivory-photo_dee04a66.png',
    'light-green': '/manus-storage/builder-ribbon-light-green-photo_bee113a6.png',
    white: '/manus-storage/builder-ribbon-white-photo_6c92e12e.png',
  },

  // Paper overlay masks
  overlays: {
    backPaper: '/manus-storage/builder-bouquet-back-paper-overlay-mask_243295da.png',
    frontPaper: '/manus-storage/builder-bouquet-front-paper-overlay-mask_2b9a855d.png',
    guardPaper: '/manus-storage/builder-bouquet-guard-paper-overlay-mask_5050d3c7.png',
    stemGuard: '/manus-storage/builder-bouquet-stem-guard-clean-mask_d141e755.png',
  },

  // Flower assets - mapped by product name
  flowers: {
    // Rose variants
    rose: '/manus-storage/builder-rose-red-long_c5da74d4.png',
    'spray-rose': '/manus-storage/builder-spray-rose-white-long_bc97f140.png',
    
    // Lily variants
    lily: '/manus-storage/builder-lily-pink-long_87ec2a84.png',
    'lily-blue': '/manus-storage/builder-hydrangea-blue-long_1720a777.png',
    
    // Sunflower
    sunflower: '/manus-storage/builder-sunflower-yellow-photo_4e110129.png',
    
    // Hydrangea
    hydrangea: '/manus-storage/builder-hydrangea-blue-long_1720a777.png',
    
    // Gypsophila (baby breath)
    gypsophila: '/manus-storage/builder-alstroemeria-white-long_21ac0fd9.png',
    
    // Alstroemeria
    alstroemeria: '/manus-storage/builder-alstroemeria-white-long_21ac0fd9.png',
    
    // Eustoma
    eustoma: '/manus-storage/builder-eustoma-white-long_aa868811.png',
    
    // Orchid
    orchid: '/manus-storage/builder-peony-pink-long_9274ca38.png',
    
    // Greenery and fillers
    eucalyptus: '/manus-storage/builder-alstroemeria-white-long_21ac0fd9.png',
    moluccella: '/manus-storage/builder-moluccella-green-photo_a18f1036.png',
    gerbera: '/manus-storage/builder-rose-red-long_c5da74d4.png',
    chrysanthemum: '/manus-storage/builder-alstroemeria-white-long_21ac0fd9.png',
    dianthus: '/manus-storage/builder-spray-rose-white-long_bc97f140.png',
    calla: '/manus-storage/builder-peony-pink-long_9274ca38.png',
    strelitzia: '/manus-storage/builder-rose-red-long_c5da74d4.png',
    viburnum: '/manus-storage/builder-alstroemeria-white-long_21ac0fd9.png',
    craspedia: '/manus-storage/builder-sunflower-yellow-photo_4e110129.png',
    ruscus: '/manus-storage/builder-moluccella-green-photo_a18f1036.png',
    anthurium: '/manus-storage/builder-rose-red-long_c5da74d4.png',
    limonium: '/manus-storage/builder-eustoma-white-long_aa868811.png',
    amaranthus: '/manus-storage/builder-rose-red-long_c5da74d4.png',
    curcuma: '/manus-storage/builder-sunflower-yellow-photo_4e110129.png',
    hypericum: '/manus-storage/builder-rose-red-long_c5da74d4.png',
    solidago: '/manus-storage/builder-sunflower-yellow-photo_4e110129.png',
    peony: '/manus-storage/builder-peony-pink-long_9274ca38.png',
  },
};

/**
 * Get flower asset path by product name
 */
export function getFlowerAsset(productName: string): string {
  const normalized = productName.toLowerCase().trim();
  
  // Direct match
  if (BUILDER_ASSETS.flowers[normalized as keyof typeof BUILDER_ASSETS.flowers]) {
    return BUILDER_ASSETS.flowers[normalized as keyof typeof BUILDER_ASSETS.flowers];
  }

  // Partial matches for Georgian names
  if (normalized.includes('სპრეი') || (normalized.includes('spray') && normalized.includes('rose'))) {
    return BUILDER_ASSETS.flowers['spray-rose'];
  }
  if (normalized.includes('ვარდი') || normalized.includes('rose')) {
    return BUILDER_ASSETS.flowers.rose;
  }
  if (normalized.includes('ლილია') || normalized.includes('lily')) {
    if (normalized.includes('ლურჯი') || normalized.includes('blue')) {
      return BUILDER_ASSETS.flowers['lily-blue'];
    }
    return BUILDER_ASSETS.flowers.lily;
  }
  if (normalized.includes('მზესუმზირა') || normalized.includes('sunflower')) {
    return BUILDER_ASSETS.flowers.sunflower;
  }
  if (normalized.includes('ჰორტენზია') || normalized.includes('hydrangea')) {
    return BUILDER_ASSETS.flowers.hydrangea;
  }
  if (normalized.includes('გიფსოფილა') || normalized.includes('gypsophila') || normalized.includes('baby breath')) {
    return BUILDER_ASSETS.flowers.gypsophila;
  }
  if (normalized.includes('ალსტრომერია') || normalized.includes('alstroemeria')) {
    return BUILDER_ASSETS.flowers.alstroemeria;
  }
  if (normalized.includes('ეუსტომა') || normalized.includes('eustoma') || normalized.includes('lisianthus')) {
    return BUILDER_ASSETS.flowers.eustoma;
  }
  if (normalized.includes('ორქიდეა') || normalized.includes('orchid')) {
    return BUILDER_ASSETS.flowers.orchid;
  }
  if (normalized.includes('ევკალიპტი') || normalized.includes('eucalyptus')) {
    return BUILDER_ASSETS.flowers.eucalyptus;
  }
  if (normalized.includes('მოლუცელა') || normalized.includes('moluccella')) {
    return BUILDER_ASSETS.flowers.moluccella;
  }
  if (normalized.includes('გერბერა') || normalized.includes('gerbera')) {
    return BUILDER_ASSETS.flowers.gerbera;
  }
  if (normalized.includes('ქრიზანთემა') || normalized.includes('chrysanthemum')) {
    return BUILDER_ASSETS.flowers.chrysanthemum;
  }
  if (normalized.includes('დიანტუსი') || normalized.includes('dianthus')) {
    return BUILDER_ASSETS.flowers.dianthus;
  }
  if (normalized.includes('კალა') || normalized.includes('calla')) {
    return BUILDER_ASSETS.flowers.calla;
  }
  if (normalized.includes('სტრელიცია') || normalized.includes('strelitzia')) {
    return BUILDER_ASSETS.flowers.strelitzia;
  }
  if (normalized.includes('ვიბურნუმი') || normalized.includes('viburnum')) {
    return BUILDER_ASSETS.flowers.viburnum;
  }
  if (normalized.includes('კრასპედია') || normalized.includes('craspedia')) {
    return BUILDER_ASSETS.flowers.craspedia;
  }
  if (normalized.includes('რუსკუსი') || normalized.includes('ruscus')) {
    return BUILDER_ASSETS.flowers.ruscus;
  }
  if (normalized.includes('ანთურიუმი') || normalized.includes('anthurium')) {
    return BUILDER_ASSETS.flowers.anthurium;
  }
  if (normalized.includes('ლიმონიუმი') || normalized.includes('limonium')) {
    return BUILDER_ASSETS.flowers.limonium;
  }
  if (normalized.includes('ამარანთუსი') || normalized.includes('amaranthus')) {
    return BUILDER_ASSETS.flowers.amaranthus;
  }
  if (normalized.includes('კურკუმა') || normalized.includes('curcuma')) {
    return BUILDER_ASSETS.flowers.curcuma;
  }
  if (normalized.includes('ჰიპერიკუმი') || normalized.includes('hypericum')) {
    return BUILDER_ASSETS.flowers.hypericum;
  }
  if (normalized.includes('ღიმილა') || normalized.includes('solidago')) {
    return BUILDER_ASSETS.flowers.solidago;
  }
  if (normalized.includes('პეონია') || normalized.includes('peony')) {
    return BUILDER_ASSETS.flowers.peony;
  }

  // Fallback to rose if no match
  return BUILDER_ASSETS.flowers.rose;
}

/**
 * Get wrapper asset by color
 */
export function getWrapperAsset(color: string, position: 'back' | 'front' = 'back') {
  const normalized = color.toLowerCase().trim();
  const wrapper = BUILDER_ASSETS.wrappers[normalized as keyof typeof BUILDER_ASSETS.wrappers];
  
  if (wrapper) {
    return wrapper[position];
  }
  
  // Fallback to cream
  return BUILDER_ASSETS.wrappers.cream[position];
}

/**
 * Get ribbon asset by color
 */
export function getRibbonAsset(color: string) {
  const normalized = color.toLowerCase().trim();
  const ribbon = BUILDER_ASSETS.ribbon[normalized as keyof typeof BUILDER_ASSETS.ribbon];
  
  if (ribbon) {
    return ribbon;
  }
  
  // Fallback to ivory
  return BUILDER_ASSETS.ribbon.ivory;
}

/**
 * Paper color CSS values
 */
export const PAPER_COLORS = {
  cream: '#F5F1ED',
  burgundy: '#8B4545',
  'light-green': '#C8D5C4',
  'light-pink': '#E8D4D0',
  yellow: '#F4E4B6',
};

/**
 * Ribbon color CSS values
 */
export const RIBBON_COLORS = {
  burgundy: '#8B4545',
  ivory: '#F5F1ED',
  'light-green': '#C8D5C4',
  white: '#FFFFFF',
};

/**
 * Flower token positioning based on quantity
 * Returns x, y, rotation, scale, zIndex for natural arrangement
 */
export function getFlowerTokenPosition(
  index: number,
  total: number,
  containerWidth: number = 300,
  containerHeight: number = 400
) {
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  
  // Different positioning strategies based on quantity
  if (total === 1) {
    return {
      x: centerX - 30,
      y: centerY - 40,
      rotation: 0,
      scale: 1,
      zIndex: 10,
    };
  }
  
  if (total === 2) {
    return {
      x: centerX + (index === 0 ? -50 : 50),
      y: centerY - 20,
      rotation: index === 0 ? -15 : 15,
      scale: 0.95,
      zIndex: 10 - index,
    };
  }
  
  if (total <= 5) {
    // Small cluster arrangement
    const angle = (index / total) * Math.PI * 1.5 - Math.PI * 0.75;
    const radius = 60;
    return {
      x: centerX + Math.cos(angle) * radius - 30,
      y: centerY + Math.sin(angle) * radius - 40,
      rotation: angle * 57.3, // Convert to degrees
      scale: 0.9 + Math.random() * 0.1,
      zIndex: 10 - Math.floor(index / 2),
    };
  }
  
  if (total <= 10) {
    // Full bouquet arrangement
    const angle = (index / total) * Math.PI * 2;
    const radius = 80 + Math.random() * 20;
    return {
      x: centerX + Math.cos(angle) * radius - 30,
      y: centerY + Math.sin(angle) * radius - 40,
      rotation: angle * 57.3 + (Math.random() - 0.5) * 30,
      scale: 0.85 + Math.random() * 0.15,
      zIndex: 10 - Math.floor(index / 3),
    };
  }
  
  // Dense bouquet (10+ stems)
  const angle = (index / total) * Math.PI * 2;
  const radius = 70 + Math.random() * 40;
  return {
    x: centerX + Math.cos(angle) * radius - 30,
    y: centerY + Math.sin(angle) * radius - 40,
    rotation: angle * 57.3 + (Math.random() - 0.5) * 45,
    scale: 0.75 + Math.random() * 0.2,
    zIndex: 5 + Math.floor(Math.random() * 10),
  };
}
