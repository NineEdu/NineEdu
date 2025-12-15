// @ts-nocheck
import { POST, GET } from "./fetch";

const certificateApis = {
  issueCertificate: ({ courseId }) => {
    return POST("/certificates", {
      body: { courseId },
    });
  },

  getMyCertificates: () => {
    return GET("/certificates/my-certificates");
  },

  getCertificateByCode: ({ code }) => {
    return GET(`/certificates/${code}`);
  },
};

export default certificateApis;
