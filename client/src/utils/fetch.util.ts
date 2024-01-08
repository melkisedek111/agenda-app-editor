export const fetchApi = (endpoint: string, props: any) => {
    const baseURL = import.meta.env.VITE_API_URL + endpoint;

    return fetch(baseURL, {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        }, 
        credentials: 'include',
        ...props
    })
}