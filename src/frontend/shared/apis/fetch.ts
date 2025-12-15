//@ts-nocheck

import Cookies from "js-cookie";

// 1. Cấu hình Base URL (Có fallback giống code axios của bạn)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

// 2. Helper tạo URL chuẩn
const generateApiUrl = (endpoint) => {
  // Xử lý việc thừa/thiếu dấu / giữa base và endpoint
  const cleanBase = BASE_URL.replace(/\/$/, "");
  const cleanEndpoint = endpoint.replace(/^\//, "");
  return `${cleanBase}/${cleanEndpoint}`;
};

// 3. Helper lấy Headers (Giống Interceptor Request)
// Tự động lấy token từ cookie nhét vào
const getAPIHeaders = (customHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  // Logic lấy Token từ Cookie (giống axios interceptor)
  const token = Cookies.get("token"); // Hoặc 'accessToken' tùy tên bạn lưu
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// 4. Core Request (Hàm lõi)
const makeRequest = async (method, endpoint, options = {}) => {
  const { body, params, customHeaders, ...otherOptions } = options;
  let url = generateApiUrl(endpoint);

  // Xử lý Query Params cho GET (Ví dụ: ?keyword=React&page=1)
  if (params) {
    // Lọc bỏ các giá trị null/undefined/rỗng
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, v]) => v !== null && v !== undefined && v !== ""
      )
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Cấu hình fetch
  const config = {
    method,
    headers: getAPIHeaders(customHeaders),
    credentials: "include", // Giữ cookie httpOnly nếu có
    cache: "no-store", // Mặc định không cache (tùy chỉnh nếu cần)
    ...otherOptions,
  };

  // Xử lý Body cho POST/PUT
  if (body) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
    // Nếu là FormData thì để browser tự set Content-Type (multipart/form-data)
    if (body instanceof FormData) {
      delete config.headers["Content-Type"];
    }
  }

  // Gọi API
  const response = await fetch(url, config);
  return response;
};

// 5. Response Handler (Giống Interceptor Response)
const handleResponse = async (response) => {
  // Nếu status là 204 (No Content) -> trả về null
  if (response.status === 204) return null;

  const data = await response.json();

  // Nếu status không thuộc nhóm 2xx -> Ném lỗi
  if (!response.ok) {
    // Trả về đúng cấu trúc lỗi backend giống axios
    // error.response?.data
    throw data || new Error("Something went wrong");
  }

  return data;
};

// --- EXPORT CÁC METHOD ---

export const GET = async (endpoint, options = {}) => {
  // options ở đây chứa { params: { keyword: ... } }
  const response = await makeRequest("GET", endpoint, options);
  return handleResponse(response);
};

export const POST = async (endpoint, options = {}) => {
  // options ở đây chứa { body: { ... } }
  const response = await makeRequest("POST", endpoint, options);
  return handleResponse(response);
};

export const PUT = async (endpoint, options = {}) => {
  const response = await makeRequest("PUT", endpoint, options);
  return handleResponse(response);
};

export const DELETE = async (endpoint, options = {}) => {
  const response = await makeRequest("DELETE", endpoint, options);
  return handleResponse(response);
};

// Download File (Trả về Blob)
export const DOWNLOAD = async (endpoint, options = {}) => {
  const response = await makeRequest("GET", endpoint, options);
  if (!response.ok) throw new Error("Download failed");
  return response.blob();
};
