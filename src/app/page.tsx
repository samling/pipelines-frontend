'use client';

import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, getApiHeaders } from '@/config/api';
import JsonEditor from '@/components/JsonEditor';
import Toast from '@/components/Toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Pipeline {
  id: string;
  name: string;
  type: string;
  valves: boolean;
}

interface Model {
  id: string;
  name: string;
  object: string;
  created: number;
  owned_by: string;
  pipeline: {
    type: string;
    pipelines?: string[];
    priority?: number;
    valves: boolean;
  };
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

// Define a more specific type for valve values
type ValveValue = string | number | boolean | null | ValveValue[] | { [key: string]: ValveValue };

// Define the structure for valves data
interface ValvesData {
  [key: string]: ValveValue;
}

export default function PipelineManager() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [valvesData, setValvesData] = useState<ValvesData | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [pipelineUrl, setPipelineUrl] = useState('');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [isUpdatingValves, setIsUpdatingValves] = useState(false);
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }

  const handleValvesDataChange = (newData: ValvesData) => {
    setValvesData(newData);
  };

  // Fetch pipelines and models
  useEffect(() => {
    fetchPipelines();
    fetchModels();
  }, []);

  const fetchPipelines = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/pipelines`, {
        headers: getApiHeaders(),
      });
      const data = await response.json();
      setPipelines(data.data);
    } catch (error) {
      console.error('Error fetching pipelines:', error);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/models`, {
        headers: getApiHeaders(),
      });
      const data = await response.json();
      setModels(data.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const fetchValves = async (pipelineId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/${pipelineId}/valves`, {
        headers: getApiHeaders(),
      });
      const data = await response.json();
      setValvesData(data);
      setSelectedPipeline(pipelineId);
    } catch (error) {
      console.error('Error fetching valves:', error);
    }
  };

  const handleUpdateValves = async (pipelineId: string, newValvesData: ValvesData) => {
    try {
      setIsUpdatingValves(true);
      const response = await fetch(`${API_BASE_URL}/v1/${pipelineId}/valves/update`, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(newValvesData),
      });
      const data = await response.json();
      setValvesData(data);
      
      // Fetch models after updating valves
      await fetchModels();
      
      showToast('Valves updated successfully', 'success');
    } catch (error) {
      console.error('Error updating valves:', error);
      showToast('Failed to update valves', 'error');
    } finally {
      setIsUpdatingValves(false);
    }
  };

  const handleDeletePipeline = async (pipelineId: string) => {
    try {
      await fetch(`${API_BASE_URL}/v1/pipelines/delete`, {
        method: 'DELETE',
        headers: getApiHeaders(),
        body: JSON.stringify({ id: pipelineId }),
      });
      await fetchPipelines();
      await fetchModels();
      showToast('Pipeline deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting pipeline:', error);
      showToast('Failed to delete pipeline', 'error');
    }
  };

  const handleFileUpload = async () => {
    if (!fileToUpload) return;

    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      setIsUploading(true);
      const headers = {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      };
      await fetch(`${API_BASE_URL}/v1/pipelines/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      await fetchPipelines();
      await fetchModels();
      setFileToUpload(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      showToast('Pipeline uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading pipeline:', error);
      showToast('Failed to upload pipeline', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPipelineUrl = async () => {
    setIsAddingUrl(true);
    try {
      await fetch(`${API_BASE_URL}/v1/pipelines/add`, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({ url: pipelineUrl }),
      });
      await fetchPipelines();
      await fetchModels();
      setPipelineUrl('');
      showToast('Pipeline added successfully', 'success');
    } catch (error) {
      console.error('Error adding pipeline:', error);
      showToast('Failed to add pipeline', 'error');
    } finally {
      setIsAddingUrl(false);
    }
  };
  const handleReloadPipelines = async () => {
    setIsReloading(true);
    try {
      await fetch(`${API_BASE_URL}/v1/pipelines/reload`, {
        method: 'POST',
        headers: getApiHeaders(),
      });
      await fetchPipelines();
      await fetchModels();
      showToast('Pipelines reloaded successfully', 'success');
    } catch (error) {
      console.error('Error reloading pipelines:', error);
      showToast('Failed to reload pipelines', 'error');
    } finally {
      setIsReloading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Pipeline Manager
      </h1>
      
      {/* Add Pipeline Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Add Pipeline</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Upload File</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".py"
                    onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      dark:file:bg-gray-700 dark:file:text-gray-300
                      p-2 border rounded-md border-gray-300 dark:border-gray-600"
                    disabled={isUploading}
                  />
                </div>
                <button
                  onClick={handleFileUpload}
                  disabled={!fileToUpload || isUploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium 
                    text-white bg-blue-600 hover:bg-blue-700 
                    disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                    transition-colors duration-200 whitespace-nowrap"
                >
                  {isUploading ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span className="ml-2">Uploading...</span>
                    </>
                  ) : (
                    'Upload Pipeline'
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Add from URL</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={pipelineUrl}
                  onChange={(e) => setPipelineUrl(e.target.value)}
                  placeholder="Enter pipeline URL"
                  className="flex-1 min-w-0 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  disabled={isAddingUrl}
                />
                <button
                  onClick={handleAddPipelineUrl}
                  disabled={!pipelineUrl || isAddingUrl}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium 
                    text-white bg-blue-600 hover:bg-blue-700 
                    disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                    transition-colors duration-200 whitespace-nowrap"
                >
                  {isAddingUrl ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span className="ml-2">Adding...</span>
                    </>
                  ) : (
                    'Add Pipeline'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipelines List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Pipelines</h2>
          <button
            onClick={handleReloadPipelines}
            disabled={isReloading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium 
              text-white bg-green-600 hover:bg-green-700 
              disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
              transition-colors duration-200"
          >
            {isReloading ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Reloading...</span>
              </>
            ) : (
              'Reload Pipelines'
            )}
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pipelines.map((pipeline) => (
              <div key={pipeline.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 hover:shadow-md transition-shadow duration-200">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{pipeline.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Type: {pipeline.type}</p>
                  <div className="flex gap-2">
                    {pipeline.valves && (
                      <button
                        onClick={() => fetchValves(pipeline.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        View Valves
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePipeline(pipeline.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Valves Editor */}
      {selectedPipeline && valvesData && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Valves Editor - {selectedPipeline}
            </h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <JsonEditor
                data={valvesData}
                onChange={handleValvesDataChange}
                disabled={isUpdatingValves}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdateValves(selectedPipeline, valvesData)}
                disabled={isUpdatingValves}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isUpdatingValves ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedPipeline(null);
                  setValvesData(null);
                }}
                disabled={isUpdatingValves}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Close Editor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Models Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Models</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {models.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {model.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {model.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}