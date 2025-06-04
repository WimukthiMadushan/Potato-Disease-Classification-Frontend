'use client';
import React, { useState, useRef } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Loader2, Upload,Image, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface PredictionResult {
  class: 'Healthy' | 'Early Blight' | 'Late Blight';
  confidence: number;
}

export interface PredictionResult {
  class: 'Healthy' | 'Early Blight' | 'Late Blight';
  confidence: number;
}


export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (imageFile: File) => {
    const imageUrl = URL.createObjectURL(imageFile);
    setUploadedImage(imageUrl);
    setIsLoading(true);
    setPrediction(null);

    // Simulate API call with mock data
    setTimeout(() => {
      const mockPredictions: PredictionResult[] = [
        { class: 'Late Blight', confidence: 0.4577193558216095 },
        { class: 'Early Blight', confidence: 0.8234567890123456 },
        { class: 'Healthy', confidence: 0.9123456789012345 }
      ];
      
      const randomPrediction = mockPredictions[Math.floor(Math.random() * mockPredictions.length)];
      setPrediction(randomPrediction);
      setIsLoading(false);
    }, 2000);
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setUploadedImage(null);
    setPrediction(null);
    setIsLoading(false);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Healthy':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Healthy Leaf',
          description: 'The potato leaf appears to be healthy with no signs of disease.',
          recommendation: 'Continue with regular care and monitoring.'
        };
      case 'Early Blight':
        return {
          icon: AlertTriangle,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          title: 'Early Blight Detected',
          description: 'Early stage blight disease detected on the potato leaf.',
          recommendation: 'Apply fungicide treatment and improve air circulation.'
        };
      case 'Late Blight':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Late Blight Detected',
          description: 'Advanced blight disease detected. Immediate action required.',
          recommendation: 'Remove affected plants immediately and apply appropriate treatment.'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Unknown Status',
          description: 'Unable to determine the leaf condition.',
          recommendation: 'Please try uploading a clearer image.'
        };
    }
  };

  const renderImageUpload = () => {
    if (uploadedImage) {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Uploaded Image</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="text-gray-600 hover:text-red-600"
            >
              <X className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <div className="relative">
            <img 
              src={uploadedImage} 
              alt="Uploaded potato leaf" 
              className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-medium">
              ✓ Image uploaded successfully! Analysis in progress...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Potato Leaf Image</h2>
        
        <div
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
            ${isDragOver 
              ? 'border-green-400 bg-green-50' 
              : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className={`
              w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors
              ${isDragOver ? 'bg-green-100' : 'bg-gray-100'}
            `}>
              {isDragOver ? (
                <Upload className="w-8 h-8 text-green-600" />
              ) : (
                <Image className="w-8 h-8 text-gray-600" />
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragOver ? 'Drop your image here' : 'Upload potato leaf image'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop an image, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supports: JPG, PNG, WEBP (Max 10MB)
              </p>
            </div>
            
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
              type="button"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Tips for best results:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use clear, well-lit photos</li>
            <li>• Focus on individual leaves</li>
            <li>• Avoid blurry or dark images</li>
            <li>• Show the entire leaf if possible</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderPredictionDisplay = () => {
    if (!uploadedImage) {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
          <div className="text-center py-12 flex-1 flex flex-col justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No image uploaded yet</p>
            <p className="text-sm text-gray-400">
              Upload a potato leaf image to get started with the analysis
            </p>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
          <div className="text-center py-12 flex-1 flex flex-col justify-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <p className="text-gray-700 font-medium mb-2">Analyzing image...</p>
            <p className="text-sm text-gray-500 mb-4">
              Our AI model is processing your potato leaf image
            </p>
            <div className="max-w-xs mx-auto">
              <Progress value={75} className="h-2" />
            </div>
          </div>
        </div>
      );
    }

    if (!prediction) {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
          <div className="text-center py-12 flex-1 flex flex-col justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">Analysis pending</p>
            <p className="text-sm text-gray-400">
              Waiting for image analysis to complete
            </p>
          </div>
        </div>
      );
    }

    const config = getStatusConfig(prediction.class);
    const confidencePercentage = Math.round(prediction.confidence * 100);
    const IconComponent = config.icon;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Analysis Results</h2>
        
        <div className="flex-1 flex flex-col">
          <Card className={`p-6 ${config.bgColor} ${config.borderColor} border-2 mb-6`}>
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full ${config.bgColor}`}>
                <IconComponent className={`w-8 h-8 ${config.color}`} />
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${config.color} mb-2`}>
                  {config.title}
                </h3>
                <p className="text-gray-700 mb-3">
                  {config.description}
                </p>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Confidence Level</span>
                    <span className={`text-sm font-bold ${config.color}`}>
                      {confidencePercentage}%
                    </span>
                  </div>
                  <Progress 
                    value={confidencePercentage} 
                    className="h-3"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="p-4 bg-gray-50 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Recommendation</h4>
            <p className="text-gray-600 text-sm">
              {config.recommendation}
            </p>
          </div>

          <div className="text-center mt-auto">
            <p className="text-xs text-gray-500">
              Results generated by AI model • For educational purposes
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-green-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">LeafCheck AI</h1>
                <p className="text-xs text-gray-600">Potato Disease Detection</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                How it Works
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Potato Leaf Disease Detection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload an image of a potato leaf and get instant AI-powered predictions 
            to detect healthy leaves, early blight, or late blight diseases.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <div className="h-full">
            {renderImageUpload()}
          </div>
          
          <div className="h-full">
            {renderPredictionDisplay()}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-700">Upload Image</h3>
                <p className="text-sm text-gray-600">
                  Take or upload a clear photo of a potato leaf
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-700">AI Analysis</h3>
                <p className="text-sm text-gray-600">
                  Our machine learning model analyzes the leaf
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-700">Get Results</h3>
                <p className="text-sm text-gray-600">
                  Receive instant disease detection results
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
