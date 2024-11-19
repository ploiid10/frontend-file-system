import  { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const options = {
        username: values.email,
        password: values.password,
      }
      const response = await API.post('/api/user/login', options);
      const { data } = response
      if (response.status === 200) {
        notification.success({ message: 'Login Successful!' });
        const token = data.token;
        localStorage.setItem('token', token);
        navigate('/files');
      } else {
        notification.error({ message: data || 'Login Failed' });
      }
    } catch (err) {
      notification.error({ message: `${err?.response?.data?.error || err.message}` });
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',  // Full height of the viewport
        backgroundColor: '#f0f2f5',  // Optional: to give a nice background color
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',  // You can adjust the width as needed
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',  // Rounded corners
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Adding a box shadow
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, type: 'email', message: 'Please input a valid email' },
              { required: true, message: 'Please input your email!' }
            ]}
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

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button
              type="link"
              onClick={() => navigate('/register')}  // Redirect to register page
            >
              Don&apos;t have an account? Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
