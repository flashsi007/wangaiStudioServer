<template>
    <div class="login-page  w-full h-screen overflow-hidden flex justify-center items-center">
        <div class="flex-1 h-screen bg-zinc-900 flex flex-col justify-between ">
            <div class="mt-10 z-20 flex items-center text-lg font-medium p-6">

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" text-white mr-2 h-6 w-6">
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
                </svg>

                <span class="text-white font-bold"> Acme Inc </span>
            </div>

            <div class="p-10">
                <p class="text-white font-bold">
                    “This library has saved me countless hours of work and helped me deliver stunning designs to my
                    clients faster than ever before.”
                </p>

                <p class="mt-4 text-white">Sofia Davis</p>
            </div>
        </div>
        <div class="flex-1 h-screen bg-white flex justify-center items-center">
            <div>
                <a-space direction="vertical" size="large">
                    <a-input :style="{ width: '420px' }" placeholder="Username" v-model="username" />
                    <a-input :style="{ width: '420px' }" placeholder="Password" v-model="password" />
                    <a-button type="primary" :style="{ width: '420px' }" @click="submit">Login</a-button>
                </a-space>

            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { login } from '@/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')

async function submit() {
    let result = await login({ userName: username.value, password: password.value })
    if (result.success) {
        window.localStorage.setItem('token', result.data.token)
        router.push('/')
        // console.log('token', result.data.token)
        // console.log('userInfo', result.data.userInfo)
    }

}


</script>