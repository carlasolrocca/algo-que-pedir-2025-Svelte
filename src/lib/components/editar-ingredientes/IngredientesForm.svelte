<script lang="ts">
  import { Ingrediente } from '$lib/models/ingrediente.svelte'
  import { GrupoAlimenticio } from '$lib/models/ingrediente.svelte'
  import Boton from '../generales/boton/boton.svelte'
  import Input from '$lib/components/generales/input/input.svelte'
  import Switch from '$lib/components/generales/switch/switch.svelte'
  import Textarea from '$lib/components/generales/input/textarea.svelte'
  import Validador from '$lib/utils/validador.svelte'
  import { showToast } from '$lib/toasts/toasts'

  import './ingredientes-form.css'
  import { ingredientesService } from '$lib/services/ingredienteService'
  import { showError } from '$lib/utils/errorHandler'
  import { invalidate } from '$app/navigation'
  interface Props {
    ingrediente: Ingrediente
    onClose: () => void
    nuevoIngrediente: boolean
  }

  let { ingrediente, onClose, nuevoIngrediente }: Props = $props()

  const grupoOptions = [
    { value: GrupoAlimenticio.CEREALES_Y_TUBERCULOS, label: 'Cereales y tubérculos' },
    { value: GrupoAlimenticio.AZUCARES_Y_DULCES, label: 'Azúcares y dulces' },
    { value: GrupoAlimenticio.LACTEOS, label: 'Lácteos' },
    { value: GrupoAlimenticio.FRUTAS_Y_VERDURAS, label: 'Frutas y verduras' },
    { value: GrupoAlimenticio.GRASAS_Y_ACEITES, label: 'Grasas y aceites' },
    { value: GrupoAlimenticio.PROTEINAS, label: 'Proteínas' }
  ]

  const guardarCambios = async () => {
    try {
      ingrediente.validarIngrediente()
      if(!ingrediente.invalid()){
        if(nuevoIngrediente){
          await ingredientesService.crearIngrediente(ingrediente)
          showToast('Ingrediente creado con éxito', 'success')
        } else {
          await ingredientesService.actualizarIngrediente(ingrediente)
          showToast('Ingrediente actualizado con éxito', 'success')
        }
      }
      await invalidate('ingredients:list')
    } catch (error) {
      showError('Error al actualizar el ingrediente', error)
    }
  }

  const descartarCambios = () => {
    onClose()
  }

  const titulo = nuevoIngrediente ? 'Nuevo Ingrediente' : 'Editar Ingrediente'
</script>

<main class="vista-edicion-ingrediente main-vista">
  <h1 class="titulo-edicion">{titulo}</h1>

  <section class="container-edicion contenedor-general">
    <article class="item-input-edicion">
      <form>
        <Input
          nombre_label="Nombre del ingrediente"
          type="text"
          bind:value={ingrediente.nombre}
          id="nombre-ingrediente"
          placeholder="Ingresa el nombre del ingrediente..."
          required={true}
        />
        <Validador elemento={ingrediente} atributo="nombre" />

        <Input
          nombre_label="Costo"
          type="number"
          bind:value={ingrediente.costo}
          id="costo-ingrediente"
          placeholder="Ingresa su costo..."
          required={true}
        />
        <Validador elemento={ingrediente} atributo="costo" />

        <Textarea
          nombre_label="Grupo Alimenticio"
          bind:value={ingrediente.grupo}
          id="grupo-alimenticio"
          select={true}
          options={[{ value: '', label: 'Selecciona una opción' }, ...grupoOptions]}
        />
        <Validador elemento={ingrediente} atributo="grupo" />

        <article class="origen-toggle">
          <Switch
            id="origen-toggle"
            titulo="Origen animal"
            bind:checked={ingrediente.esAnimal}
          />
        </article>
      </form>
      <div class="container-botones-edicion">
        <Boton tipo="primario" data-testid="btnGuardar" class="boton-primario boton-guardar"
        onclick={guardarCambios}>Guardar Cambios</Boton>
        <Boton tipo="secundario" data-testid="btnDescartar" class="boton-secundario boton-descartar" 
        onclick={descartarCambios}>Descartar Cambios</Boton>
      </div>
    </article>
  </section>
</main>
