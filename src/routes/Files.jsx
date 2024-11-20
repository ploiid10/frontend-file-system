import { useEffect, useState } from 'react';
import { Upload, Button, Table, message, Modal, Input } from 'antd';
import { InboxOutlined, EditOutlined } from '@ant-design/icons';
import API from '../utils/api';

const { Dragger } = Upload;

const Files = () => {
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [editingFile, setEditingFile] = useState(null); // The file being edited
  const [tags, setTags] = useState(''); // Tags input state

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, status } = await API.get('/api/files');
      if (data && status === 201) {
        setFileList(data);
      }
    };

    fetchFiles();
  }, []);

  // Dummy API calls for file upload
  const handleUpload = async (file) => {
 
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await API.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFileList((files) => [...files, response.data.file])
      message.success(`${file.name} uploaded successfully.`);
    } catch {
      message.error('Videos and images are the only file types allowed.')
    }
  };

  // Handle updating tags for a file
  const handleUpdateTags = async () => {
    if (!tags) {
      message.error('Tags cannot be empty.');
      return;
    }

    const updatedTags = tags.split(',').map((tag) => tag.trim()); // Split tags by commas and remove extra spaces

    try {
      await API.put(`/api/files/update/${editingFile._id}`, {
        tags: updatedTags,
      });
      message.success('File tags updated successfully.');

      // Update the file in the local state
      setFileList(
        fileList.map((file) =>
          file._id === editingFile._id ? { ...file, tags: updatedTags } : file
        )
      );
      setIsModalVisible(false);
      setTags(''); // Clear the tags input
    } catch (error) {
      console.error(error);
      message.error('Failed to update file tags.');
    }
  };

  const getShareableLink = async (filename) => {
    try {
      const response = await API.get(`/api/files/shareable-link/${filename}`);
      navigator.clipboard.writeText(response.data.shareableLink)
      message.success('Shareable link generated successfully and copied to clipboard!');
    } catch (error) {
      console.error(error)
      message.error('Failed to generate shareable link');
    }
  };

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'originalname',
      key: 'originalname',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => tags.join(', '), // Display tags as comma-separated values
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      render: (views) => views,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button onClick={() => getShareableLink(record.filename)} style={{ marginRight: '10px' }}>Get Shareable Link</Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingFile(record);
              setTags(record.tags.join(', ')); // Pre-fill the tags
              setIsModalVisible(true); // Show the modal
            }}
          >
            Edit Tags
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>File Manager</h2>
      <Dragger
        name="file"
        multiple
        beforeUpload={handleUpload}
        showUploadList={false}
        customRequest={() => {}}
        style={{ marginBottom: '2rem' }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
      </Dragger>

      <Table dataSource={fileList} columns={columns} rowKey={(row) => row._id} />

      {/* Modal for editing tags */}
      <Modal
        title="Edit File Tags"
        open={isModalVisible}
        onOk={handleUpdateTags}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags (comma-separated)"
        />
      </Modal>
    </div>
  );
};

export default Files;
