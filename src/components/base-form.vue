<template>
  <el-form :label-position="labelPosition" :label-width="labelWidth" :model="formData">
    <el-row>
      <el-col
        v-for="(item,index) in formItemConfigGroup"
        :key="index"
        :span="item.span ? item.span : 24"
      >
        <el-form-item :label="item.label">
          <!-- 处理选择框有嵌套组件的情况 -->
          <component
            v-if="item.type === 'ElSelect'"
            :style="item.style"
            :is="item.type"
            v-bind="item.attrs"
            v-model="formData[item.prop]"
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </component>
          <!-- 处理日期框有默认template的覆盖日期不现实问题 -->
          <component
            v-else
            :style="item.style"
            :is="item.type"
            v-bind="item.attrs"
            v-model="formData[item.prop]"
          ></component>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts">
import { ELFormData, FormItemConfigGroup } from "@/component-interface";
import { defineComponent, PropType } from "vue";
export default defineComponent({
  props: {
    formItemConfigGroup: {
      type: Array as PropType<FormItemConfigGroup>,
      default: () => [],
    },
    fnArgs: [String, Number, Object],
  },
  data() {
    return {
      labelPosition: "right",
      labelWidth: "100px",
      formData: {} as ELFormData,
    };
  },
  methods: {
    setFormData(formData: ELFormData) {
      this.formData = formData;
    },
    getFormData() {
      return this.formData;
    },
  },
});
</script>
