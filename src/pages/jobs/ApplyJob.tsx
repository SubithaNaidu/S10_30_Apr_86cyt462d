import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      setError('Please upload your resume.');
      return;
    }

    const formData = new FormData();
    formData.append('jobId', id as string);
    formData.append('coverLetter', coverLetter);
    formData.append('resume', resume);

    try {
      setLoading(true);
      await axios.post('/api/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/applications');
    } catch (err) {
      setError('Failed to apply. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Apply for Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Cover Letter"
          rows={5}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}

export default ApplyJob;
