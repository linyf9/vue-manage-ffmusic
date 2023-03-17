<template>
    <div class="songManage">
        <div class="manage-header">
            <el-button @click="showDialog" type="primary">+ 新增</el-button>
        </div>
        <!-- 
                song_songname: '',
                song_imgpath: '',
                song_filepath: '',
                song_lycpath: '',
                song_rank: 每日推荐/热歌榜/中文dj榜/飙升榜,
                song_listid: '',
                song_singerid: '',
            -->
        <!-- 歌单数据表格（5列） 序号 user_name  nickname  createdAt 操作 -->
        <el-table style="width: 100%; margin-top: 10px;" border :data="list">
            <el-table-column type="index" label="序号" width="80" align="center">
            </el-table-column>
            <el-table-column prop="song_songname" label="歌曲名称" width="130">
            </el-table-column>
            <el-table-column prop="song_imgpath" label="歌曲封面" width="130">
                <template slot-scope="{row, $index}">
                    <img :src="row.song_imgpath" style="width:100px;height:100px;" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="song_filepath" label="MP3" width="width">
                <template slot-scope="{row, $index}">
                    <audio style="width: 220px; " :src="row.song_filepath" controls></audio>
                </template>
            </el-table-column>
            <el-table-column prop="song_lycpath" label="歌词" width="190">
                <template slot-scope="{row, $index}">
                    <el-input type="textarea" resize="none" :rows="4" v-model="row.song_lycpath">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column prop="song_rank" label="歌曲类型" width="80">
            </el-table-column>
            <el-table-column prop="song_listid" label="所属歌单" width="120">
                <template slot-scope="{row, $index}">
                    <span>{{ row.list_title }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="song_singerid" label="所属歌手" width="120">
                <template slot-scope="{row, $index}">
                    <span>{{ row.singer_name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="200">
                <!-- 解构出来的字段一定是row和$index，不能写别的名称 -->
                <template slot-scope="{ row, $index }">
                    <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateSong(row)">修改</el-button>
                    <!-- 点击删除按钮，弹出MessageBox 弹框组件 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSong(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination style="margin-top:20px;text-align: center;" :current-page="page" :total="total" :page-size="limit"
            :page-count="7" :page-sizes="[3, 5, 10]" layout="prev, pager, next, jumper,->,total"
            @current-change="getAllSongs">
        </el-pagination>

        <!-- 添加/修改歌曲信息的对话框 -->
        <el-dialog top="10vh" :title="songForm.song_id ? '修改歌曲' : '添加歌曲'" :visible.sync="dialogFormVisible">
            <form ref="songform" @submit.prevent="hanleForm" enctype="multipart/form-data" id="song">

                <div class="name" :style="{ 'margin-bottom': songForm.song_id && '10px' }">
                    <label for="name" class="label" style="width:100px;">歌曲名称</label>
                    <input type="text" name="song_songname" id="name" v-model="songForm.song_songname">
                </div>

                <!-- v-show="!songForm.song_id" -->
                <div class="imgFile">
                    <label for="imgFile" class="label" style="width:88px;">歌曲封面</label>
                    <input ref="song_imgpath" type="file" name="song_imgpath" id="imgFile" value="" multiple="multiple" />
                </div>

                <div class="mp3File">
                    <label for="mp3File" class="label" style="width:88px;">MP3文件</label>
                    <input ref="song_filepath" type="file" name="song_filepath" id="mp3File" value="" multiple="multiple" />
                </div>

                <div class="lycFile">
                    <label for="lycFile" class="label" style="width:88px;">歌词文件</label>
                    <input ref="song_lycpath" type="file" name="song_lycpath" id="lycFile" value="" multiple="multiple" />
                </div>



                <div class="rank">
                    <label for="rank" class="label" style="width:100px;">歌曲类型</label>
                    <select name="song_rank" id="rank" v-model="songForm.song_rank">
                        <option value="" selected></option>
                        <!-- 每日推荐/热歌榜/中文dj榜/飙升榜 -->
                        <option value="每日推荐">每日推荐</option>
                        <option value="热歌榜">热歌榜</option>
                        <option value="飙升榜">飙升榜</option>
                        <option value="中文dj榜">中文dj榜</option>
                    </select>
                </div>

                <div class="listid">
                    <label for="listid" class="label" style="width:100px;">所属歌单</label>
                    <select name="song_listid" id="listid" v-model="songForm.song_listid">
                        <option value="" selected></option>
                        <option v-for="item in lists" :key="item.list_id" :value="item.list_id">{{ item.list_title }}
                        </option>
                    </select>
                </div>

                <div class="singerid">
                    <label for="singerid" class="label" style="width:100px;">所属歌手</label>
                    <select name="song_singerid" id="singerid" v-model="songForm.song_singerid">
                        <option value="" selected></option>
                        <option v-for="item in singers" :key="item.singer_id" :value="item.singer_id">{{ item.singer_name }}
                        </option>
                    </select>

                </div>

                <div class="btn">
                    <input type="button" value="取消" id="btn1" @click="handleClose" />
                    <input type="submit" value="确定" id="btn2" />
                </div>
            </form>

        </el-dialog>

    </div>
</template>

<script>
import { reqGetAllSingers, reqGetAllLists } from '../api/song'
export default {
    name: 'Song',
    data() {
        return {
            dialogFormVisible: false,
            dialogVisible: false,
            page: 1,//表示当前在第几页
            limit: 3,//表示一页展示几条数据
            total: 0,//总共数据条数
            list: [],//列表展示的数据
            songForm: {
                song_songname: '',
                song_imgpath: '',
                song_filepath: '',
                song_lycpath: '',
                song_rank: '',
                song_listid: '',
                song_singerid: '',
            },
            singers: [],
            lists: []
        };
    },
    methods: {
        // 点击添加歌单的按钮
        async showDialog() {
            // 显示对话框
            this.dialogFormVisible = true
            let res = await reqGetAllSingers()
            this.singers = res.data
            let res1 = await reqGetAllLists()
            this.lists = res1.data
            // 清除数据
            this.songForm = {
                song_songname: '',
                song_imgpath: '',
                song_filepath: '',
                song_lycpath: '',
                song_rank: '',
                song_listid: '',
                song_singerid: '',
            }
            this.$refs.songform.reset()
        },
        // 获取所有歌曲信息
        async getAllSongs(pager = 1) {
            this.page = pager
            let res = await this.$api.song.reqGetSongs(this.page, this.limit)
            console.log(res);
            if (res.code === 200) {
                this.total = res.total
                this.list = res.data
            }
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        // 提交表单，并发请求（添加或修改歌曲信息）
        async hanleForm(e) {
            // 关闭对话框
            this.dialogFormVisible = false

            try {
                if (!this.songForm.song_songname) {
                    this.$message.warning('歌名不能为空')
                    return
                }
                // 添加歌曲
                if (!this.songForm.song_id) {
                    // 收集表单数据
                    let song_songname = e.target[0].value
                    let song_imgpath = e.target[1].files[0]
                    let song_filepath = e.target[2].files[0]
                    let song_lycpath = e.target[3].files[0]
                    let song_rank = e.target[4].value
                    let song_listid = e.target[5].value
                    let song_singerid = e.target[6].value
                    let formData = new FormData()
                    formData.append('song_songname', song_songname)
                    formData.append('song_imgpath', song_imgpath)
                    formData.append('song_filepath', song_filepath)
                    formData.append('song_lycpath', song_lycpath)
                    formData.append('song_rank', song_rank)
                    formData.append('song_listid', song_listid)
                    formData.append('song_singerid', song_singerid)
                    let resAdd = await this.$api.song.reqAddSong(formData)
                    if (resAdd.code === 200) {
                        // 消息弹框，添加成功
                        this.$message.success('添加歌曲成功!')
                        // 重新发请求渲染最新的列表，添加歌曲，应该停留在第一页
                        this.getAllSongs(1)
                        console.log(resAdd, '添加歌曲成功');
                    }
                } else {
                    // 修改歌曲
                    // 收集数据
                    let formData = new FormData()
                    formData.append('song_id', this.songForm.song_id)
                    formData.append('song_songname', this.songForm.song_songname)
                    formData.append('song_rank', this.songForm.song_rank)
                    formData.append('song_listid', this.songForm.song_listid)
                    formData.append('song_singerid', this.songForm.song_singerid)
                    let song_imgpath = e.target[1].files[0]
                    let song_filepath = e.target[2].files[0]
                    let song_lycpath = e.target[3].files[0]
                    if (song_imgpath) {
                        if (song_filepath) {
                            if (song_lycpath) { //全部都修改
                                console.log('全部都修改');
                                formData.append('song_imgpath', song_imgpath)
                                formData.append('song_filepath', song_filepath)
                                formData.append('song_lycpath', song_lycpath)
                                // 发送修改请求
                                let resUpdate = await this.$api.song.reqUpdateSong(formData)
                                if (resUpdate.code === 200) {
                                    // 消息弹框，修改成功
                                    this.$message.success('修改歌曲信息成功!')
                                    // 重新发请求渲染最新的列表，修改，应该停留在当前页
                                    this.getAllSongs(this.page)
                                }
                            } else { //只修改 封面 和 mp3
                                console.log('只修改 封面 和 mp3');
                                formData.append('song_imgpath', song_imgpath)
                                formData.append('song_filepath', song_filepath)
                                // 发送修改请求
                                let resUpdate = await this.$api.song.reqUpdateSong(formData)
                                if (resUpdate.code === 200) {
                                    // 消息弹框，修改成功
                                    this.$message.success('修改歌曲信息成功!')
                                    // 重新发请求渲染最新的列表，修改，应该停留在当前页
                                    this.getAllSongs(this.page)
                                }
                            }
                        } else if (song_lycpath) { //只修改封面 和 歌词
                            console.log('只修改封面 和 歌词');
                            formData.append('song_imgpath', song_imgpath)
                            formData.append('song_lycpath', song_lycpath)
                            // 发送修改请求
                            let resUpdate = await this.$api.song.reqUpdateSong(formData)
                            if (resUpdate.code === 200) {
                                // 消息弹框，修改成功
                                this.$message.success('修改歌曲信息成功!')
                                // 重新发请求渲染最新的列表，修改，应该停留在当前页
                                this.getAllSongs(this.page)
                            }
                        } else { // 只修改 封面
                            console.log('只修改 封面');
                            formData.append('song_imgpath', song_imgpath)
                            // 发送修改请求
                            let resUpdate = await this.$api.song.reqUpdateSong(formData)
                            if (resUpdate.code === 200) {
                                // 消息弹框，修改成功
                                this.$message.success('修改歌曲信息成功!')
                                // 重新发请求渲染最新的列表，修改，应该停留在当前页
                                this.getAllSongs(this.page)
                            }
                        }
                    } else if (song_filepath) {
                        if (song_lycpath) { // 只修改 MP3 和 歌词
                            console.log('只修改 MP3 和 歌词');
                            formData.append('song_filepath', song_filepath)
                            formData.append('song_lycpath', song_lycpath)
                            // 发送修改请求
                            let resUpdate = await this.$api.song.reqUpdateSong(formData)
                            if (resUpdate.code === 200) {
                                // 消息弹框，修改成功
                                this.$message.success('修改歌曲信息成功!')
                                // 重新发请求渲染最新的列表，修改，应该停留在当前页
                                this.getAllSongs(this.page)
                            }
                        } else {
                            console.log('只修改 MP3');
                            formData.append('song_filepath', song_filepath)
                            // 发送修改请求
                            let resUpdate = await this.$api.song.reqUpdateSong(formData)
                            if (resUpdate.code === 200) {
                                // 消息弹框，修改成功
                                this.$message.success('修改歌曲信息成功!')
                                // 重新发请求渲染最新的列表，修改，应该停留在当前页
                                this.getAllSongs(this.page)
                            }
                        }

                    } else if (song_lycpath) { // 只修改歌词
                        console.log('只修改歌词');
                        formData.append('song_lycpath', song_lycpath)
                        // 发送修改请求
                        let resUpdate = await this.$api.song.reqUpdateSong(formData)
                        if (resUpdate.code === 200) {
                            // 消息弹框，修改成功
                            this.$message.success('修改歌曲信息成功!')
                            // 重新发请求渲染最新的列表，修改，应该停留在当前页
                            this.getAllSongs(this.page)
                        }

                    } else { //3个文件都不修改
                        console.log('3个文件都不修改');
                        // 发送修改请求
                        let resUpdate = await this.$api.song.reqUpdateSong(formData)
                        if (resUpdate.code === 200) {
                            // 消息弹框，修改成功
                            this.$message.success('修改歌曲信息成功!')
                            // 重新发请求渲染最新的列表，修改，应该停留在当前页
                            this.getAllSongs(this.page)
                        }
                    }
                    // const data = {
                    //     song_id: this.songForm.song_id,
                    //     song_songname: this.songForm.song_songname,
                    //     song_rank: this.songForm.song_rank,
                    //     song_listid: this.songForm.song_listid,
                    //     song_singerid: this.songForm.song_singerid
                    // }
                    // // 发送修改请求
                    // let resUpdate = await this.$api.song.reqUpdateSong(data)
                    // if (resUpdate.code === 200) {
                    //     // 消息弹框，修改成功
                    //     this.$message.success('修改歌曲信息成功!')
                    //     // 重新发请求渲染最新的列表，修改，应该停留在当前页
                    //     this.getAllSongs(this.page)
                    // }
                }

            } catch (error) {
                this.$message.warning(error)
                console.log(error);
            }
        },
        // 表格中修改歌曲按钮的回调
        async updateSong(row) {
            // 显示对话框
            this.dialogFormVisible = true
            let res = await reqGetAllSingers()
            this.singers = res.data
            let res1 = await reqGetAllLists()
            this.lists = res1.data
            this.$refs.songform.reset()
            // 展示歌曲信息
            this.songForm.song_id = row.song_id
            this.songForm.song_songname = row.song_songname
            this.songForm.song_rank = row.song_rank
            this.songForm.song_listid = row.song_listid
            this.songForm.song_singerid = row.song_singerid
        },
        // 删除歌曲的操作
        deleteSong(row) {
            this.$confirm(`你确定要删除歌曲“${row.song_songname}”吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 当用户点击确定按钮的时候触发
                // 发请求删除歌手
                let res = await this.$api.song.reqDeleteSong(row.song_id)
                if (res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    // 再次获取歌曲列表的数据
                    this.getAllSongs(this.list.length > 1 ? this.page : this.page - 1)
                }

            }).catch(() => {
                // 当用户点击取消按钮的时候触发
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        // 取消按钮
        handleClose() {
            // 显示对话框
            this.dialogFormVisible = false
            // if (this.$refs.song_imgpath.files[0]) {
            //     this.$refs.song_imgpath.files[0] = {}
            // }
            // console.dir(this.$refs.songform);
            this.$refs.songform.reset()

        }
    },
    mounted() {
        this.getAllSongs()
    }
}
</script>

<style lang="less" scoped>
#song {
    display: flex;
    flex-direction: column;
    // padding-left: 30px;
    // position: relative;
    padding: 30px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;

    .label {
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
        box-sizing: border-box;
    }

    .name {
        display: flex;

        #name {
            -webkit-appearance: none;
            background-color: #FFF;
            background-image: none;
            border-radius: 4px;
            border: 1px solid #DCDFE6;
            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            height: 40px;
            line-height: 40px;
            outline: 0;
            padding: 0 15px;
            transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
            width: 100%;
        }
    }

    .rank {
        display: flex;

        #rank {
            -webkit-appearance: none;
            background-color: #FFF;
            background-image: none;
            border-radius: 4px;
            border: 1px solid #DCDFE6;
            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            height: 40px;
            line-height: 40px;
            outline: 0;
            padding: 0 15px;
            transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
            width: 100%;
        }
    }

    .listid {
        display: flex;
        margin: 10px 0;

        #listid {
            -webkit-appearance: none;
            background-color: #FFF;
            background-image: none;
            border-radius: 4px;
            border: 1px solid #DCDFE6;
            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            height: 40px;
            line-height: 40px;
            outline: 0;
            padding: 0 15px;
            transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
            width: 100%;

        }
    }


    .singerid {
        display: flex;
        margin-bottom: 30px;

        #singerid {
            -webkit-appearance: none;
            background-color: #FFF;
            background-image: none;
            border-radius: 4px;
            border: 1px solid #DCDFE6;
            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            height: 40px;
            line-height: 40px;
            outline: 0;
            padding: 0 15px;
            transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
            width: 100%;

        }
    }


    .imgFile {
        display: flex;
        margin: 10px 0;
        align-items: center;
    }

    .mp3File {
        display: flex;
        align-items: center;
    }

    .lycFile {
        display: flex;
        margin: 10px 0;
        align-items: center;
    }


    // #rank {
    //     width: 24%;
    //     height: 24px;
    // }

    // #listid {
    //     width: 24%;
    //     height: 24px;
    //     margin: 10px 0;
    // }

    // #singerid {
    //     width: 24%;
    //     height: 24px;
    //     margin-bottom: 30px;
    // }

    .btn {
        display: flex;
        justify-content: end;

        #btn1 {
            // display: inline-block;
            width: 73.9px;
            height: 40px;
            line-height: 1;
            white-space: nowrap;
            cursor: pointer;
            background: #FFF;
            border: 1px solid #DCDFE6;
            color: #606266;
            -webkit-appearance: none;
            text-align: center;
            box-sizing: border-box;
            outline: 0;
            margin: 0;
            transition: .1s;
            font-weight: 500;
            padding: 12px 20px;
            font-size: 14px;
            border-radius: 4px;
        }

        #btn2 {
            // position: absolute;
            // bottom: 0;
            // right: 0;
            width: 73.9px;
            height: 40px;
            margin-left: 10px;
            // display: inline-block;
            line-height: 1;
            white-space: nowrap;
            cursor: pointer;
            background: #FFF;
            border: 1px solid #DCDFE6;
            color: #606266;
            -webkit-appearance: none;
            text-align: center;
            box-sizing: border-box;
            outline: 0;
            // margin: 0;
            transition: .1s;
            font-weight: 500;
            padding: 12px 20px;
            font-size: 14px;
            border-radius: 4px;
            color: #FFF;
            background-color: #409EFF;
            border-color: #409EFF;
        }
    }

}
</style>