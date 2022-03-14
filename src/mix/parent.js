export default {
  created() {
    // eslint-disable-next-line max-len
    const getParent = ($component) => (($component.abstract || $component.$el === $component.$children[0].$el) ? getParent($component.$parent) : $component);
    this.$parent = getParent(this.$parent);
  },
};
