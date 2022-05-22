<template>
  <div>
    <!--添加-->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" @click="showDialog">添加</el-button>

    <!--表格-->
    <el-table style="width: 100%;" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌Logo" width="width">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" :alt="row.tmName" style="height: 100px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateDialog(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteBox(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页器-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin: 20px;text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :pager-count="7"
      layout="prev, pager, next, jumper ,->,total, sizes"
      :total="total">
    </el-pagination>

    <!--弹出对话框-->
    <el-dialog :title="trademarkInfo.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!--表单-->
      <el-form style="width: 80%" :model="trademarkInfo" ref="ruleForm" :rules="trademarkInfoRules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="trademarkInfo.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
          <!--上传图片-->
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="trademarkInfo.logoUrl" :src="trademarkInfo.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      //显示对话框
      dialogFormVisible: false,
      trademarkInfo: {
        tmName: '',
        logoUrl: ''
      },
      trademarkInfoRules: {
        tmName: [
          {required: true, message: '请输入品牌名称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change'}
        ],
        logoUrl: [
          {required: true, message: '请上传品牌图片'}
        ]
      }
    }
  },
  methods: {
    async getPagelist() {
      let {page, limit} = this
      let result = await this.$api.trademark.reqTrademark(page, limit)
      if (result.code == 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    handleCurrentChange(page) {
      this.page = page
      this.getPagelist()
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getPagelist()
    },
    showDialog() {
      this.trademarkInfo = {tmName: '', logoUrl: ''}
      this.dialogFormVisible = true
    },
    updateDialog(row) {
      //注意要拷贝list（浅）
      this.trademarkInfo = {...row}
      this.dialogFormVisible = true
    },
    //上传图片回调
    handleAvatarSuccess(res, file) {
      this.trademarkInfo.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    submitForm() {
      this.$refs.ruleForm.validate((success) => {
        if (success) this.updateTrademark()
        else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    //添加/修改回调
    async updateTrademark() {
      this.dialogFormVisible = false
      let result = await this.$api.trademark.reqUpdateTrademark(this.trademarkInfo)
      if (result.code == 200) {
        this.$message({
          message: this.trademarkInfo.id ? '修改品牌成功' : '添加品牌成功',
          type: "success"
        })
        this.getPagelist()
      }
    },
    deleteBox(row) {
      this.$confirm(`确定删除“${row.tmName}”`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await this.$api.trademark.reqDeleteTrademark(row.id)
        if (result.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //删除全部时回退一页
          if (this.list.length == 1) this.page -= 1
          this.getPagelist()
        } else {
          return new Promise.reject(new Error('删除失败！'))
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  mounted() {
    this.getPagelist()
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
