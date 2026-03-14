// ─── Rewards ────────────────────────────────────────────────────────────────
export const DEFAULT_REWARDS = [
  { id: 'lollipop',      name: 'Lollipop',                          emoji: '🍭', cost: 15  },
  { id: 'cookies',       name: 'Cookies',                           emoji: '🍪', cost: 30  },
  { id: 'italian_ice',   name: 'Italian Ice',                       emoji: '🧊', cost: 40  },
  { id: 'ice_cream',     name: 'Ice Cream',                         emoji: '🍦', cost: 50  },
  { id: 'adventure',     name: 'Adventure Walk',                    emoji: '🌳', cost: 35  },
  { id: 'boardgame',     name: 'Board Game',                        emoji: '🎲', cost: 45  },
  { id: 'movie_night',   name: 'Movie Night',                       emoji: '🎬', cost: 75  },
  { id: 'playground',    name: 'Playground',                        emoji: '🛝', cost: 60  },
  { id: 'pizza_night',   name: 'Pizza Night',                       emoji: '🍕', cost: 100 },
  { id: 'ready_set_play',name: 'Ready Set Play',                    emoji: '🎉', cost: 150 },
  { id: 'momma_boss',    name: 'Momma Does What You Say (15 min)',  emoji: '👩‍❤️‍👨', cost: 80  },
  { id: 'dadda_boss',    name: 'Dadda Does What You Say (15 min)',  emoji: '🦸', cost: 80  },
]

// ─── Earning Categories ──────────────────────────────────────────────────────
export const CHORES = [
  { id: 'brush_teeth',  label: 'Brushing Teeth',    emoji: '🦷', points: 5  },
  { id: 'laundry',      label: 'Picking Up Laundry', emoji: '👕', points: 8  },
  { id: 'playroom',     label: 'Cleaning Playroom',  emoji: '🧸', points: 15 },
  { id: 'set_table',    label: 'Setting the Table',  emoji: '🍽️', points: 8  },
  { id: 'feed_pepper',  label: 'Feeding Pepper 🐕',  emoji: '🐾', points: 10 },
]

export const GOOD_BEHAVIOR = [
  { id: 'listening',      label: 'Listening to Parents', emoji: '👂', points: 10 },
  { id: 'eating',         label: 'Ate All His Food',     emoji: '🥗', points: 10 },
  { id: 'patience',       label: 'Patience',             emoji: '⏳', points: 10 },
  { id: 'indoor_voices',  label: 'Indoor Voices',        emoji: '🤫', points: 5  },
  { id: 'focusing',       label: 'Focusing on Tasks',    emoji: '🎯', points: 10 },
]

export const LESSONS = [
  { id: 'lesson_learned', label: 'Lesson Learned',   emoji: '📚', points: 20 },
  { id: 'tried_something', label: 'Tried Something New', emoji: '💪', points: 15 },
]

// ─── Negative Behaviors (minimal deductions) ────────────────────────────────
export const NEGATIVE_BEHAVIORS = [
  { id: 'not_listening', label: 'Not Listening',     emoji: '😤', points: -3 },
  { id: 'loud_voices',   label: 'Too Loud Inside',   emoji: '📢', points: -2 },
  { id: 'not_eating',    label: 'Not Eating Food',   emoji: '🙅', points: -3 },
  { id: 'hitting',       label: 'Hitting',           emoji: '✋', points: -5 },
  { id: 'tantrum',       label: 'Tantrum',           emoji: '😭', points: -3 },
]

// ─── Sticker Config ──────────────────────────────────────────────────────────
export const STICKER_GOAL   = 5   // stickers needed per day
export const STICKER_POINTS = 5   // points per sticker
export const FULL_DAY_BONUS = 15  // bonus when all stickers earned

// ─── PIN ─────────────────────────────────────────────────────────────────────
export const PARENT_PIN = '0918'
