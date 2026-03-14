import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_REWARDS, STICKER_POINTS, FULL_DAY_BONUS, STICKER_GOAL } from './data'

// ─── GitHub Sync ──────────────────────────────────────────────────────────────
// Pushes a data snapshot to GitHub whenever points change.
// Only runs when online and GitHub settings are configured.
async function syncToGitHub(state) {
  try {
    const raw = localStorage.getItem('johnny-github-settings')
    if (!raw) return

    const { token, username, repo } = JSON.parse(raw)
    if (!token || !username || !repo) return

    // Check online status
    const isOnline = window.electronAPI
      ? await window.electronAPI.checkOnline()
      : navigator.onLine

    if (!isOnline) return // Skip silently, will sync next time

    const snapshot = {
      balance: state.balance,
      todayStickers: state.todayStickers,
      stickerGoalMet: state.stickerGoalMet,
      bag: state.bag,
      history: state.history.slice(0, 20),
      kidName: 'Johnny',
      lastUpdated: new Date().toISOString(),
    }

    if (window.electronAPI) {
      window.electronAPI.pushToGitHub({ token, username, repo, data: snapshot })
    }
  } catch (err) {
    console.warn('Sync skipped:', err.message)
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────
const useStore = create(
  persist(
    (set, get) => ({
      balance: 0,
      history: [],
      bag: [],          // Purchased rewards waiting to be redeemed
      todayStickers: 0,
      stickerGoalMet: false,

      // ── Award Points ─────────────────────────────────────────────────────
      addPoints: (points, label, emoji) => {
        set((state) => ({
          balance: Math.max(0, state.balance + points),
          history: [
            {
              id: Date.now(),
              date: new Date().toISOString(),
              points,
              label,
              emoji,
            },
            ...state.history,
          ].slice(0, 200),
        }))
        // Sync after state update
        setTimeout(() => syncToGitHub(get()), 500)
      },

      // ── Stickers ──────────────────────────────────────────────────────────
      addSticker: () => {
        const state = get()
        if (state.todayStickers >= STICKER_GOAL) return

        const newCount = state.todayStickers + 1
        const goalJustMet = newCount === STICKER_GOAL && !state.stickerGoalMet

        set({ todayStickers: newCount, stickerGoalMet: goalJustMet || state.stickerGoalMet })
        get().addPoints(STICKER_POINTS, 'School Sticker ⭐', '⭐')

        if (goalJustMet) {
          // Small delay so sticker animation plays first
          setTimeout(() => {
            get().addPoints(FULL_DAY_BONUS, 'All Stickers Bonus! 🎉', '🎉')
          }, 800)
        }
      },

      removeSticker: () => {
        const state = get()
        if (state.todayStickers <= 0) return
        set({
          todayStickers: state.todayStickers - 1,
          stickerGoalMet: false,
        })
      },

      resetDay: () => {
        set({ todayStickers: 0, stickerGoalMet: false })
      },

      // ── Purchase Reward ───────────────────────────────────────────────────
      purchaseReward: (reward) => {
        const state = get()
        if (state.balance < reward.cost) return false

        const bagItem = {
          id: Date.now(),
          rewardId: reward.id,
          reward,
          purchasedAt: new Date().toISOString(),
        }

        set((s) => ({
          balance: s.balance - reward.cost,
          bag: [...s.bag, bagItem],
          history: [
            {
              id: Date.now() + 1,
              date: new Date().toISOString(),
              points: -reward.cost,
              label: `Bought: ${reward.name}`,
              emoji: reward.emoji,
            },
            ...s.history,
          ].slice(0, 200),
        }))

        setTimeout(() => syncToGitHub(get()), 500)
        return true
      },

      // ── Redeem Reward ─────────────────────────────────────────────────────
      redeemReward: (bagItemId) => {
        const state = get()
        const item = state.bag.find((i) => i.id === bagItemId)
        if (!item) return

        set((s) => ({
          bag: s.bag.filter((i) => i.id !== bagItemId),
          history: [
            {
              id: Date.now(),
              date: new Date().toISOString(),
              points: 0,
              label: `Redeemed: ${item.reward.name} 🎊`,
              emoji: item.reward.emoji,
            },
            ...s.history,
          ].slice(0, 200),
        }))

        setTimeout(() => syncToGitHub(get()), 500)
      },
    }),
    {
      name: 'johnny-rewards-store', // localStorage key
    }
  )
)

export default useStore
