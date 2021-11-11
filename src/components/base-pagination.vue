<template>
  <el-pagination class="pagination"
                 v-model:currentPage="currentPage"
                 :page-sizes="[10, 20, 30, 40]"
                 :page-size="pageSize"
                 layout="total, sizes, prev, pager, next, jumper"
                 :total="totalPage"
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange">
  </el-pagination>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BasePagination",
  props: {
    totalPage: Number,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
    };
  },
  methods: {
    handleSizeChange(size: number) {
      this.$emit("handleSizeChange", size);
    },
    handleCurrentChange(page: number) {
      this.$emit("handleCurrentChange", page);
    },
  },
});
</script>

<style lang="scss" scoped>
.pagination {
  float: right;
}
</style>
