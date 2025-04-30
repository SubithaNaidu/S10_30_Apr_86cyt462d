import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { API_URL } from '../../config';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

interface Profile {
  _id: string;
  user: string;
  bio: string;
  skills: string[];
  location: string;
  website: string;
  phone: string;
  resumeUrl: string;
  experience: string;
  education: string;
}

const profileSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(500, 'Bio cannot exceed 500 characters'),
  skills: z.string().min(3, 'Please enter at least one skill'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  website: z.string().url('Please enter a valid URL').or(z.string().length(0)),
  phone: z.string().min(10, 'Please enter a valid phone number').max(15, 'Phone number is too long').or(z.string().length(0)),
  resumeUrl: z.string().url('Please enter a valid URL for your resume').or(z.string().length(0)),
  experience: z.string().min(10, 'Experience must be at least 10 characters').max(2000, 'Experience cannot exceed 2000 characters'),
  education: z.string().min(10, 'Education must be at least 10 characters').max(2000, 'Education cannot exceed 2000 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: '',
      skills: '',
      location: '',
      website: '',
      phone: '',
      resumeUrl: '',
      experience: '',
      education: '',
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        const { data } = await axios.get(`${API_URL}/api/profile/me`, {
          withCredentials: true,
        });
        
        if (data.profile) {
          setProfile(data.profile);
          
          // Convert skills array to comma-separated string for the form
          const skillsString = data.profile.skills.join(', ');
          
          reset({
            bio: data.profile.bio || '',
            skills: skillsString || '',
            location: data.profile.location || '',
            website: data.profile.website || '',
            phone: data.profile.phone || '',
            resumeUrl: data.profile.resumeUrl || '',
            experience: data.profile.experience || '',
            education: data.profile.education || '',
          });
        }
        
        setLoading(false);
      } catch (err: any) {
        if (err.response?.status !== 404) {
          // Only show error if it's not a 404 (no profile yet)
          setError(err.response?.data?.message || 'Failed to load profile. Please try again.');
        }
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setError(null);
      setSuccess(null);
      
      // Convert skills string to array
      const skillsArray = data.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      const profileData = {
        ...data,
        skills: skillsArray,
      };
      
      let response;
      
      if (profile) {
        // Update existing profile
        response = await axios.put(`${API_URL}/api/profile`, profileData, {
          withCredentials: true,
        });
      } else {
        // Create new profile
        response = await axios.post(`${API_URL}/api/profile`, profileData, {
          withCredentials: true,
        });
      }
      
      setProfile(response.data.profile);
      setSuccess('Profile saved successfully!');
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
      
      // Scroll to top to show error message
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {profile ? 'Update Your Profile' : 'Create Your Profile'}
          </h1>
          
          {error && (
            <Alert 
              type="error" 
              message={error} 
              onClose={() => setError(null)} 
            />
          )}
          
          {success && (
            <Alert 
              type="success" 
              message={success} 
              onClose={() => setSuccess(null)} 
            />
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <TextArea
              label="Bio"
              id="bio"
              placeholder="Tell us about yourself..."
              rows={3}
              {...register('bio')}
              error={errors.bio?.message}
              helperText="A brief introduction about yourself and your professional background"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Location"
                id="location"
                placeholder="e.g. New York, NY"
                {...register('location')}
                error={errors.location?.message}
              />
              
              <Input
                label="Skills"
                id="skills"
                placeholder="e.g. JavaScript, React, Node.js"
                {...register('skills')}
                error={errors.skills?.message}
                helperText="Comma-separated list of your skills"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Website"
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                {...register('website')}
                error={errors.website?.message}
              />
              
              <Input
                label="Phone"
                id="phone"
                placeholder="+1 (123) 456-7890"
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>
            
            <Input
              label="Resume URL"
              id="resumeUrl"
              type="url"
              placeholder="https://drive.google.com/your-resume"
              {...register('resumeUrl')}
              error={errors.resumeUrl?.message}
              helperText="Link to your resume (Google Drive, Dropbox, etc.)"
            />
            
            <TextArea
              label="Experience"
              id="experience"
              placeholder="Describe your work experience..."
              rows={5}
              {...register('experience')}
              error={errors.experience?.message}
              helperText="List your work experience, including company names, roles, and responsibilities"
            />
            
            <TextArea
              label="Education"
              id="education"
              placeholder="Describe your educational background..."
              rows={5}
              {...register('education')}
              error={errors.education?.message}
              helperText="List your education history, including schools, degrees, and graduation years"
            />
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
              >
                {profile ? 'Update Profile' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;