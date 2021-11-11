<template>
  <el-upload class="avatar-uploader"
             ref="ElUPLOAD"
             action=""
             :http-request="httpRequest"
             :show-file-list="false">
    <img v-if="imageUrl"
         :src="imageUrl"
         class="avatar" />
    <el-icon v-else
             class="avatar-uploader-icon">
      <!-- <plus /> -->
    </el-icon>
  </el-upload>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BaseUploadC",
  data() {
    return {
      imageUrl: "",
    };
  },
  methods: {
    httpRequest(param: any) {
      this.$emit("uploadFile", param.file);
    },
    setImageUrl(id: string) {
      this.imageUrl = `/api/upload/${id}`;
    },
  },
});
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar-uploader-icon svg {
  margin-top: 74px; /* (178px - 28px) / 2 - 1px */
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
