import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['employer', 'jobseeker'], {
    errorMap: () => ({ message: 'Please select a role' }),
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'jobseeker'
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);
      await registerUser(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-600 mt-2">Join JobBoardX to connect with opportunities</p>
        </div>

        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            id="name"
            placeholder="John Doe"
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="Email Address"
            type="email"
            id="email"
            placeholder="you@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
            helperText="Must be at least 6 characters"
          />

          <Select
            label="I am a..."
            id="role"
            {...register('role')}
            options={[
              { value: 'jobseeker', label: 'Job Seeker' },
              { value: 'employer', label: 'Employer' },
            ]}
            error={errors.role?.message}
          />

          <div className="mt-1">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;