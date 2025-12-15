// @ts-nocheck

import { POST, GET, PUT, DELETE } from "./fetch";

const courseApis = {
  // -- Public APIs --

  // Backend: GET /api/courses (nhận params qua req.query)
  getCourses: ({
    keyword,
    category,
    instructorId,
    level,
    minPrice,
    maxPrice,
    sort,
    tags,
  }) => {
    const params = new URLSearchParams();

    // Các params cũ
    if (keyword) params.append("keyword", keyword);
    if (category) params.append("category", category);
    if (instructorId) params.append("instructorId", instructorId);

    // --- CÁC PARAMS MỚI CẬP NHẬT ---
    if (level) params.append("level", level);
    if (sort) params.append("sort", sort);
    if (tags) params.append("tags", tags);

    // Lưu ý: Với giá (Price), ta cần check kỹ hơn vì số 0 trong JS là false
    // Nếu chỉ viết if (minPrice) thì giá 0đ sẽ bị bỏ qua
    if (minPrice !== undefined && minPrice !== "") {
      params.append("minPrice", minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== "") {
      params.append("maxPrice", maxPrice);
    }

    return GET(`/courses?${params.toString()}`);
  },
  // Backend: GET /api/courses/:id (nhận id qua req.params)
  getCourseById: ({ courseId }) => {
    return GET(`/courses/${courseId}`);
  },

  // -- Private APIs (Admin/Instructor) --

  // Backend: POST /api/courses
  createCourse: ({ title, description, category, price, tags, thumbnail }) => {
    return POST("/courses", {
      body: { title, description, category, price, tags, thumbnail },
    });
  },

  // Backend: PUT /api/courses/:id
  // dataToUpdate bao gồm: { title, description, thumbnail, price... }
  updateCourse: ({ courseId, dataToUpdate }) => {
    return PUT(`/courses/${courseId}`, {
      body: dataToUpdate,
    });
  },

  // Backend: DELETE /api/courses/:id
  deleteCourse: ({ courseId }) => {
    return DELETE(`/courses/${courseId}`);
  },

  getManageCourses: ({ keyword, isPublished, page, limit }) => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (isPublished !== undefined) params.append("isPublished", isPublished);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);

    return GET(`/courses/manage?${params.toString()}`);
  },

  getCourseStats: () => {
    return GET(`/courses/stats`);
  },
};

export default courseApis;
