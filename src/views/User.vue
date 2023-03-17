<template>
    <div class="userManage">
        <div class="manage-header">
            <el-button @click="showDialog" type="primary">+ 新增</el-button>
        </div>

        <el-table style="width: 100%; margin-top: 10px;" border :data="list">
            <el-table-column type="index" label="序号" width="80" align="center">
            </el-table-column>
            <el-table-column prop="user_name" label="用户名" width="width">
            </el-table-column>
            <el-table-column prop="nickname" label="用户昵称" width="width">
            </el-table-column>
            <el-table-column prop="createdAt" label="注册时间" width="width">
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
                <template slot-scope="{ row, $index }">
                    <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateUser(row)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination style="margin-top:20px;text-align: center;" :current-page="page" :total="total" :page-size="limit"
            :page-count="7" :page-sizes="[3, 5, 10]" layout="prev, pager, next, jumper,->,total"
            @current-change="getAllUsers">
        </el-pagination>

        <el-dialog top="25vh" :title="userForm.user_id ? '修改用户' : '添加用户'" :visible.sync="dialogFormVisible">
            <el-form style="width: 80%" ref="ruleForm" :model="userForm" :rules="rules">
                <el-form-item label="用户名" label-width="100px" prop="user_name">
                    <el-input autocomplete="off" v-model="userForm.user_name"></el-input>
                </el-form-item>
                <el-form-item label="昵称" label-width="100px" prop="nickname">
                    <el-input autocomplete="off" v-model="userForm.nickname"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateUser">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import moment from 'moment'
export default {
    name: 'User',
    data() {
        return {
            dialogFormVisible: false,
            page: 1,//表示当前在第几页
            limit: 7,//表示一页展示几条数据
            total: 0,//总共数据条数
            list: [],//列表展示的数据
            userForm: { //收集用户数据
                user_name: '',
                nickname: '',
                createdAt: '',
            },
            // form表单验证规则
            rules: {
                user_name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 11, max: 11, message: '长度在 11 的电话号码', trigger: 'change' }
                ],
                nickname: [
                    { required: true, message: '请输入用户昵称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
                ]
            }
        };
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        // 获取用户数据
        async getAllUsers(pager = 1) {
            this.page = pager
            let res = await this.$api.user.reqGetUsers(this.page, this.limit)
            console.log(res);
            if (res.code === 200) {
                this.total = res.total
                this.list = res.data.map(item => {
                    let createdAt = moment(item.createdAt).format('YYYY年MM月DD日')
                    return { ...item, createdAt }
                })
            }
        },

        // 点击添加用户的按钮
        showDialog() {
            // 显示对话框
            this.dialogFormVisible = true
            // 清除数据
            this.userForm = {
                user_name: '',
                nickname: '',
                createdAt: '',
            }
        },
        // 点击弹框的确定按钮（添加或修改用户）
        async addOrUpdateUser() {
            this.$refs.ruleForm.validate(async (valid) => {
                // 所有表单的字段验证通过后，才能走逻辑
                if (valid) {
                    // 先隐藏对话框
                    this.dialogFormVisible = false;
                    // 发请求（添加|修改）
                    try {
                        if (!this.userForm.user_id) {
                            let resAdd = await this.$api.user.reqAddUser(this.userForm.user_name, this.userForm.nickname)
                            if (resAdd.code === 200) {
                                // 消息弹框，添加成功
                                this.$message.success('添加用户成功!')
                                // 重新发请求渲染最新的列表，添加用户，应该停留在第一页
                                this.getAllUsers(1)
                                console.log(resAdd, '添加用户成功');
                            }

                        } else {
                            let resUpdate = await this.$api.user.reqUpdateUser(this.userForm.user_id, this.userForm.user_name, this.userForm.nickname)
                            if (resUpdate.code === 200) {
                                // 消息弹框，修改成功
                                this.$message.success('修改用户信息成功!')
                                // 重新发请求渲染最新的列表，修改，应该停留在当前页
                                this.getAllUsers(this.page)
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        // 表格中修改用户按钮的回调
        async updateUser(row) {
            console.log(row, '0000');
            // 显示对话框
            this.dialogFormVisible = true
            // 展示用户信息
            this.userForm.user_id = row.user_id
            this.userForm.user_name = row.user_name;
            this.userForm.nickname = row.nickname;
        },

        // 删除用户的操作
        deleteUser(row) {
            this.$confirm(`你确定要删除用户“${row.user_name}”吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 当用户点击确定按钮的时候触发
                // 发请求删除用户
                let res = await this.$api.user.reqDeleteUser(row.user_id)
                if (res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    // 再次获取用户列表的数据
                    this.getAllUsers(this.list.length > 1 ? this.page : this.page - 1)
                }

            }).catch(() => {
                // 当用户点击取消按钮的时候触发
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    },
    mounted() {
        this.getAllUsers()
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