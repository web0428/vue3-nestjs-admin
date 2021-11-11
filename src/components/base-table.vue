<template>
  <el-container class="crud-page">
    <el-aside v-if="isShowAside" width="200px">Aside</el-aside>
    <el-container>
      <el-main>
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%"
        >
          <el-table-column v-if="isShowSelection" type="selection" width="55" />
          <el-table-column
            v-for="(config,index) in tableColumnConfig"
            :key="index"
            :prop="config.prop"
            :label="config.label"
          >
            <template #default="scope">{{ getTableColumnContent(scope, config) }}</template>
          </el-table-column>
          <slot name="operation"></slot>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { TableColumnConfig, ColumnConfig } from "@/component-interface";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "BaseTable",
  props: {
    isShowAside: Boolean,
    isShowSelection: Boolean,
    tableColumnConfig: {
      type: Array as PropType<TableColumnConfig>,
      default: () => [],
    },
  },
  data() {
    return {
      tableData: [],
    };
  },
  methods: {
    setTableData(tableData: []) {
      this.tableData = tableData;
    },
    handleSelectionChange(val: []) {
      this.$emit("handleSelectionChange", val);
    },
    getTableColumnContent(scope: any, config: ColumnConfig) {
      return config.translate
        ? config.translate(scope.row[config.prop])
        : scope.row[config.prop];
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
