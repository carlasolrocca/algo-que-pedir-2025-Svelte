import { ingredientesService } from '$lib/services/ingredienteService'
import { showError } from '$lib/utils/errorHandler'

export const load = async ({ depends }) => {
  try {
    depends('ingredientes:list')
    const ingredientes = await ingredientesService.todosLosIngredientes()
    return { ingredientes }
  } catch (error) {
    showError('Error al conectar con el servidor', error)
    return { ingredientes: [] }
  }
}
