<template>
  <div class="form-textarea">
    <slot name="label" v-bind="{ title }">
    <label :title="title" :for="id">{{ title }}</label>
    </slot>
    <slot name="errors" v-bind="{ getErrors }">
      <span v-if="getErrors.length > 0" class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
        <li v-for="(error, index) in getErrors" :key="index">{{ error }}</li>
      </span>
    </slot>
    <slot name="input" v-bind="{ getErrors, currentValue, required }">
      <select :id="id" :name="name" v-model="currentValue" class="mt-0" :class="[getErrors.length > 0 ? 'border-red-500 border' : '']" :required="required" :disabled="disabled" :readonly="readonly">
        <option v-for="(option, index) in options" :key="index" :value="option">
          <slot name="option" v-bind="{ getErrors, option, isSelected: (currentValue === option), index, currentValue, required }">
            {{ option }}
          </slot>
        </option>
      </select>
    </slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, watch,
} from 'vue';

export default defineComponent({
  name: 'FormSelect',
  props: {
    title: String,
    name: String,
    id: String,
    modelValue: null,
    errors: Object,
    required: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    options: Array as unknown as Array<any>,
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
