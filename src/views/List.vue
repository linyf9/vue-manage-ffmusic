<template>
    <div class="listManage">
        <div class="manage-header">
            <el-button @click="showDialog" type="primary">+ 新增</el-button>
        </div>
        <!-- 歌单数据表格（5列） list_title  list_details  list_imgpath -->
        <el-table style="width: 100%; margin-top: 10px;" border :data="list">
            <el-table-column type="index" label="序号" width="80" align="center">
            </el-table-column>
            <el-table-column prop="list_title" label="歌单标题" width="width">
            </el-table-column>
            <el-table-column prop="list_details" label="歌单简介" width="width">
                <template slot-scope="{row, $index}">
                    <el-input type="textarea" resize="none" :rows="4" v-model="row.list_details">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column prop="list_imgpath" label="歌单封面" width="width">
                <template slot-scope="{row, $index}">
                    <img :src="row.list_imgpath" style="width:100px;height:100px;" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
                <template slot-scope="{ row, $index }">
                    <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateList(row)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteList(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top:20px;text-align: center;" :current-page="page" :total="total" :page-size="limit"
            :page-count="7" :page-sizes="[3, 5, 10]" layout="prev, pager, next, jumper,->,total"
            @current-change="getAllLists">
        </el-pagination>
        <el-dialog top="10vh" :title="listForm.list_id ? '修改歌单' : '添加歌单'" :visible.sync="dialogFormVisible">
            <el-form style="width: 80%" ref="ruleForm" :model="listForm" :rules="rules">
                <el-form-item label="歌单标题" label-width="100px" prop="list_title">
                    <el-input autocomplete="off" v-model="listForm.list_title"></el-input>
                </el-form-item>
                <el-form-item label="歌单简介" label-width="100px" prop="list_details">
                    <el-input type="textarea" resize="none" :rows="4" v-model="listForm.list_details">
                    </el-input>
                </el-form-item>
                <el-form-item label="歌单封面" label-width="100px" prop="imageUrl">
                    <el-upload class="avatar-uploader" action="/api/admin/upload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" name="file" multiple>
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <!-- 当所有表单验证规则都满足的时候，才触发确定提交按钮 @click="addOrUpdateTradeMark" -->
                <el-button type="primary" @click="addOrUpdateList">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: 'List',
    data() {
        return {
            dialogFormVisible: false,
            page: 1,//表示当前在第几页
            limit: 3,//表示一页展示几条数据
            total: 0,//总共数据条数
            list: [],//列表展示的数据
            imageUrl: '',//上传图片的属性
            listForm: { //收集歌单数据
                list_title: '',
                list_details: '',
                list_imgpath: '',
            },
            // form表单验证规则
            rules: {
                list_title: [
                    { required: true, message: '请输入歌单的标题', trigger: 'blur' },
                    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'change' }
                ],
                list_details: [
                    { required: true, message: '请输入歌单的简介', trigger: 'blur' }
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
        // 获取歌单数据
        async getAllLists(pager = 1) {
            this.page = pager
            let res = await this.$api.list.reqGetList(this.page, this.limit)
            if (res.code === 200) {
                this.total = res.total
                this.list = res.data
            }
        },

        // 点击添加歌单的按钮
        showDialog() {
            // 显示对话框
            this.dialogFormVisible = true
            // 清除数据
            this.listForm = {
                list_title: '',
                list_details: '',
                list_imgpath: ''
            }
            this.imageUrl = ''
        },
        // 点击弹框的确定按钮（添加或修改品牌）
        async addOrUpdateList() {
            this.$refs.ruleForm.validate(async (valid) => {
                // 所有表单的字段验证通过后，才能走逻辑
                if (valid) {
                    // 先隐藏对话框
                    this.dialogFormVisible = false;
                    // 发请求（添加|修改）
                    // 收集表单数据
                    let formData = new FormData()
                    try {
                        if (!this.listForm.list_id) {
                            formData.append('list_title', this.listForm.list_title)
                            formData.append('list_details', this.listForm.list_details)
                            formData.append('list_imgpath', this.listForm.list_imgpath)
                            let resAdd = await this.$api.list.reqAddList(formData)
                            if (resAdd.code === 200) {
                                // 消息弹框，添加成功
                                this.$message.success('添加歌单成功!')
                                // 重新发请求渲染最新的列表，添加歌单，应该停留在第一页
                                this.getAllLists(1)
                                console.log(resAdd, '添加歌单成功');
                            }

                        } else {
                            formData.append('list_id', this.listForm.list_id)
                            formData.append('list_title', this.listForm.list_title)
                            formData.append('list_details', this.listForm.list_details)
                            formData.append('list_imgpath', this.listForm.list_imgpath)
                            let resUpdate = await this.$api.list.reqUpdateList(formData)
                            if (resUpdate.code === 200) {
                                // 消息弹框，修改成功
                                this.$message.success('修改歌单信息成功!')
                                // 重新发请求渲染最新的列表，修改，应该停留在当前页
                                this.getAllLists(this.page)
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


        // 将图片的url转为图片文件格式
        getBase64(url, callback) {
            //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
            let Img = new Image(),
                dataURL = "";
            Img.src = url + "?v=" + Math.random(); // 处理缓存,fix缓存bug,有缓存，浏览器会报错;
            Img.setAttribute("crossOrigin", "Anonymous"); // 解决控制台跨域报错的问题

            Img.onload = function () {
                //要先确保图片完整获取到，这是个异步事件
                let canvas = document.createElement("canvas"), //创建canvas元素
                    width = Img.width, //确保canvas的尺寸和图片一样
                    height = Img.height;
                canvas.width = width;
                canvas.height = height;
                canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //将图片绘制到canvas中
                dataURL = canvas.toDataURL("image/jpeg"); //转换图片为dataURL
                callback ? callback(dataURL) : null; //调用回调函数
            };
        },
        dataURLtoFile(dataurl, filename) {
            //将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
            var arr = dataurl.split(","),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime })
        },
        async handleImportFile(imgUrl) {
            let arr = imgUrl.split('/')
            let imgRes

            let file = await new Promise((resolve, reject) => {
                this.getBase64(imgUrl, (dataURL) => {
                    imgRes = this.dataURLtoFile(dataURL, arr[arr.length - 1])
                    resolve(imgRes)
                });
            })
            return file
        },

        // 表格中修改歌单按钮的回调
        async updateList(row) {
            // 显示对话框
            this.dialogFormVisible = true
            // 展示歌单信息
            this.listForm.list_id = row.list_id
            this.listForm.list_title = row.list_title;
            this.listForm.list_details = row.list_details;
            this.listForm.list_imgpath = await this.handleImportFile(row.list_imgpath)
            this.imageUrl = row.list_imgpath;
        },

        // 删除歌单的操作
        deleteList(row) {
            this.$confirm(`你确定要删除歌单“${row.list_title}”吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 当用户点击确定按钮的时候触发
                // 发请求删除歌单
                let res = await this.$api.list.reqDeleteList(row.list_id)
                if (res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    // 再次获取歌单列表的数据
                    this.getAllLists(this.list.length > 1 ? this.page : this.page - 1)
                }

            }).catch(() => {
                // 当用户点击取消按钮的时候触发
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 图片上传成功的回调
        handleAvatarSuccess(res, file) {
            // 收集图片数据
            console.log(file, '0000');
            this.listForm.list_imgpath = file.raw
            // this.listForm.imageUrl = URL.createObjectURL(file.raw);
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        // 图片上传之前的回调
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },

    },
    mounted() {
        this.getAllLists()
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