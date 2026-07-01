export const MODEL_BASE = "/birthday-1/models";

export const MODELS = {
  cat: `${MODEL_BASE}/an_animated_cat.glb`,
  catWalk: `${MODEL_BASE}/cat_walk.glb`,
  balloonSingle: `${MODEL_BASE}/balloon_00_free.glb`,
  candle: `${MODEL_BASE}/birthday_candle.glb`,
  balloons: `${MODEL_BASE}/colorful_balloons.glb`,
  hat: `${MODEL_BASE}/colorful_cartoon_party_hat_3d_model.glb`,
  confetti: `${MODEL_BASE}/confetti.glb`,
  fire: `${MODEL_BASE}/fire.glb`,
  firework: `${MODEL_BASE}/firework.glb`,
  stars: `${MODEL_BASE}/fnaf_-_ceiling_stars_deco.glb`,
  giftBox: `${MODEL_BASE}/gift_box.glb`,
  lootBox: `${MODEL_BASE}/gift_loot_box_thing_wip.glb`,
  cake: `${MODEL_BASE}/strawberry_cake.glb`,
  matchstick: `${MODEL_BASE}/matchstick_from_poly_by_google.glb`,
  matchbox: `${MODEL_BASE}/safety_matches_low_poly_pixel_art.glb`,
  gramophone: `${MODEL_BASE}/old_gramophone.glb`,
  lightSwitch: `${MODEL_BASE}/modern_light_switches.glb`,
  magicWand: `${MODEL_BASE}/magic_wand.glb`,
} as const;

export const FIRST_PAINT_MODELS = [MODELS.lightSwitch, MODELS.stars, MODELS.gramophone, MODELS.cake] as const;

export const DEFAULT_BIRTHDAY_MUSIC = "/birthday-1/music/link_nhac_nen_chung.m4a";
export const TOUCH_SOUND = "/assets/vfx/touch.mp3";
export const MAGIC_WAND_SOUND = "/assets/vfx/you-found-bojuka_2.mp3";
