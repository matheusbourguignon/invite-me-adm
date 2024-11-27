<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import QRCode from 'qrcode.vue'; // Importando o componente QRCode
import { ref } from 'vue';

const email = ref('');
const checked = ref(false);

// Função para verificar o check-in
const verificarCheckIn = () => {
    if (email.value) {
        alert(`Check-in realizado com sucesso para o email: ${email.value}`);
    } else {
        alert("Por favor, insira um email válido.");
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Faça seu Check-in</div>
                    </div>

                    <div>
                        <!-- Campo de email -->
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <input
                          id="email1"
                          type="text"
                          placeholder="Digite o seu email"
                          class="w-full md:w-[30rem] mb-8 p-4 border border-gray-300 rounded-lg"
                          v-model="email"
                        />

                        <!-- Gerar QR Code com o email -->
                        <div v-if="email" class="mb-8 flex justify-center">
                            <QRCode :value="email" size="200" />
                        </div>

                        <!-- Botão de Verificação -->
                        <button @click="verificarCheckIn" class="btn-check-in w-full p-4 bg-primary-500 text-white rounded-lg">Verificar Check-In</button>   
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
