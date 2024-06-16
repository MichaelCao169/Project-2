const express = require('express');
const router = express.Router();
const { getJobs, createJob, updateJob, deleteJob, applyJob, getApplicants } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// Lấy danh sách công việc
router.get('/', getJobs);

// Đăng công việc mới
router.post('/', authMiddleware('company'), createJob);

// Cập nhật công việc
router.patch('/:id', authMiddleware('company'), updateJob);

// Xóa công việc
router.delete('/:id', authMiddleware('company'), deleteJob);

// Ứng viên ứng tuyển vào công việc
router.post('/:id/apply', authMiddleware('user'), applyJob);

// Lấy danh sách ứng viên
router.get('/:id/applicants', authMiddleware('company'), getApplicants);

module.exports = router;