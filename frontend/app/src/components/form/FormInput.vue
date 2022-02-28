<template>
  <div class="form-input">
    <slot name="label" v-bind="{ title }">
    <label :title="title" :for="id">{{ title }}</label>
    </slot>
    <slot name="errors" v-bind="{ getErrors }">
      <span v-if="getErrors.length > 0" class="flex-row items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
        <li v-for="(error, index) in getErrors" :key="index">{{ error }}</li>
      </span>
    </slot>
    <slot name="input" v-bind="{ getErrors, type, currentValue, required }">
      <input :id="id" :name="name" :type="type" v-model="currentValue" class="mt-0" :class="[getErrors.length > 0 ? 'border-red-500 border' : '']" :step="step" :required="required" :disabled="disabled" :readonly="readonly"/>
    </slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, watch,
} from 'vue';

export default defineComponent({
  name: 'FormInput',
  props: {
    title: String,
    name: String,
    id: String,
    step: String,
    modelValue: null,
    type: {
      type: String,
      default: 'text',
    },
    errors: Object,
    required: Boolean,
    disabled: Boolean,
    readonly: Boolean,
  },
  setup(props, { emit }) {
    const currentValue = ref(props.modelValue);

    watch(
      () => props.modelValue,
      () => {
        currentValue.value = props.modelValue;
      },
      { immediate: true },
    );

    const getCurrentErrors = () => {
      const errors: string[] = [];
      if (!props.errors || !props.name || !props.errors[props.name]) {
        return errors;
      }
      return props.errors[props.name];
    };

    const getErrors = computed(() => getCurrentErrors());

    watch(
      () => currentValue.value,
      () => emit('update:modelValue', currentValue.value),
      { immediate: true },
    );

    return {
      currentValue,
      getErrors,
    };
  },
});
</script>
