<template>
    <div class="singerManage">
        <div class="manage-header">
            <el-button @click="showDialog" type="primary">+ 新增</el-button>
        </div>

        <!-- 歌手数据表格（5列） -->
        <el-table style="width: 100%; margin-top: 10px;" border :data="list">
            <el-table-column type="index" label="序号" width="80" align="center">
            </el-table-column>
            <el-table-column prop="singer_name" label="歌手名称" width="width">
            </el-table-column>
            <el-table-column prop="singer_details" label="歌手简介" width="width">
                <template slot-scope="{row, $index}">
                    <el-input type="textarea" resize="none" :rows="4" v-model="row.singer_details">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column prop="singer_avatar" label="歌手头像" width="width">
                <template slot-scope="{row, $index}">
                    <img :src="row.singer_avatar" style="width:100px;height:100px;" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
                <!-- 解构出来的字段一定是row和$index，不能写别的名称 -->
                <template slot-scope="{ row, $index }">
                    <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateSinger(row)">修改</el-button>
                    <!-- 点击删除按钮，弹出MessageBox 弹框组件 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSinger(row)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
        <!-- 
            分页器 
            当前处于第几页、总数据条数、每一页展示几条数据、连续页码数
            @size-change	pageSize 改变时会触发
            current-change	currentPage 改变时会触发
            prev-click	用户点击上一页按钮改变当前页后触发
            next-click	用户点击下一页按钮改变当前页后触发
        -->
        <el-pagination style="margin-top:20px;text-align: center;" :current-page="page" :total="total" :page-size="limit"
            :page-count="7" :page-sizes="[3, 5, 10]" layout="prev, pager, next, jumper,->,total"
            @current-change="getAllSingers">
        </el-pagination>


        <!-- 
            element-ui的对话框组件 <el-dialog></el-dialog>
            <el-dialog>对话框组件的属性：
                :visible.sync：控制对话框显示与隐藏用的，值是一个布尔类型  .sync父子组件数据同步
        -->
        <el-dialog top="10vh" :title="singerForm.singer_id ? '修改歌手' : '添加歌手'" :visible.sync="dialogFormVisible">
            <!--  
                element-ui的表单组件 <el-form></el-form>
                <el-form>表单组件的属性：
                :model=""：动态收集表单数据，代表的是把表单里的数据收集到哪个对象身上，将来要进行表单认证，也要用到这个属性
                label-width：设置标题内容宽度
                表单验证：Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
            -->
            <el-form style="width: 80%" ref="ruleForm" :model="singerForm" :rules="rules">
                <el-form-item label="歌手名称" label-width="100px" prop="singer_name">
                    <el-input autocomplete="off" v-model="singerForm.singer_name"></el-input>
                </el-form-item>
                <el-form-item label="歌手简介" label-width="100px" prop="singer_details">
                    <el-input type="textarea" resize="none" :rows="4" v-model="singerForm.singer_details">
                    </el-input>
                </el-form-item>
                <el-form-item label="歌手头像" label-width="100px" prop="imageUrl">
                    <!--
                                element-ui的上传组件 <el-upload></el-upload> 
                                注意1：这个小组件有样式，所以也要把样式带进来
                                注意2：收集<el-upload>组件的数据，不能使用v-model，因为它不是表单元素

                                <el-upload>上传组件的属性：
                                action：设置图片上传的地址
                                show-file-list：是否显示已上传文件列表 值为布尔类型

                                <el-upload>上传组件的事件： 
                                :on-success="handleAvatarSuccess" 图片上传成功的回调，图片上传成功就执行一次回调
                                :before-upload="beforeAvatarUpload" 图片上传之前的回调，在上传图片之前执行一次

                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                            -->
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
                <el-button type="primary" @click="addOrUpdateSinger">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: 'Singer',
    data() {
        return {
            dialogFormVisible: false,
            form: {
                singer_name: '',
                singer_details: '',
                singer_avatar: '',
            },
            page: 1,//表示当前在第几页
            limit: 3,//表示一页展示几条数据
            total: 0,//总共数据条数
            list: [],//列表展示的数据
            imageUrl: '',//上传图片的属性
            singerForm: { //收集歌手数据
                singer_name: '',
                singer_details: '',
                singer_avatar: '',
            },
            // form表单验证规则
            rules: {
                singer_name: [
                    { required: true, message: '请输入歌手的名称', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
                ],
                singer_details: [
                    { required: true, message: '请输入歌手的简介', trigger: 'blur' }
                ]

            }
        };
    },
    methods: {
        // 这个方法在歌曲管理那里还有用
        async hanleForm(e) {
            // 收集表单数据
            let singer_name = e.target[0].value
            let singer_details = e.target[1].value
            let singer_avatar = e.target[2].files[0]
            let formData = new FormData()
            console.log(singer_details, '999');
            formData.append('singer_name', singer_name)
            formData.append('singer_details', singer_details)
            formData.append('singer_avatar', singer_avatar)
            console.log(formData.get("singer_avatar"), '88888888888')
            console.log(formData.get("singer_name"), '8888999998888')
            try {
                let res = await this.$api.singer.reqAddSinger(formData)
                console.log(res, '999123456');
            } catch (error) {
                console.log(error);
            }
            // console.dir(e.target);
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        // 获取歌手数据
        async getAllSingers(pager = 1) {
            this.page = pager
            let res = await this.$api.singer.reqGetSingers(this.page, this.limit)
            if (res.code === 200) {
                this.total = res.total
                this.list = res.data
            }
        },

        // 点击添加歌手的按钮
        showDialog() {
            // 显示对话框
            this.dialogFormVisible = true
            // 清除数据
            this.singerForm = {
                singer_name: '',
                singer_details: '',
                singer_avatar: ''
            }
            this.imageUrl = ''
        },
        // 点击弹框的确定按钮（添加或修改歌手）
        async addOrUpdateSinger() {
            this.$refs.ruleForm.validate(async (valid) => {
                // 所有表单的字段验证通过后，才能走逻辑
                if (valid) {
                    // 先隐藏对话框
                    this.dialogFormVisible = false;
                    // 发请求（添加|修改）
                    // 收集表单数据
                    let formData = new FormData()
                    try {
                        if (!this.singerForm.singer_id) {
                            formData.append('singer_name', this.singerForm.singer_name)
                            formData.append('singer_details', this.singerForm.singer_details)
                            formData.append('singer_avatar', this.singerForm.singer_avatar)
                            let resAdd = await this.$api.singer.reqAddSinger(formData)
                            if (resAdd.code === 200) {
                                // 消息弹框，添加成功
                                this.$message.success('添加歌手成功!')
                                // 重新发请求渲染最新的列表，添加歌手，应该停留在第一页
                                this.getAllSingers(1)
                                console.log(resAdd, '添加歌手成功');
                            }

                        } else {
                            formData.append('singer_id', this.singerForm.singer_id)
                            formData.append('singer_name', this.singerForm.singer_name)
                            formData.append('singer_details', this.singerForm.singer_details)
                            formData.append('singer_avatar', this.singerForm.singer_avatar)
                            let resUpdate = await this.$api.singer.reqUpdateSinger(formData)
                            if (resUpdate.code === 200) {
                                // 消息弹框，修改成功
                                this.$message.success('修改歌手信息成功!')
                                // 重新发请求渲染最新的列表，修改，应该停留在当前页
                                this.getAllSingers(this.page)
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
        // 表格中修改歌手按钮的回调
        async updateSinger(row) {
            // 显示对话框
            this.dialogFormVisible = true
            // 展示歌手信息
            this.singerForm.singer_id = row.singer_id
            this.singerForm.singer_name = row.singer_name;
            this.singerForm.singer_details = row.singer_details;
            this.singerForm.singer_avatar = await this.handleImportFile(row.singer_avatar)
            this.imageUrl = row.singer_avatar;
            // console.log(this.singerForm.singer_avatar, '8888');
        },

        // 删除歌手的操作
        deleteSinger(row) {
            // 
            this.$confirm(`你确定要删除歌手“${row.singer_name}”吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 当用户点击确定按钮的时候触发
                // 发请求删除歌手
                let res = await this.$api.singer.reqDeleteSinger(row.singer_id)
                if (res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    // 再次获取歌手列表的数据
                    this.getAllSingers(this.list.length > 1 ? this.page : this.page - 1)
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
            console.log(file, '8888');
            // 收集图片数据
            this.singerForm.singer_avatar = file.raw
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
        this.getAllSingers()

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