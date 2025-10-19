<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { Snippet } from 'svelte'

  let { open, onClose, content}: {
    open: boolean
    onClose: () => void
    content?: Snippet
  } = $props()

  import './modal.css'

  // Cerrar modal con tecla "Esc"
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      onClose()
    }
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown)
    }
  })

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  const handleModalKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      onClose()
    }
  }

</script>

{#if open}
  <div class="overlay" onclick={() => onClose()} role="button" tabindex="0" onkeydown={handleModalKeyDown}>
      <div class="modal" onclick={(event) => event.stopPropagation()} role="button" tabindex="0" onkeydown={(event) => event.stopPropagation()}>
      <button class="close-btn" onclick={onClose}>Cerrar</button>

      {#if content}
        {@render content()}
      {/if}
    </div>
  </div>
{/if}
