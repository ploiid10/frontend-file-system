import { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const options = {
        username: values.email,
        password: values.password,
      }
      const response = await API.post('/api/user/register', options);
      const { data } = response;
      if (response.status === 201) {
        notification.success({ message: 'Registration Successful!' });
        navigate('/');  // Redirect to login page after successful registration
      } else {
        notification.error({ message: data.message || 'Registration Failed' });
      }
    } catch (err) {
      notification.error({ message: err?.response?.data?.message ?? 'An error occurred during registration' });
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={handleRegister}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('The two passwords do not match!');
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Sign up
            </Button>
          </Form.Item>

          {/* Login Link Button */}
          <Form.Item style={{ textAlign: 'center' }}>
            <Button
              type="link"
              onClick={() => navigate('/')}  // Redirect to login page
            >
              Already have an account? Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
