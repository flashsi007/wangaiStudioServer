<template>

    <div>
        <div class="p-4 w-full">
            <a-space>
                <div class="flex items-center">
                    <label class="whitespace-nowrap mr-2">
                        订单状态：
                    </label>
                    <a-select @value="search.orderStatus" placeholder="请选择订单状态">
                        <a-option>Beijing</a-option>
                        <a-option>Shanghai</a-option>
                        <a-option>Guangzhou</a-option>
                    </a-select>

                </div>

                <div class="ml-4">
                    <label>
                        订单号：
                    </label>
                    <a-input :style="{ width: '350px' }" @value="search.orderNo" placeholder="请输入订单号" allow-clear />
                </div>

                <div>
                    <label>
                        用户名称：
                    </label>
                    <a-input :style="{ width: '350px' }" @value="search.userName" placeholder="请输入用户名" allow-clear />
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


export default {
    setup() {
        const columns = [
            { title: '用户名称', dataIndex: 'userName', ellipsis: true, tooltip: true, width: 120 },
            { title: '订单号', dataIndex: 'orderNo', ellipsis: true, tooltip: true, width: 120 },
            { title: '订单名称', dataIndex: 'orderName', ellipsis: true, tooltip: true, width: 180 },
            { title: '订单金额', dataIndex: 'orderAmount', ellipsis: true, tooltip: true, width: 100 },
            { title: '下单时间', dataIndex: 'orderTime', ellipsis: true, tooltip: true, width: 180 },
            { title: '订单状态', dataIndex: 'orderStatus', ellipsis: true, tooltip: true, width: 100 },
            { title: '操作', dataIndex: 'operation', ellipsis: true, tooltip: true, width: 100 },
        ];

        const scroll = { x: 400, y: 800 };

        const search = ref({
            userName: "",
            orderNo: "",

        });

        const submit = () => {
            console.log("search", search.value);

        }


        const dataTable = reactive([]);

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
