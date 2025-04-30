import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { API_URL } from '../../config';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const jobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  jobType: z.string().min(1, 'Job type is required'),
  salary: z.string().min(1, 'Salary is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  requirements: z.string().min(20, 'Requirements must be at least 20 characters'),
  responsibilities: z.string().min(20, 'Responsibilities must be at least 20 characters'),
});

type JobFormValues = z.infer<typeof jobSchema>;

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        
        const { data } = await axios.get(`${API_URL}/api/jobs/${id}`, {
          withCredentials: true,
        });
        
        // Fill the form with existing data
        reset({
          title: data.job.title,
          company: data.job.company,
          location: data.job.location,
          jobType: data.job.jobType,
          salary: data.job.salary,
          description: data.job.description,
          requirements: data.job.requirements,
          responsibilities: data.job.responsibilities,
        });
        
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load job details. Please try again.');
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, reset]);

  const onSubmit = async (data: JobFormValues) => {
    try {
      setSubmitError(null);
      
      await axios.put(`${API_URL}/api/jobs/${id}`, data, {
        withCredentials: true,
      });
      
      navigate(`/jobs/${id}`);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to update job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <Alert type="error" message={error} />
        <div className="mt-6 text-center">
          <Button 
            variant="primary"
            onClick={() => navigate('/jobs')}
          >
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Job Posting</h1>
          
          {submitError && (
            <Alert 
              type="error" 
              message={submitError} 
              onClose={() => setSubmitError(null)} 
            />
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Job Title"
                id="title"
                placeholder="e.g. Senior Software Engineer"
                {...register('title')}
                error={errors.title?.message}
              />
              
              <Input
                label="Company"
                id="company"
                placeholder="e.g. Acme Inc."
                {...register('company')}
                error={errors.company?.message}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Location"
                id="location"
                placeholder="e.g. New York, NY or Remote"
                {...register('location')}
                error={errors.location?.message}
              />
              
              <Select
                label="Job Type"
                id="jobType"
                {...register('jobType')}
                options={[
                  { value: 'Full-time', label: 'Full-time' },
                  { value: 'Part-time', label: 'Part-time' },
                  { value: 'Contract', label: 'Contract' },
                  { value: 'Internship', label: 'Internship' },
                  { value: 'Remote', label: 'Remote' },
                ]}
                error={errors.jobType?.message}
              />
            </div>
            
            <Input
              label="Salary Range"
              id="salary"
              placeholder="e.g. $80,000 - $100,000 or Competitive"
              {...register('salary')}
              error={errors.salary?.message}
            />
            
            <TextArea
              label="Job Description"
              id="description"
              placeholder="Provide a detailed description of the job..."
              rows={5}
              {...register('description')}
              error={errors.description?.message}
            />
            
            <TextArea
              label="Requirements"
              id="requirements"
              placeholder="List the key qualifications and skills required..."
              rows={5}
              {...register('requirements')}
              error={errors.requirements?.message}
            />
            
            <TextArea
              label="Responsibilities"
              id="responsibilities"
              placeholder="Outline the main duties and responsibilities..."
              rows={5}
              {...register('responsibilities')}
              error={errors.responsibilities?.message}
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/jobs/${id}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
              >
                Update Job
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob;