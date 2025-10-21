<script lang='ts'>
  import { invalidate } from '$app/navigation'
  import Tabla from '$lib/components/generales/tabla/Tabla.svelte'
  import Boton from '$lib/components/generales/boton/boton.svelte'
  import IconoBoton from '$lib/components/generales/icono boton/iconoBoton.svelte'
  import IngredienteRow from '$lib/components/ingredientes/IngredienteRow.svelte'
  import { Ingrediente } from '$lib/models/ingrediente.svelte'
  import { ingredientesService } from '$lib/services/ingredienteService'
  import { showToast } from '$lib/toasts/toasts'

  import eye from '$lib/assets/eye.svg'
  import trash from '$lib/assets/trash.svg'
  import pencil from '$lib/assets/pencil-simple.svg'
  
  import Modal from '$lib/components/modales/Modal.svelte'
  import IngredientesForm from '$lib/components/editar-ingredientes/IngredientesForm.svelte'
  import { showError } from '$lib/utils/errorHandler.js'

  let { data } = $props()
  let ingredientes = $derived(data.ingredientes)

  let modalOpen = $state(false)
  let selectedIngrediente: Ingrediente | null = $state(null)
  let nuevoIngrediente = $state(false)

  const abrirNuevo = () => {
    selectedIngrediente = new Ingrediente()
    nuevoIngrediente = true
    modalOpen = true
  }

  const abrirEditar = (ingrediente: Ingrediente) => {
    selectedIngrediente = ingrediente
    nuevoIngrediente = false
    modalOpen = true
  }

  const cerrarModal = async () => {
    modalOpen = false
    selectedIngrediente = null
    await invalidate('ingredientes:list')
  }

  const eliminarIngrediente = async (ingrediente: Ingrediente) => {
    try {
      await ingredientesService.eliminarIngrediente(ingrediente.id!)
      showToast('Ingrediente eliminado con éxito', 'success')
      await invalidate('ingredientes:list')
    } catch (error) {
      showError('Error al eliminar el ingrediente', error)
    }
  } 

</script>

{#snippet nombreColumnas()}
  <th>Nombre</th>
  <th>Costo</th>
  <th class="cabecera-alimenticio">Grupo alimenticio</th>
  <th class="cabecera-origen">Origen</th>
  <th class="cabecera-acciones">Acciones</th>
{/snippet}

{#snippet datosFilas()}
  {#each ingredientes as ingrediente (ingrediente.id)}
    <IngredienteRow {ingrediente}>
      {#snippet columnasExtra()}
        <td>${ingrediente.costo.toFixed(2)}</td>
      {/snippet}
      {#snippet acciones()}
        <div class="iconos-acciones">
          <!-- AGREGAR ACCION PARA EL ICONO BOTON EYE -->
          <IconoBoton claseIcono="icono-ojo" onclick={() => {}}>
            <img src={eye} alt="ojo">
          </IconoBoton>
          <IconoBoton onclick={() => abrirEditar(ingrediente)} >
            <img src={pencil} alt="lapiz">
          </IconoBoton>
          <!-- AGREGAR ACCION PARA EL ICONO BOTON TRASH -->
          <IconoBoton onclick={() => {eliminarIngrediente(ingrediente)}}>
            <img src={trash} alt="tacho">
          </IconoBoton>
        </div>
      {/snippet}
    </IngredienteRow>
  {/each}
{/snippet}


<main class="ingrediente-container main-vista">
    <header class="boton-titulo">
        <h1>Ingredientes</h1>
        <Boton onclick={abrirNuevo}>Nuevo ingrediente</Boton>
    </header>
    <Tabla {nombreColumnas} {datosFilas}/>
</main> 

{#if selectedIngrediente}
  <Modal
    open={modalOpen}
    onClose={cerrarModal}
  ><IngredientesForm
    ingrediente={selectedIngrediente!}
    nuevoIngrediente={nuevoIngrediente}
    onClose={cerrarModal}
  /></Modal>
{/if}


<style>
  @import './ingredientes.css';

  th {
    padding: 1rem;
  }
</style>