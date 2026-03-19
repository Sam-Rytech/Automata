import { Request, Response } from 'express'
import { getRecipes } from '../services/recipeService'

export const recipesHandler = (req: Request, res: Response): void => {
  try {
    const recipes = getRecipes()
    res.json(recipes)
  } catch (error: any) {
    console.error('🔥 RECIPE ROUTE ERROR:', error)
    res
      .status(500)
      .json({ error: 'Failed to fetch recipes', details: error.message })
  }
}