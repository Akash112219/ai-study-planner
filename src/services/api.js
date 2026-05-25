import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Specific API functions ---

export const generateStudyPlan = async (formData) => {
  const response = await api.post('/plans/generate-plan', formData);
  return response.data;
};

export const fetchStudyPlans = async () => {
  const response = await api.get('/plans');
  return response.data;
};

export const fetchStudyRecommendations = async (studentProgress, subjectList, examDate) => {
  const response = await api.post('/plans/recommend-study', {
    student_progress: studentProgress,
    subject_list: subjectList,
    exam_date: examDate
  });
  return response.data;
};

export const fetchProgress = async () => {
  const response = await api.get('/progress');
  return response.data;
};

export const submitProgress = async (hours, subjects, days) => {
  const response = await api.post('/progress', {
    hours_per_day: hours,
    subject_count: subjects,
    days_left: days
  });
  return response.data;
};

// --- Subjects API ---

export const fetchSubjects = async () => {
  const response = await api.get('/subjects');
  return response.data;
};

export const addSubject = async (subjectData) => {
  const response = await api.post('/subjects', subjectData);
  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await api.delete(`/subjects/${id}`);
  return response.data;
};

export const fetchRecommendations = async (totalHours = 10) => {
  const response = await api.post('/subjects/recommendations', { total_study_hours: totalHours });
  return response.data;
};

// --- Questions API ---
export const fetchImportantQuestions = async (subjectName, topicList, difficulty = 'all', numQuestions = 10) => {
  const response = await api.post('/questions/important-questions', {
    subject_name: subjectName,
    topic_list: topicList,
    difficulty: difficulty,
    number_of_questions: numQuestions
  });
  return response.data;
};

export const generateMockTest = async (subjectName, topicList, difficulty = 'all', questionCount = 10, educationLevel = 'BS Program', examMode = 'Theory Only') => {
  const response = await api.post('/exam/start-test', {
    subject_name: subjectName,
    topic_list: topicList,
    difficulty: difficulty,
    question_count: questionCount,
    education_level: educationLevel,
    exam_mode: examMode
  });
  return response.data;
};

export const submitMockTest = async (sessionId, answers, correctMcqAnswers) => {
  const response = await api.post('/exam/submit-test', {
    session_id: sessionId,
    answers: answers,
    correct_mcq_answers: correctMcqAnswers
  });
  return response.data;
};

export const fetchExamAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Admin endpoints
export const fetchAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const fetchAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateAdminUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const banAdminUser = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/ban`);
  return response.data;
};

export const editAdminUser = async (userId, data) => {
  const response = await api.put(`/admin/users/${userId}`, data);
  return response.data;
};

// Site Settings
export const fetchAdminSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

export const updateAdminSettings = async (settings) => {
  const response = await api.post('/admin/settings', settings);
  return response.data;
};

export const uploadAdminSettingImage = async (key, file) => {
  const formData = new FormData();
  formData.append('key', key);
  formData.append('file', file);
  
  const response = await api.post('/admin/settings/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Issues (User side)
export const submitIssue = async (type, message) => {
  const response = await api.post('/issues/', { type, message });
  return response.data;
};

export const uploadUserProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/auth/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchUserIssues = async () => {
  const response = await api.get('/issues/');
  return response.data;
};

// Issues (Admin side)
export const fetchAdminIssues = async () => {
  const response = await api.get('/admin/issues');
  return response.data;
};

export const resolveAdminIssue = async (issueId, payload) => {
  const response = await api.put(`/admin/issues/${issueId}/resolve`, payload);
  return response.data;
};

export default api;
