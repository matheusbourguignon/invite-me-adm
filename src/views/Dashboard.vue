<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, watch } from 'vue';

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const chartData = ref(null);
const chartOptions = ref(null);

const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' }
]);


function setChartData() {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                type: 'bar',
                label: 'Subscriptions',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                data: [4000, 10000, 15000, 4000],
                barThickness: 32
            },
            {
                type: 'bar',
                label: 'Advertising',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
                data: [2100, 8400, 2400, 7500],
                barThickness: 32
            },
            {
                type: 'bar',
                label: 'Affiliate',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                data: [4100, 5200, 3400, 7400],
                borderRadius: {
                    topLeft: 8,
                    topRight: 8
                },
                borderSkipped: true,
                barThickness: 32
            }
        ]
    };
}

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: 'transparent',
                    borderColor: 'transparent'
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: borderColor,
                    borderColor: 'transparent',
                    drawTicks: false
                }
            }
        }
    };
}

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

watch([getPrimary, getSurface, isDarkTheme], () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Festa Recente</div>
                <DataTable :value="events" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <Column field="name" header="Name" :sortable="true" style="width: 35%"></Column>
                    <Column field="date" header="Date" :sortable="true" style="width: 35%"></Column>
                    <Column field="location" header="Location" :sortable="true" style="width: 20%"></Column>
                    <Column style="width: 15%" header="View">
                        <template #body>
                            <Button icon="pi pi-search" type="button" class="p-button-text"></Button>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="flex items-center justify-between mb-6">
                    <div class="font-semibold text-xl">Notificações</div>
                    <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu1.toggle($event)"></Button>
                        <Menu ref="menu1" :popup="true" :model="items" class="!min-w-40"></Menu>
                    </div>
                </div>

                <span class="block text-muted-color font-medium mb-4">TODAY</span>
                <ul class="p-0 mx-0 mt-0 mb-6 list-none">
                    <li class="flex items-center py-2 border-b border-surface">
                        <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                            <i class="pi pi-dollar !text-xl text-blue-500"></i>
                        </div>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal"
                            >Richard Jones
                            <span class="text-surface-700 dark:text-surface-100">has purchased a blue t-shirt for <span class="text-primary font-bold">$79.00</span></span>
                        </span>
                    </li>
                    <li class="flex items-center py-2">
                        <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                            <i class="pi pi-download !text-xl text-orange-500"></i>
                        </div>
                        <span class="text-surface-700 dark:text-surface-100 leading-normal">Your request for withdrawal of <span class="text-primary font-bold">$2500.00</span> has been initiated.</span>
                    </li>
                </ul>

                <span class="block text-muted-color font-medium mb-4">YESTERDAY</span>
                <ul class="p-0 m-0 list-none mb-6">
                    <li class="flex items-center py-2 border-b border-surface">
                        <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                            <i class="pi pi-dollar !text-xl text-blue-500"></i>
                        </div>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal"
                            >Keyser Wick
                            <span class="text-surface-700 dark:text-surface-100">has purchased a black jacket for <span class="text-primary font-bold">$59.00</span></span>
                        </span>
                    </li>
                    <li class="flex items-center py-2 border-b border-surface">
                        <div class="w-12 h-12 flex items-center justify-center bg-pink-100 dark:bg-pink-400/10 rounded-full mr-4 shrink-0">
                            <i class="pi pi-question !text-xl text-pink-500"></i>
                        </div>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal"
                            >Jane Davis
                            <span class="text-surface-700 dark:text-surface-100">has posted a new questions about your product.</span>
                        </span>
                    </li>
                </ul>

                <span class="block text-muted-color font-medium mb-4">LAST WEEK</span>
                <ul class="p-0 m-0 list-none">
                    <li class="flex items-center py-2 border-b border-surface">
                        <div class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0">
                            <i class="pi pi-arrow-up !text-xl text-green-500"></i>
                        </div>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal">Your revenue has increased by <span class="text-primary font-bold">%25</span>.</span>
                    </li>
                    <li class="flex items-center py-2 border-b border-surface">
                        <div class="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-full mr-4 shrink-0">
                            <i class="pi pi-heart !text-xl text-purple-500"></i>
                        </div>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal"><span class="text-primary font-bold">12</span> users have added your products to their wishlist.</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
