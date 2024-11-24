export const ProductService = {
    getProductsData() {
        return [
            { id: null, name: "", price: null },
            { id: null, name: "", price: null },
            { id: null, name: "", price: null },
            { id: null, name: "", price: null },
            { id: null, name: "", price: null },
            { id: null, name: "", price: null },
            { id: null, name: "", price: null },
            { id: null, name: "", price: null },
            { id: null, name: "", price: null },
            { id: null, name: "", price: null },
        ];
    },

    getProductsWithOrdersData() {
        return [
            { id: null, name: "", orders: [] },
            { id: null, name: "", orders: [] },
            { id: null, name: "", orders: [] },
        ];
    },

    getProductsMini() {
        return Promise.resolve(this.getProductsData().slice(0, 5));
    },

    getProductsSmall() {
        return Promise.resolve(this.getProductsData().slice(0, 10));
    },

    getProducts() {
        return Promise.resolve(this.getProductsData());
    },

    getProductsWithOrdersSmall() {
        return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
    },

    getProductsWithOrders() {
        return Promise.resolve(this.getProductsWithOrdersData());
    },
};
