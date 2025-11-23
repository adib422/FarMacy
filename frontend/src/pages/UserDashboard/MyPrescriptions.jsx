import React, { useState, useEffect, useRef } from 'react';
import './MyPrescriptions.css';
import { getUserPrescriptions, uploadPrescription, deletePrescription, downloadPrescription } from '../../services/prescriptionApi';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    const result = await getUserPrescriptions();
    if (result.success) {
      setPrescriptions(result.prescriptions);
    }
    setLoading(false);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ 
        type: 'error', 
        text: 'Only JPG, PNG, and PDF files are allowed' 
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ 
        type: 'error', 
        text: 'File size must be less than 5MB' 
      });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const result = await uploadPrescription(file);

    if (result.success) {
      setMessage({ type: 'success', text: 'Prescription uploaded successfully!' });
      fetchPrescriptions();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      const result = await deletePrescription(id);
      if (result.success) {
        setMessage({ type: 'success', text: 'Prescription deleted successfully!' });
        fetchPrescriptions();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    }
  };

  const handleDownload = (id) => {
    downloadPrescription(id);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return '📄';
    if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️';
    return '📁';
  };

  if (loading) {
    return <div className='my-prescriptions'><p>Loading prescriptions...</p></div>;
  }

  return (
    <div className='my-prescriptions'>
      <div className="prescriptions-header">
        <h2>My Prescriptions</h2>
        <div className="upload-section">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.pdf"
            style={{ display: 'none' }}
          />
          <button 
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? '⏳ Uploading...' : '📤 Upload Prescription'}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="upload-info">
        <p>📋 Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
        <p>💡 Upload your doctor's prescriptions for easy reference and reordering</p>
      </div>

      <div className="prescriptions-list">
        {prescriptions.length === 0 ? (
          <div className="no-prescriptions">
            <p>No prescriptions uploaded yet</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="upload-first-btn"
            >
              Upload your first prescription
            </button>
          </div>
        ) : (
          prescriptions.map((prescription) => (
            <div key={prescription.id} className="prescription-card">
              <div className="prescription-icon">
                {getFileIcon(prescription.file_name)}
              </div>
              <div className="prescription-info">
                <h4>{prescription.file_name}</h4>
                <div className="prescription-meta">
                  <span className="file-size">
                    {formatFileSize(prescription.file_size)}
                  </span>
                  <span className="upload-date">
                    Uploaded: {new Date(prescription.uploaded_at).toLocaleDateString('en-IN')}
                  </span>
                </div>
                {prescription.order_number && (
                  <span className="order-link">
                    Order #{prescription.order_number}
                  </span>
                )}
              </div>
              <div className="prescription-actions">
                <button 
                  onClick={() => handleDownload(prescription.id)} 
                  className="download-btn"
                  title="Download"
                >
                  ⬇️
                </button>
                <button 
                  onClick={() => handleDelete(prescription.id)} 
                  className="delete-btn"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyPrescriptions;