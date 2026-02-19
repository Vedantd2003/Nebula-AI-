import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiClock, FiTrash2, FiFileText, FiCpu } from 'react-icons/fi';
import { aiAPI } from '../services/api';
import { toast } from 'react-hot-toast';

function History() {
  const queryClient = useQueryClient();

  // Fetch History
  const { data, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => aiAPI.getHistory(),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => aiAPI.deleteGeneration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      toast.success('Record deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  });

  const generations = data?.data?.data?.generations || [];

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this generation?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nebula-500" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold gradient-text mb-2">
          Generation History
        </h1>
        <p className="text-dark-600">Review and manage your previous AI interactions</p>
      </div>

      <div className="space-y-4">
        {generations.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center">
            <FiClock className="w-16 h-16 mx-auto mb-4 text-dark-500" />
            <p className="text-dark-600">No generations found. Start creating!</p>
          </div>
        ) : (
          generations.map((gen) => (
            <div key={gen._id} className="glass p-6 rounded-2xl hover:bg-white/5 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center gap-1 px-3 py-1 bg-nebula-600/20 text-nebula-400 text-xs font-semibold rounded-full uppercase">
                      {gen.type === 'analyze' ? <FiFileText /> : <FiCpu />}
                      {gen.type}
                    </span>
                    <span className="text-xs text-dark-500 italic">
                      {new Date(gen.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-dark-700 font-medium line-clamp-2">{gen.prompt}</p>
                </div>
                
                <button 
                  onClick={() => handleDelete(gen._id)}
                  disabled={deleteMutation.isPending}
                  className="p-3 glass rounded-xl hover:bg-red-500/20 text-red-400 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  title="Delete Record"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 bg-dark-900/30 rounded-xl border border-white/5 text-sm text-dark-800">
                <div className="line-clamp-4 overflow-hidden">
                   {typeof gen.response === 'string' ? gen.response : JSON.stringify(gen.response)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;