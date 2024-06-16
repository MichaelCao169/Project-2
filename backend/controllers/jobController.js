const Job = require('../models/Job');

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('company', 'companyName email companyLogo '); 
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
};

// Create a new job
const createJob = async (req, res) => {
  const {
    title,
    position,
    experience,
    vacancies,
    employmentType,
    genderRequirement,
    salary,
    location,
    description,
    applicationDeadline,
    skills,
  } = req.body;

  try {
    const job = new Job({
      title,
      position,
      experience,
      vacancies,
      employmentType,
      genderRequirement,
      salary,
      location,
      description,
      applicationDeadline,
      skills,
      company: req.user.id 
    });

    await job.save();

    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating job', error: err.message });
  }
};

// Update a job
const updateJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findByIdAndUpdate(id, req.body, { new: true });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating job', error: err.message });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting job', error: err.message });
  }
};

// Apply for a job
const applyJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.applicants.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    job.applicants.push(req.user.id);
    await job.save();

    res.json({ message: 'Applied successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error applying for job', error: err.message });
  }
};

// Get applicants for a job
const getApplicants = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findById(id).populate('applicants', 'fullName email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job.applicants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching applicants', error: err.message });
  }
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
  getApplicants,
};