<template>
  <div>
    <el-card shadow="always" style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card shadow="always">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table style="width: 100%;margin: 20px 0" border :data="attrInfoList">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
        <el-table-column prop="" label="属性值列表">
          <template slot-scope="{row,$index}">
            <el-tag style="margin: 0 10px 5px 0;" v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id">
              {{ attrValue.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180">
          <template slot-scope="{row,$index}">
            <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrInfoList: []
    }
  },
  methods: {
    getCategoryId({id, level}) {
      this.attrInfoList = []
      switch (level) {
        case 1:
          this.category1Id = id
          this.category2Id = ''
          this.category3Id = ''
          break
        case 2:
          this.category2Id = id
          this.category3Id = ''
          break
        case 3:
          this.category3Id = id
          this.getAttrInfoList()
      }
    },
    async getAttrInfoList() {
      const {category1Id, category2Id, category3Id} = this
      let result = await this.$api.attr.reqAttrInfoList(category1Id, category2Id, category3Id)
      if (result.code == 200) {
        this.attrInfoList = result.data
      }
    },
  }
}
</script>

<style scoped>

</style>
