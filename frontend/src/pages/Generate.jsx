import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiSend, FiCopy, FiDownload } from 'react-icons/fi';
import { aiAPI } from '../services/api';

function Generate() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [contentType, setContentType] = useState('article');

  const generateMutation = useMutation({
    mutationFn: (data) => aiAPI.generateContent(data),
    onSuccess: (response) => {
      setResult(response.data.data.content);
      toast.success('Content generated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Generation failed');
    },
  });

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    generateMutation.mutate({ prompt, contentType });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-content.txt';
    a.click();
    toast.success('Downloaded!');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold gradient-text mb-2">
          AI Content Generator
        </h1>
        <p className="text-dark-600">Create amazing content with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4">Your Prompt</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-dark-700 mb-2">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="input-nebula"
            >
              <option value="article">Article</option>
              <option value="blog">Blog Post</option>
              <option value="social">Social Media</option>
              <option value="email">Email</option>
              <option value="story">Creative Story</option>
            </select>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">
                What do you want to create?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Write a blog post about the future of AI technology..."
                className="textarea-nebula min-h-[200px]"
              />
            </div>

            <button
              type="submit"
              disabled={generateMutation.isPending}
              className="w-full btn-neon flex items-center justify-center gap-2"
            >
              {generateMutation.isPending ? (
                <>
                  <div className="spinner w-5 h-5 border-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FiSend />
                  Generate Content
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Section */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Generated Content</h2>
            {result && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 glass rounded-lg hover:bg-white/10 transition-all"
                  title="Copy"
                >
                  <FiCopy className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 glass rounded-lg hover:bg-white/10 transition-all"
                  title="Download"
                >
                  <FiDownload className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="min-h-[400px] p-4 bg-dark-100/50 rounded-xl">
            {result ? (
              <div className="text-dark-900 whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-dark-500">
                Your generated content will appear here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 glass p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">💡 Tips for Better Results</h3>
        <ul className="space-y-2 text-dark-600">
          <li>• Be specific about your topic and desired outcome</li>
          <li>• Include target audience information if relevant</li>
          <li>• Specify tone (professional, casual, humorous, etc.)</li>
          <li>• Mention key points you want to cover</li>
          <li>• Indicate desired length or word count</li>
        </ul>
      </div>
    </div>
  );
}

export default Generate;
