import axios from "axios";

const errorCodes = {
    badRequest: "badRequest",
    unauthorized: "unauthorized",
    forbidden: "forbidden",
    notFound: "notFound",
    serverError: "serverError",
    unexpected: "unexpected",
    invalidCredentials: "invalidCredentials",
};

class API {
    constructor(collection) {
        this.baseUrl = process.env.REACT_APP_API_BASE_URL;
        this.collectionUrl = `${process.env.REACT_APP_API_BASE_URL}/${collection}`;
    }

    _handleError(error) {
        if (error.response.status === 400)
            return Promise.reject({
                code: errorCodes.badRequest,
                data: error.response?.data,
            });
        if (error.response.status === 401)
            return Promise.reject({
                code: errorCodes.unauthorized,
                data: error.response?.data,
            });
        if (error.response.status === 403)
            return Promise.reject({
                code: errorCodes.forbidden,
                data: error.response?.data,
            });
        if (error.response.status === 404)
            return Promise.reject({
                code: errorCodes.notFound,
                data: error.response?.data,
            });
        if (500 <= error.response.status <= 599)
            return Promise.reject({
                code: errorCodes.serverError,
                data: error.response?.data,
            });
        return Promise.reject({
            code: errorCodes.unexpected,
            data: error.response?.data,
        });
    }

    async getMulti(
        ordering = null,
        search = null,
        limit = 100,
        offset = 0,
        extra = {}
    ) {
        const p = new URLSearchParams();
        for (const key of Object.keys(extra)) {
            if (key === "categories") {
                for (const value of extra[key]) {
                    p.append(key, value);
                }
            } else {
                p.append(key, extra[key]);
            }
        }
        p.append("limit", limit);
        p.append("offset", offset);
        const params = p;
        if (ordering) params.ordering = ordering;
        if (search && search.length > 0) params.search = search;
        try {
            const response = await axios.get(`${this.collectionUrl}/`, {
                params,
            });
            return Promise.resolve(response.data);
        } catch (error) {
            return this._handleError(error);
        }
    }

    async getOne(id) {
        try {
            const response = await axios.get(`${this.collectionUrl}/${id}/`);
            return Promise.resolve(response.data);
        } catch (e) {
            return this._handleError(e);
        }
    }

    async create(data) {
        try {
            const response = await axios.post(`${this.collectionUrl}/`, data);
            return Promise.resolve(response.data);
        } catch (e) {
            return this._handleError(e);
        }
    }

    async update(id, data, partial = false) {
        try {
            let response;
            if (partial)
                response = await axios.patch(
                    `${this.collectionUrl}/${id}/`,
                    data
                );
            else
                response = await axios.put(
                    `${this.collectionUrl}/${id}/`,
                    data
                );
            return Promise.resolve(response.data);
        } catch (e) {
            return this._handleError(e);
        }
    }

    async delete(id) {
        try {
            return await axios.delete(`${this.collectionUrl}/${id}/`);
        } catch (e) {
            return this._handleError(e);
        }
    }
}

class UserAPI extends API {
    async getToken(username, password) {
        try {
            const response = await axios.post(`${this.collectionUrl}/token/`, {
                username,
                password,
            });
            return Promise.resolve(response.data);
        } catch (e) {
            return Promise.reject(errorCodes.invalidCredentials);
        }
    }

    async changePassword(id, newPassword) {
        try {
            const response = await axios.post(
                `${this.collectionUrl}/${id}/change-password/`,
                { password: newPassword }
            );
            return Promise.resolve(response.data);
        } catch (e) {
            return this._handleError(e);
        }
    }
}

const api = {
    users: new UserAPI("users"),
    products: new API("products"),
    categories: new API("categories"),
};

export default api;
export { errorCodes, API, UserAPI };
