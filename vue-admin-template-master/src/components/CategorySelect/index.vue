<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="list1Change">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="!cForm.category1Id" placeholder="请选择" v-model="cForm.category2Id" @change="list2Change">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="!cForm.category2Id" placeholder="请选择" v-model="cForm.category3Id" @change="list3Change">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "CategorySelect",
  mounted() {
    this.getCategory1()
  },
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      attrInfoList: []
    }
  },
  methods: {
    async getCategory1() {
      let result = await this.$api.attr.reqCategory1()
      if (result.code == 200) {
        this.list1 = result.data
      }
    },
    async list1Change() {
      const {category1Id} = this.cForm
      this.$emit('getCategoryId', {id: category1Id, level: 1})
      let result = await this.$api.attr.reqCategory2(category1Id)
      if (result.code == 200) {
        this.list2 = result.data
        this.cForm.category2Id = ''
        this.cForm.category3Id = ''
      }
    },
    async list2Change() {
      const {category2Id} = this.cForm
      this.$emit('getCategoryId', {id: category2Id, level: 2})
      let result = await this.$api.attr.reqCategory3(category2Id)
      if (result.code == 200) {
        this.list3 = result.data
        this.cForm.category3Id = ''
      }
    },
    list3Change() {
      const {category3Id} = this.cForm
      this.$emit('getCategoryId', {id: category3Id, level: 3})
    },
  }

}
</script>

<style scoped>

</style>
