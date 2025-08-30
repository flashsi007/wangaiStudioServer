<template>

    <div>
        <div class="p-4 w-full">
            <a-space>
                <div class="ml-4">
                    <label>
                        邮件：
                    </label>
                    <a-input :style="{ width: '350px' }" v-model="search.email" placeholder="请输入邮箱" allow-clear />
                </div>

                <div>
                    <label>
                        用户名称：
                    </label>
                    <a-input :style="{ width: '350px' }" v-model="search.userName" placeholder="请输入用户名" allow-clear />
                </div>

                <div>
                    <a-button type="primary" class="ml-4" @click="submit">搜索</a-button>
                </div>
            </a-space>
        </div>

        <div class="table-container p-8">
            <a-table :columns="columns" :data="dataTable" :scroll="scroll" :scrollbar="true" />
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { getUserList } from '@/api';
import { onMounted } from 'vue';

export default {
    setup() {
        const columns = [
            { title: '用户名称', dataIndex: 'userName', ellipsis: true, tooltip: true, width: 120 },
            { title: '邮件', dataIndex: 'email', ellipsis: true, tooltip: true, width: 120 },
            { title: '付费token数量', dataIndex: 'payTokenNumder', ellipsis: true, tooltip: true, width: 180 },
            { title: 'IP地址', dataIndex: 'lastLoginIP', ellipsis: true, tooltip: true, width: 100 },
        ];

        const scroll = { x: 400, y: 800 };
        const dataTable = ref([]);
        const search = reactive({
            email: "",
            userName: "",
        })

        const submit = () => {
            console.log("search", search.email, search.userName);
            getUsers()
        }

        const getUsers = async () => {
            const result = await getUserList(search.email, search.userName)
            if (result.success) {
                dataTable.value = result.data;
            }

        }




        onMounted(() => {
            getUsers()
        })

        return {
            submit,
            scroll,
            search,
            columns,
            dataTable,
        }
    },
}
</script>
