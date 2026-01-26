export function createAuthFormStub(payload) {
  return {
    props: ['title', 'submitLabel', 'showConfirm'],
    emits: ['submit'],
    template: `
      <button
        data-test="submit"
        @click="$emit('submit', payload)"
      >
        submit
      </button>
    `,
    setup() {
      return { payload };
    },
  };
}