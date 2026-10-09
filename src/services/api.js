// Flask-ready API layer. Swap each body for fetch(`${BASE}/api/...`) when the backend exists.
import { calculateRecommendedPrice } from './pricing'
export const BASE = 'http://localhost:5000'
export const predictPrice = (input) => new Promise((res) => setTimeout(() => res(calculateRecommendedPrice(input)), 500)) // POST /api/predict-price
